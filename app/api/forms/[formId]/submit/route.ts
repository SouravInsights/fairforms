import { db } from "@/db";
import { forms, responses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { FormElement, FormElementType, FormElementValue } from "@/types/form";

interface BaseFormattedResponse {
  elementId: string;
  elementType: FormElementType;
  question: string;
  description?: string;
  timestamp: string;
}

interface ChoiceFormattedResponse extends BaseFormattedResponse {
  elementType:
    | FormElementType.MULTIPLE_CHOICE
    | FormElementType.DROPDOWN
    | FormElementType.PICTURE_CHOICE;
  answer: string | string[];
  optionText: string | string[];
}

interface TextFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.SHORT_TEXT | FormElementType.LONG_TEXT;
  answer: string;
}

interface EmailFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.EMAIL;
  answer: string;
}

interface NumberFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.NUMBER;
  answer: number;
}

interface DateFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.DATE;
  answer: string; // ISO date string
}

interface PhoneFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.PHONE;
  answer: {
    countryCode: string;
    number: string;
  };
}

interface AddressFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.ADDRESS;
  answer: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
}

interface ContactInfoFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.CONTACT_INFO;
  answer: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
}

interface WebsiteFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.WEBSITE;
  answer: string;
}

interface FileUploadFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.FILE_UPLOAD;
  answer: string[]; // Array of file URLs
}

interface WelcomeScreenFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.WELCOME_SCREEN;
  answer: boolean;
}

interface EndScreenFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.END_SCREEN;
  answer: boolean;
}

interface StatementFormattedResponse extends BaseFormattedResponse {
  elementType: FormElementType.STATEMENT;
  answer: null;
}

type FormattedResponse =
  | ChoiceFormattedResponse
  | TextFormattedResponse
  | EmailFormattedResponse
  | NumberFormattedResponse
  | DateFormattedResponse
  | PhoneFormattedResponse
  | AddressFormattedResponse
  | ContactInfoFormattedResponse
  | WebsiteFormattedResponse
  | FileUploadFormattedResponse
  | WelcomeScreenFormattedResponse
  | EndScreenFormattedResponse
  | StatementFormattedResponse;

type RawResponseValue =
  | string
  | string[]
  | number
  | boolean
  | null
  | undefined
  | { countryCode: string; number: string } // Phone
  | {
      // Address
      street: string;
      apartment?: string;
      city: string;
      state: string;
      zipCode: string;
      country?: string;
    }
  | {
      // Contact Info
      firstName: string;
      lastName: string;
      middleName?: string;
    };

interface SubmissionData {
  raw: Record<string, RawResponseValue>;
  formatted: FormattedResponse[];
  submittedAt: string;
}

function formatResponse(
  element: FormElement,
  answer: FormElementValue
): FormattedResponse | null | undefined {
  const baseResponse = {
    elementId: element.id,
    elementType: element.type,
    question: element.question,
    description: element.description,
    timestamp: new Date().toISOString(),
  };

  // Type guard for multiple choice/dropdown options
  function isChoiceOption(
    option: { id: string; text: string; imageUrl?: string } | undefined
  ): option is { id: string; text: string; imageUrl?: string } {
    return option !== undefined && "text" in option;
  }

  // Type guard for picture choice options
  function isPictureOption(
    option: { id: string; imageUrl: string; caption: string } | undefined
  ): option is { id: string; imageUrl: string; caption: string } {
    return option !== undefined && "caption" in option;
  }

  switch (element.type) {
    case FormElementType.MULTIPLE_CHOICE:
    case FormElementType.DROPDOWN: {
      const options = element.properties.options;
      const optionText = Array.isArray(answer)
        ? answer.map((a) => {
            const option = options.find((o) => o.id === a);
            return isChoiceOption(option) ? option.text : "";
          })
        : (() => {
            const option = options.find((o) => o.id === (answer as string));
            return isChoiceOption(option) ? option.text : "";
          })();

      return {
        ...baseResponse,
        elementType: element.type,
        answer: answer as string | string[],
        optionText,
      };
    }

    case FormElementType.PICTURE_CHOICE: {
      const options = element.properties.options;
      const optionText = Array.isArray(answer)
        ? answer.map((a) => {
            const option = options.find((o) => o.id === a);
            return isPictureOption(option) ? option.caption : "";
          })
        : (() => {
            const option = options.find((o) => o.id === (answer as string));
            return isPictureOption(option) ? option.caption : "";
          })();

      return {
        ...baseResponse,
        elementType: element.type,
        answer: answer as string | string[],
        optionText,
      };
    }

    case FormElementType.SHORT_TEXT:
    case FormElementType.LONG_TEXT:
    case FormElementType.EMAIL:
    case FormElementType.WEBSITE:
      if (typeof answer !== "string") return null;
      return {
        ...baseResponse,
        elementType: element.type,
        answer,
      };

    case FormElementType.NUMBER:
      if (typeof answer !== "number") return null;
      return {
        ...baseResponse,
        elementType: element.type,
        answer,
      };

    case FormElementType.DATE:
      if (!(answer instanceof Date || typeof answer === "string")) return null;
      return {
        ...baseResponse,
        elementType: element.type,
        answer: answer instanceof Date ? answer.toISOString() : answer,
      };

    case FormElementType.PHONE: {
      const phoneAnswer = answer as { countryCode: string; number: string };
      if (!phoneAnswer?.countryCode || !phoneAnswer?.number) return null;
      return {
        ...baseResponse,
        elementType: element.type,
        answer: phoneAnswer,
      };
    }

    case FormElementType.ADDRESS: {
      const addressAnswer = answer as {
        street: string;
        apartment?: string;
        city: string;
        state: string;
        zipCode: string;
        country?: string;
      };
      if (
        !addressAnswer?.street ||
        !addressAnswer?.city ||
        !addressAnswer?.state
      )
        return null;
      return {
        ...baseResponse,
        elementType: element.type,
        answer: addressAnswer,
      };
    }

    case FormElementType.CONTACT_INFO: {
      const contactAnswer = answer as {
        firstName: string;
        lastName: string;
        middleName?: string;
      };
      if (!contactAnswer?.firstName || !contactAnswer?.lastName) return null;
      return {
        ...baseResponse,
        elementType: element.type,
        answer: contactAnswer,
      };
    }

    case FormElementType.FILE_UPLOAD:
      if (!Array.isArray(answer)) return null;
      return {
        ...baseResponse,
        elementType: element.type,
        answer: answer as string[], // Array of file URLs
      };

    case FormElementType.WELCOME_SCREEN:
    case FormElementType.END_SCREEN:
      return {
        ...baseResponse,
        elementType: element.type,
        answer: Boolean(answer),
      };

    case FormElementType.STATEMENT:

    default:
      return undefined;
  }
}

export async function POST(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const formId = parseInt(params.formId);
    const { responses: formResponses } = await req.json();

    const [form] = await db.select().from(forms).where(eq(forms.id, formId));

    if (!form || !form.isPublished) {
      return NextResponse.json(
        { error: "Form not found or not published" },
        { status: 404 }
      );
    }

    // Format responses with proper typing
    const formattedResponses = form.elements
      .map((element) => formatResponse(element, formResponses[element.id]))
      .filter((response): response is FormattedResponse => response !== null);

    const submissionData: SubmissionData = {
      raw: formResponses,
      formatted: formattedResponses,
      submittedAt: new Date().toISOString(),
    };

    const [response] = await db
      .insert(responses)
      .values({
        formId,
        answers: submissionData,
        submittedAt: new Date(),
      })
      .returning();

    return NextResponse.json(response);
  } catch (error) {
    console.error("[FORM_SUBMIT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
