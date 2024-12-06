import { FormElement, FormElementType } from "@/types/form";
import { ResponseValue } from "@/types/response";

/* This utility helps us convert raw form responses into readable formats
 ** For example, turning "option1" into "Yes" for a multiple choice question
 */
export function formatResponseValue(
  element: FormElement,
  value: ResponseValue
): string {
  // If no answer was provided, show a dash
  if (value === null || value === undefined) return "-";

  // Handle different types of form elements
  switch (element.type) {
    // For questions where users pick from options (like multiple choice)
    case FormElementType.MULTIPLE_CHOICE:
    case FormElementType.DROPDOWN:
    case FormElementType.PICTURE_CHOICE:
      // If multiple answers were selected (array of answers)
      if (Array.isArray(value)) {
        return value
          .map((v) => {
            // Find the actual option text for each selected option ID
            const option = element.properties.options.find(
              (opt) => opt.id === v
            );
            // Return either the text/caption of the option, or the raw value if option not found
            return option
              ? "text" in option
                ? option.text
                : option.caption
              : v;
          })
          .join(", "); // Join all selected options with commas
      }
      // For single answer selections
      const option = element.properties.options.find((opt) => opt.id === value);
      return option
        ? "text" in option
          ? option.text
          : option.caption
        : String(value);

    // For phone number inputs
    case FormElementType.PHONE:
      if (typeof value === "object" && "countryCode" in value) {
        // Format phone number with country code
        return `${value.countryCode} ${value.number}`;
      }
      break;

    // For address inputs
    case FormElementType.ADDRESS:
      if (typeof value === "object" && "street" in value) {
        // Combine all address parts into one string
        return [
          value.street,
          value.apartment,
          value.city,
          value.state,
          value.zipCode,
          value.country,
        ]
          .filter(Boolean) // Remove empty values
          .join(", "); // Join with commas
      }
      break;

    // For contact info inputs
    case FormElementType.CONTACT_INFO:
      if (typeof value === "object" && "firstName" in value) {
        // Combine name parts into full name
        return [value.firstName, value.middleName, value.lastName]
          .filter(Boolean) // Remove empty values
          .join(" "); // Join with spaces
      }
      break;
  }

  // For any other type, just convert to string
  return String(value);
}
