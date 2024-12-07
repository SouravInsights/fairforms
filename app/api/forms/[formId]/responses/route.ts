import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms, responses } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { FormElement, FormElementType } from "@/types/form";
import { FormResponse, ResponseValue } from "@/types/response";

/**
 * Type guard to validate if a value matches the expected ResponseValue type.
 * This ensures type safety when processing form responses.
 *
 * @example
 *
 * Valid response values:
 * isValidResponseValue("text answer") // true
 * isValidResponseValue(42) // true
 * isValidResponseValue({ countryCode: "+1", number: "1234567890" }) // true
 *
 * Invalid response values:
 * isValidResponseValue({ invalid: "structure" }) // false
 * isValidResponseValue(undefined) // true (allows empty responses)
 *
 * @param value - The unknown value to check
 * @returns boolean indicating if the value matches ResponseValue type
 */
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

/**
 * GET handler for retrieving form responses.
 * Fetches, validates, and enriches form responses with readable values and metadata.
 *
 * @route GET /api/forms/{formId}/responses
 *
 * @param req - The request object
 * @param params - Route parameters containing formId
 *
 * @returns
 * On success: this is the JSON response structure:
 * ```
 * {
 *   form: Form;            // The complete form data
 *   responses: Array<{     // Array of enriched responses
 *     id: number;         // Response ID
 *     formId: number;     // Form ID
 *     submittedAt: string; // ISO date string
 *     answers: Record<string, ResponseValue>; // Raw answers
 *     enrichedAnswers: Array<{
 *       elementId: string;    // Form element ID
 *       question: string;     // Question text
 *       type: FormElementType; // Element type
 *       answer: ResponseValue; // Raw answer
 *       readableAnswer: string; // Formatted readable answer
 *     }>;
 *   }>;
 *   total: number;        // Total number of responses
 * }
 * ```
 *
 * On error: JSON response with error message
 * ```typescript
 * {
 *   error: string;        // Error message
 * }
 * ```
 *
 * @throws
 * - 401 if user is not authenticated or not authorized
 * - 500 for internal server errors
 *
 * @example
 * // Example response for a multiple choice question
 * {
 *   "form": { ... },
 *   "responses": [{
 *     "id": 1,
 *     "formId": 123,
 *     "submittedAt": "2024-12-05T14:30:00Z",
 *     "answers": {
 *       "question-1": "option-1"
 *     },
 *     "enrichedAnswers": [{
 *       "elementId": "question-1",
 *       "question": "What is your favorite color?",
 *       "type": "multiple_choice",
 *       "answer": "option-1",
 *       "readableAnswer": "Blue"
 *     }]
 *   }],
 *   "total": 1
 * }
 */
export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Convert string ID to number and fetch form
    const formId = parseInt(params.formId);

    const [form] = await db.select().from(forms).where(eq(forms.id, formId));

    // Check form ownership
    if (!form || form.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all responses for the form, ordered by submission time
    const formResponses = await db
      .select()
      .from(responses)
      .where(eq(responses.formId, formId))
      .orderBy(responses.submittedAt);

    /* Response Processing
     **
     ** Convert raw responses to typed responses with validation
     */
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

    /* Response Enrichment
     **
     ** Add question text and readable answers
     */
    const enrichedResponses = typedResponses.map((response) => ({
      ...response,
      enrichedAnswers: Object.entries(response.answers)
        .map(([elementId, answer]) => {
          // Find corresponding form element
          const element = form.elements.find(
            (el) => el.id === elementId
          ) as FormElement;
          if (!element) return null;

          // Return enriched answer with readable format
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

/**
 * Formats a response value into a human-readable string based on the element type.
 *
 * @returns A formatted string representation of the response
 *
 * @example
 * // Multiple choice
 * formatResponseValue(
 *   { type: "multiple_choice", properties: { options: [{ id: "opt1", text: "Yes" }] } },
 *   "opt1"
 * ) // Returns: "Yes"
 *
 * // Phone number
 * formatResponseValue(
 *   { type: "phone" },
 *   { countryCode: "+91", number: "8018048129" }
 * ) // Returns: "+91 8018048129"
 *
 * // Address
 * formatResponseValue(
 *   { type: "address" },
 *   { street: "Bhanpur, Near Sky Automobiles", city: "Cuttack", state: "OD", zipCode: "753001" }
 * ) // Returns: "Bhanpur, Near Sky Automobiles, Cuttack, OD, 753001"
 *
 * // Contact info
 * formatResponseValue(
 *   { type: "contact_info" },
 *   { firstName: "Sourav", lastName: "Nanda" }
 * ) // Returns: "Sourav Nanda"
 */
function formatResponseValue(
  element: FormElement,
  value: ResponseValue
): string {
  // Return a placeholder for empty values
  if (value === null || value === undefined) return "-";

  // Type-based Formatting
  switch (element.type) {
    // Choice Elements
    case FormElementType.MULTIPLE_CHOICE:
    case FormElementType.DROPDOWN:
    case FormElementType.PICTURE_CHOICE: {
      // Handle array responses (multiple selections)
      if (Array.isArray(value)) {
        // Map each selected option ID to its display text
        return value
          .map((v) => {
            const option = element.properties.options.find(
              (opt) => opt.id === v
            );
            // Use text for regular options, caption for picture choices
            return option
              ? "text" in option
                ? option.text
                : option.caption
              : v;
          })
          .join(", "); // Join multiple selections with commas
      }

      // Handle single selection
      const option = element.properties.options.find((opt) => opt.id === value);
      // Use text/caption if option found, otherwise use raw value
      return option
        ? "text" in option
          ? option.text
          : option.caption
        : String(value);
    }

    // Phone Number
    case FormElementType.PHONE: {
      // Check if value matches phone structure
      if (typeof value === "object" && "countryCode" in value) {
        // Format as "countryCode number"
        return `${value.countryCode} ${value.number}`;
      }
      break;
    }

    // Address
    case FormElementType.ADDRESS: {
      // Check if value matches address structure
      if (typeof value === "object" && "street" in value) {
        // Combine all address components
        return [
          value.street,
          value.apartment,
          value.city,
          value.state,
          value.zipCode,
          value.country,
        ]
          .filter(Boolean) // Remove empty/undefined values
          .join(", "); // Join with commas
      }
      break;
    }

    // Contact Information
    case FormElementType.CONTACT_INFO: {
      // Check if value matches contact structure
      if (typeof value === "object" && "firstName" in value) {
        // Combine name components
        return [value.firstName, value.middleName, value.lastName]
          .filter(Boolean) // Remove empty/undefined values
          .join(" "); // Join with spaces
      }
      break;
    }
  }

  // Fallback
  // Convert any other value to string
  return String(value);
}
