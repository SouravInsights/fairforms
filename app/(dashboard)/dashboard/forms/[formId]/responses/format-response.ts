import { FormElement, FormElementType } from "@/types/form";
import { ResponseValue } from "@/types/response";

export function formatResponseValue(
  element: FormElement,
  value: ResponseValue
): string {
  if (value === null || value === undefined) return "-";

  switch (element.type) {
    case FormElementType.MULTIPLE_CHOICE:
    case FormElementType.DROPDOWN:
    case FormElementType.PICTURE_CHOICE: {
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
    }

    case FormElementType.DATE:
      return typeof value === "string"
        ? new Date(value).toLocaleDateString()
        : String(value);

    case FormElementType.PHONE:
      return typeof value === "object" && "countryCode" in value
        ? `${value.countryCode} ${value.number}`
        : String(value);

    case FormElementType.ADDRESS:
      if (typeof value === "object" && "street" in value) {
        const parts = [
          value.street,
          value.apartment,
          value.city,
          value.state,
          value.zipCode,
          value.country,
        ].filter(Boolean);
        return parts.join(", ");
      }
      return String(value);

    case FormElementType.CONTACT_INFO:
      if (typeof value === "object" && "firstName" in value) {
        return [value.firstName, value.middleName, value.lastName]
          .filter(Boolean)
          .join(" ");
      }
      return String(value);

    case FormElementType.FILE_UPLOAD:
      return Array.isArray(value) ? `${value.length} file(s)` : String(value);

    default:
      return String(value);
  }
}
