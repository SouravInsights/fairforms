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
