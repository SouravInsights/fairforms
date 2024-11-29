import { FormElementType } from "@/types/form";

// Helper function to get default properties based on element type
export function getDefaultProperties(type: FormElementType) {
  switch (type) {
    case FormElementType.CONTACT_INFO:
      return {
        placeholders: { firstName: "First Name", lastName: "Last Name" },
        showMiddleName: false,
      };

    case FormElementType.EMAIL:
      return {
        placeholder: "Enter your email",
        validationRegex: undefined,
      };

    case FormElementType.PHONE:
      return {
        placeholder: "Enter your phone number",
        defaultCountry: "+91",
        allowInternational: true,
      };

    case FormElementType.ADDRESS:
      return {
        includeCountry: true,
        includeApartment: true,
        requireZipCode: true,
        defaultCountry: "IN",
      };

    case FormElementType.WEBSITE:
      return {
        placeholder: "Enter website URL",
        allowedDomains: undefined,
      };

    case FormElementType.MULTIPLE_CHOICE:
      return {
        options: [
          { id: "option1", text: "Option 1" },
          { id: "option2", text: "Option 2" },
          { id: "option3", text: "Option 3" },
        ],
        allowMultiple: false,
        randomizeOrder: false,
        allowOther: false,
      };

    case FormElementType.DROPDOWN:
      return {
        options: [
          { id: "option1", text: "Option 1" },
          { id: "option2", text: "Option 2" },
          { id: "option3", text: "Option 3" },
        ],
        searchable: false,
        placeholder: "Select an option",
      };

    case FormElementType.PICTURE_CHOICE:
      return {
        options: [
          {
            id: "option1",
            imageUrl: "/api/placeholder/400/300",
            caption: "Option 1",
          },
          {
            id: "option2",
            imageUrl: "/api/placeholder/400/300",
            caption: "Option 2",
          },
        ],
        layout: "grid" as const,
        allowMultiple: false,
      };

    case FormElementType.LONG_TEXT:
      return {
        placeholder: "Enter your response here",
        minLength: undefined,
        maxLength: undefined,
        richText: false,
      };

    case FormElementType.SHORT_TEXT:
      return {
        placeholder: "Enter your response here",
        minLength: undefined,
        maxLength: undefined,
        richText: false,
      };

    case FormElementType.NUMBER:
      return {
        min: undefined,
        max: undefined,
        step: 1,
        prefix: undefined,
        suffix: undefined,
      };

    case FormElementType.DATE:
      return {
        minDate: undefined,
        maxDate: undefined,
        // P = date, PP = with month name, PPP = with weekday
        includeTime: false,
      };

    case FormElementType.FILE_UPLOAD:
      return {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ["image/*", "application/pdf"],
        maxFiles: 1,
      };

    case FormElementType.WELCOME_SCREEN:
      return {
        title: "Welcome to the form",
        subtitle: "Please take a moment to fill out this form",
        buttonText: "Start",
        backgroundImageUrl: undefined,
      };

    case FormElementType.STATEMENT:
      return {
        statement: "This is a statement",
        alignment: "left" as const,
      };

    case FormElementType.END_SCREEN:
      return {
        title: "Thank you!",
        message: "Your response has been recorded",
        buttonText: "Close",
        showSocialShare: false,
      };

    case FormElementType.REDIRECT:
      return {
        url: "",
        delay: 3000, // 3 seconds
      };

    default:
      // This assertion helps TypeScript verify that we've handled all cases
      const exhaustiveCheck: never = type;
      throw new Error(`Unhandled element type: ${exhaustiveCheck}`);
  }
}
