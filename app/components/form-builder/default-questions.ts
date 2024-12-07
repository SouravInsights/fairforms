import { FormElementType } from "@/types/form";

export function getDefaultQuestion(type: FormElementType): string {
  switch (type) {
    // Contact Info Group
    case FormElementType.CONTACT_INFO:
      return "What is your full name?";
    case FormElementType.EMAIL:
      return "What's your email address?";
    case FormElementType.PHONE:
      return "What's your phone number?";
    case FormElementType.ADDRESS:
      return "What's your mailing address?";
    case FormElementType.WEBSITE:
      return "What's your website URL?";

    // Choice Group
    case FormElementType.MULTIPLE_CHOICE:
      return "Please select one of the following options:";
    case FormElementType.DROPDOWN:
      return "Choose from the following options:";
    case FormElementType.PICTURE_CHOICE:
      return "Select the image that best matches your preference:";

    // Text Group
    case FormElementType.SHORT_TEXT:
      return "Please provide a brief answer:";
    case FormElementType.LONG_TEXT:
      return "Please share your thoughts in detail:";

    // Other Group
    case FormElementType.NUMBER:
      return "Enter a number:";
    case FormElementType.DATE:
      return "Please select a date:";
    case FormElementType.FILE_UPLOAD:
      return "Please upload your file(s):";

    // Screen Elements
    case FormElementType.WELCOME_SCREEN:
      return "Welcome to our survey";
    case FormElementType.STATEMENT:
      return "Please read the following information:";
    case FormElementType.END_SCREEN:
      return "Thanks for completing this form!";
    case FormElementType.REDIRECT:
      return "Redirecting...";

    default:
      return `New ${type} quesnnnntion`;
  }
}
