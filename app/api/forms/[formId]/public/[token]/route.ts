import { NextResponse } from "next/server";
import { db } from "@/db";
import { forms, responses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decryptFormId } from "@/lib/encrypt";
import {
  EnrichedAnswer,
  EnrichedResponse,
  FormattedResponse,
  ResponseValue,
} from "@/types/response";
import { FormElement, FormElementType } from "@/types/form";

export const revalidate = 60;

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
  { params }: { params: { formId: string; token: string } }
) {
  try {
    const { formId, token } = params;
    const formIdNumber = parseInt(formId);

    console.log("Public Route - Request received:", { formId, token });

    const decryptedFormId = decryptFormId(token);
    console.log("Decrypted formId:", decryptedFormId);

    if (!decryptedFormId || parseInt(decryptedFormId) !== formIdNumber) {
      return NextResponse.json({ error: "Invalid link" }, { status: 401 });
    }

    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.id, formIdNumber));

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const formResponses = await db
      .select()
      .from(responses)
      .where(eq(responses.formId, formIdNumber))
      .orderBy(responses.submittedAt);

    console.log("Raw responses count:", formResponses.length);

    const enrichedResponses: EnrichedResponse[] = formResponses.map(
      (response): EnrichedResponse => {
        const { formatted, submittedAt } = response.answers as {
          formatted: FormattedResponse[];
          submittedAt: string;
        };

        const questionResponses = formatted.filter(
          (item) =>
            ![
              FormElementType.WELCOME_SCREEN,
              FormElementType.END_SCREEN,
              FormElementType.STATEMENT,
            ].includes(item.elementType as FormElementType)
        );

        const processedAnswers: Record<string, ResponseValue> = {};
        const enrichedAnswers = questionResponses
          .map((formattedResponse) => {
            const element = form.elements.find(
              (el) => el.id === formattedResponse.elementId
            );

            if (!element) return null;

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

    // After enrichment
    console.log("Enriched responses count:", enrichedResponses.length);

    // Log the timestamps of first and last response
    if (formResponses.length > 0) {
      console.log("First response time:", formResponses[0].submittedAt);
      console.log(
        "Last response time:",
        formResponses[formResponses.length - 1].submittedAt
      );
    }

    return NextResponse.json(
      {
        form,
        responses: enrichedResponses,
        total: enrichedResponses.length,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("[PUBLIC_RESPONSES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
