import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms, responses } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { FormElement, FormElementType } from "@/types/form";
import { FormResponse, ResponseValue } from "@/types/response";

function isValidResponseValue(value: unknown): value is ResponseValue {
  if (value === null || value === undefined) return true;

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    Array.isArray(value)
  ) {
    return true;
  }

  if (typeof value === "object") {
    // Check for phone type
    if ("countryCode" in value && "number" in value) {
      return (
        typeof value.countryCode === "string" &&
        typeof value.number === "string"
      );
    }

    // Check for address type
    if (
      "street" in value &&
      "city" in value &&
      "state" in value &&
      "zipCode" in value
    ) {
      return true;
    }

    // Check for contact info type
    if ("firstName" in value && "lastName" in value) {
      return true;
    }
  }

  return false;
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

    // Check form ownership
    const [form] = await db.select().from(forms).where(eq(forms.id, formId));

    if (!form || form.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get responses
    const formResponses = await db
      .select()
      .from(responses)
      .where(eq(responses.formId, formId))
      .orderBy(responses.submittedAt);

    // Type-safe conversion of responses
    const typedResponses: FormResponse[] = formResponses.map((response) => {
      const rawAnswers = response.answers as Record<string, unknown>;
      const typedAnswers: Record<string, ResponseValue> = {};

      // Validate each answer value
      Object.entries(rawAnswers).forEach(([key, value]) => {
        if (isValidResponseValue(value)) {
          typedAnswers[key] = value;
        }
      });

      return {
        id: response.id,
        formId: response.formId,
        answers: typedAnswers,
        submittedAt: response.submittedAt.toISOString(),
      };
    });

    const enrichedResponses = typedResponses.map((response) => ({
      ...response,
      enrichedAnswers: Object.entries(response.answers)
        .map(([elementId, answer]) => {
          const element = form.elements.find(
            (el) => el.id === elementId
          ) as FormElement;
          if (!element) return null;

          return {
            elementId,
            question: element.question,
            type: element.type,
            answer,
            readableAnswer: formatResponseValue(element, answer),
          };
        })
        .filter(
          (answer): answer is NonNullable<typeof answer> => answer !== null
        ),
    }));

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

function formatResponseValue(
  element: FormElement,
  value: ResponseValue
): string {
  if (value === null || value === undefined) return "-";

  switch (element.type) {
    case FormElementType.MULTIPLE_CHOICE:
    case FormElementType.DROPDOWN:
    case FormElementType.PICTURE_CHOICE:
      if (Array.isArray(value)) {
        return value
          .map((v) => {
            const option = element.properties.options.find(
              (opt) => opt.id === v
            );
            return option
              ? "text" in option
                ? option.text
                : option.caption
              : v;
          })
          .join(", ");
      }
      const option = element.properties.options.find((opt) => opt.id === value);
      return option
        ? "text" in option
          ? option.text
          : option.caption
        : String(value);

    case FormElementType.PHONE:
      if (typeof value === "object" && "countryCode" in value) {
        return `${value.countryCode} ${value.number}`;
      }
      break;

    case FormElementType.ADDRESS:
      if (typeof value === "object" && "street" in value) {
        return [
          value.street,
          value.apartment,
          value.city,
          value.state,
          value.zipCode,
          value.country,
        ]
          .filter(Boolean)
          .join(", ");
      }
      break;

    case FormElementType.CONTACT_INFO:
      if (typeof value === "object" && "firstName" in value) {
        return [value.firstName, value.middleName, value.lastName]
          .filter(Boolean)
          .join(" ");
      }
      break;
  }

  return String(value);
}
