import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { collaborators, forms, responses } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { FormElement, FormElementType } from "@/types/form";
import {
  EnrichedResponse,
  ResponseValue,
  FormattedResponse,
  EnrichedAnswer,
} from "@/types/response";

function formatResponseValue(
  formElement: FormElement,
  formattedResponse: FormattedResponse
): string {
  const { answer, optionText } = formattedResponse;

  // If no answer was provided, show a dash
  if (answer === null || answer === undefined) return "-";

  // For elements with predefined options, use optionText if available
  if (optionText) return optionText;

  // Handle specific element types
  switch (formElement.type) {
    case FormElementType.MULTIPLE_CHOICE:
    case FormElementType.DROPDOWN:
    case FormElementType.PICTURE_CHOICE: {
      const options = formElement.properties.options;

      // Handle multiple selections
      if (Array.isArray(answer)) {
        return answer
          .map(
            (selectedOption) =>
              options.find((opt) => opt.id === selectedOption)?.id ||
              String(selectedOption)
          )
          .join(", ");
      }

      // Single selection
      const option = options.find((opt) => opt.id === answer);
      return option?.id || String(answer);
    }

    case FormElementType.PHONE:
      return typeof answer === "object" && "countryCode" in answer
        ? `${answer.countryCode} ${answer.number}`
        : String(answer);

    case FormElementType.ADDRESS:
      return typeof answer === "object" && "street" in answer
        ? Object.values(answer).filter(Boolean).join(", ")
        : String(answer);

    case FormElementType.CONTACT_INFO:
      return typeof answer === "object" && "firstName" in answer
        ? [answer.firstName, answer.middleName, answer.lastName]
            .filter(Boolean)
            .join(" ")
        : String(answer);

    default:
      return String(answer);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formId = parseInt(params.formId);

    const [form] = await db.select().from(forms).where(eq(forms.id, formId));

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if user is owner
    const isOwner = form.userId === userId;

    if (!isOwner) {
      // Check if user is a collaborator with accepted status
      const [collaborator] = await db
        .select()
        .from(collaborators)
        .where(
          and(
            eq(collaborators.formId, formId),
            eq(collaborators.userId, userId),
            eq(collaborators.status, "accepted")
          )
        );

      // If not owner and not an accepted collaborator, return unauthorized
      if (!collaborator) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const formResponses = await db
      .select()
      .from(responses)
      .where(eq(responses.formId, formId))
      .orderBy(responses.submittedAt);

    const enrichedResponses: EnrichedResponse[] = formResponses.map(
      (response): EnrichedResponse => {
        const { formatted, submittedAt } = response.answers as {
          formatted: FormattedResponse[];
          submittedAt: string;
        };

        // Filter out non-question elements
        const questionResponses = formatted.filter(
          (item) =>
            ![
              FormElementType.WELCOME_SCREEN,
              FormElementType.END_SCREEN,
              FormElementType.STATEMENT,
            ].includes(item.elementType as FormElementType)
        );

        // Process answers
        const processedAnswers: Record<string, ResponseValue> = {};
        const enrichedAnswers = questionResponses
          .map((formattedResponse) => {
            const element = form.elements.find(
              (el) => el.id === formattedResponse.elementId
            );

            if (!element) {
              console.warn(
                `Element not found for ID: ${formattedResponse.elementId}`
              );
              return null;
            }

            // Store answer in processedAnswers
            processedAnswers[formattedResponse.elementId] =
              formattedResponse.answer;

            return {
              elementId: formattedResponse.elementId,
              question: formattedResponse.question || element.question,
              type: element.type,
              answer: formattedResponse.answer,
              readableAnswer: formatResponseValue(element, formattedResponse),
            };
          })
          .filter((answer): answer is EnrichedAnswer => answer !== null);

        return {
          ...response,
          processedAnswers,
          answers: { formatted, submittedAt },
          submittedAt,
          enrichedAnswers,
        };
      }
    );

    return NextResponse.json({
      form,
      responses: enrichedResponses,
      total: enrichedResponses.length,
    });
  } catch (error) {
    console.error("[FORM_RESPONSES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
