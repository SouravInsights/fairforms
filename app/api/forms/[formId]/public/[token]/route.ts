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
import { FormElementType } from "@/types/form";
import { formatResponseValue } from "@/app/(dashboard)/dashboard/forms/[formId]/responses/format-response";

export async function GET(
  req: Request,
  { params }: { params: { formId: string; token: string } }
) {
  try {
    const { formId, token } = params;
    const formIdNumber = parseInt(formId);

    const decryptedFormId = decryptFormId(token);
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
              readableAnswer: formatResponseValue(
                element,
                formattedResponse.answer
              ),
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
    });
  } catch (error) {
    console.error("[PUBLIC_RESPONSES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
