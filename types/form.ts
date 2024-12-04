export enum FormElementType {
  // Contact Info
  CONTACT_INFO = "contact_info",
  EMAIL = "email",
  PHONE = "phone",
  ADDRESS = "address",
  WEBSITE = "website",

  // Choice
  MULTIPLE_CHOICE = "multiple_choice",
  DROPDOWN = "dropdown",
  PICTURE_CHOICE = "picture_choice",

  // Text
  LONG_TEXT = "long_text",
  SHORT_TEXT = "short_text",

  // Other
  NUMBER = "number",
  DATE = "date",
  FILE_UPLOAD = "file_upload",
  WELCOME_SCREEN = "welcome_screen",
  STATEMENT = "statement",
  END_SCREEN = "end_screen",
  REDIRECT = "redirect",
}

export type FormElementBase = {
  id: string;
  type: FormElementType;
  question: string;
  description?: string;
  required: boolean;
  order: number;
};

export type ContactInfoProperties = {
  placeholders: {
    firstName: string;
    lastName: string;
  };
  showMiddleName: boolean;
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

export type AddressProperties = {
  includeCountry: boolean;
  includeApartment: boolean;
  requireZipCode: boolean;
};

export type WebsiteProperties = {
  placeholder: string;
  allowedDomains?: string[];
};

export type MultipleChoiceProperties = {
  options: Array<{
    id: string;
    text: string;
    imageUrl?: string;
  }>;
  allowMultiple: boolean;
  randomizeOrder: boolean;
  allowOther: boolean;
};

export type DropdownProperties = {
  options: Array<{
    id: string;
    text: string;
  }>;
  searchable: boolean;
  placeholder: string;
};

export type PictureChoiceProperties = {
  options: Array<{
    id: string;
    imageUrl: string;
    caption: string;
  }>;
  layout: "grid" | "list";
  allowMultiple: boolean;
};

export type TextProperties = {
  minLength?: number;
  maxLength?: number;
  placeholder: string;
  richText: boolean;
};

export type NumberProperties = {
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
};

export type DateProperties = {
  minDate?: string;
  maxDate?: string;
  format: string;
  includeTime: boolean;
};

export type FileUploadProperties = {
  maxSize: number; // in bytes
  allowedTypes: string[];
  maxFiles: number;
};

export type WelcomeScreenProperties = {
  title: string;
  subtitle?: string;
  buttonText: string;
  backgroundImageUrl?: string;
};

export type StatementProperties = {
  statement: string;
  alignment: "left" | "center" | "right";
};

export type EndScreenProperties = {
  title: string;
  message: string;
  buttonText?: string;
  showSocialShare: boolean;
};

export type RedirectProperties = {
  url: string;
  delay: number; // in milliseconds
};

export type FormElementProperties =
  | { type: FormElementType.CONTACT_INFO; properties: ContactInfoProperties }
  | { type: FormElementType.EMAIL; properties: EmailProperties }
  | { type: FormElementType.PHONE; properties: PhoneProperties }
  | { type: FormElementType.ADDRESS; properties: AddressProperties }
  | { type: FormElementType.WEBSITE; properties: WebsiteProperties }
  | {
      type: FormElementType.MULTIPLE_CHOICE;
      properties: MultipleChoiceProperties;
    }
  | { type: FormElementType.DROPDOWN; properties: DropdownProperties }
  | {
      type: FormElementType.PICTURE_CHOICE;
      properties: PictureChoiceProperties;
    }
  | { type: FormElementType.LONG_TEXT; properties: TextProperties }
  | { type: FormElementType.SHORT_TEXT; properties: TextProperties }
  | { type: FormElementType.NUMBER; properties: NumberProperties }
  | { type: FormElementType.DATE; properties: DateProperties }
  | { type: FormElementType.FILE_UPLOAD; properties: FileUploadProperties }
  | {
      type: FormElementType.WELCOME_SCREEN;
      properties: WelcomeScreenProperties;
    }
  | { type: FormElementType.STATEMENT; properties: StatementProperties }
  | { type: FormElementType.END_SCREEN; properties: EndScreenProperties }
  | { type: FormElementType.REDIRECT; properties: RedirectProperties };

export type FormElement = FormElementBase & FormElementProperties;

export type FormElementValue =
  | string // For text, email, website inputs
  | number // For number input
  | Date // For date input
  | File[] // For file upload
  | string[] // For multiple choice/picture choice with multiple selections
  | { countryCode: string; number: string } // For phone
  | {
      // For address
      street: string;
      apartment?: string;
      city: string;
      state: string;
      zipCode: string;
      country?: string;
    }
  | {
      // For contact info
      firstName: string;
      lastName: string;
      middleName?: string;
    }
  | boolean
  | null
  | undefined;

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
    maxResponses?: number;
  };
  notifications: {
    enableEmailNotifications: boolean;
    notificationEmails: string[];
  };
};

export interface Form {
  id: number;
  userId: string;
  title: string;
  description: string | null;
  elements: FormElement[];
  settings: FormSettings;
  isPublished: boolean;
  customSlug: string | null;
  createdAt: Date;
  updatedAt: Date;
  metaTitle?: string | null;
  metaDescription?: string | null;
  socialImageUrl?: string | null;
}

export interface CreateFormData {
  userId: string;
  title: string;
  description: string;
  elements: FormElement[];
  settings: FormSettings;
  isPublished: boolean;
}

export interface UpdateFormData {
  title?: string;
  description?: string | null;
  elements?: FormElement[];
  settings?: FormSettings;
  isPublished?: boolean;
  customSlug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  socialImageUrl?: string | null;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
