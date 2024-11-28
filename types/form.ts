export type FormElementBase = {
  id: string;
  type: FormElementType;
  question: string;
  required: boolean;
  order: number;
};

export enum FormElementType {
  SHORT_TEXT = "short_text",
  LONG_TEXT = "long_text",
  EMAIL = "email",
  MULTIPLE_CHOICE = "multiple_choice",
  PHONE = "phone",
  ADDRESS = "address",
  WEBSITE = "website",
  DROPDOWN = "dropdown",
  PICTURE_CHOICE = "picture_choice",
}

export type TextProperties = {
  minLength?: number;
  maxLength?: number;
  placeholder: string;
  richText: boolean;
};

export type MultipleChoiceProperties = {
  options: Array<{
    id: string;
    text: string;
    imageUrl?: string;
  }>;
  allowMultiple: boolean;
  randomizeOrder: boolean;
};

export type EmailProperties = {
  placeholder: string;
  validationRegex?: string;
};

export type PhoneProperties = {
  placeholder: string;
  defaultCountry: string;
  allowInternational: boolean;
};

export type FormSettings = {
  theme: {
    primaryColor: string;
    fontFamily: string;
    backgroundColor: string;
    questionColor: string;
  };
  behavior: {
    showProgressBar: boolean;
    enableKeyboardNavigation: boolean;
    requireLogin: boolean;
    limitResponses: boolean;
  };
};
