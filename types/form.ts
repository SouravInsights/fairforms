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

  // Form elements specific to job postings and recruitment
  POSITION_DETAILS = "position_details",
  JOB_DESCRIPTION = "job_description",
  REQUIREMENTS = "requirements",
  SALARY_RANGE = "salary_range",
  BENEFITS_PACKAGE = "benefits_package",
  TEAM_OVERVIEW = "team_overview",
  INTERVIEW_PROCESS = "interview_process",
  SCREENING_QUESTIONS = "screening_questions",
  QUALIFICATION_CHECKLIST = "qualification_checklist",
  SKILLS_REQUIRED = "skills_required",
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

// Basic job posting information like title, department, and work type
// Allows toggling different fields and provides preset options
export type PositionDetailsProperties = {
  // Which fields to show in the form
  fields: {
    title: boolean;
    department: boolean;
    locationType: boolean;
    employmentType: boolean;
  };
  // Preset options for work location (Remote, Hybrid, On-site)
  locationTypes: Array<{
    id: string;
    text: string;
  }>;
  // Preset options for employment type (Full-time, Part-time, Contract)
  employmentTypes: Array<{
    id: string;
    text: string;
  }>;
};

// Rich text editor for creating structured job descriptions
// Supports templates and multiple sections
export type JobDescriptionProperties = {
  // Optional preset template
  template?: string;
  // Different sections like About Role, Responsibilities, etc.
  sections: Array<{
    id: string;
    title: string;
    required: boolean;
    order: number;
  }>;
  // Enable rich text editing features
  richText: boolean;
  // Optional length restrictions
  minLength?: number;
  maxLength?: number;
};

// Job requirements grouped by categories
// Supports both predefined and custom requirements
export type RequirementsProperties = {
  // Groups like Technical Skills, Soft Skills, etc.
  categories: Array<{
    id: string;
    name: string;
    requirements: Array<{
      id: string;
      text: string;
      required: boolean;
    }>;
  }>;
  // Allow adding custom requirements
  allowCustom: boolean;
};

// Compensation package configuration including salary, bonus, and equity
// Supports different currencies and pay periods
export type SalaryRangeProperties = {
  currency: string;
  payPeriods: Array<"hourly" | "monthly" | "yearly">;
  // Toggle showing salary as a range
  showRange: boolean;
  // Optional compensation components
  bonusSection: boolean;
  equitySection: boolean;
  benefitsSection: boolean;
};

// Company benefits and perks with categorization
// Can include descriptions and icons
export type BenefitsPackageProperties = {
  // Benefits grouped by category (Health, Time Off, etc.)
  categories: Array<{
    id: string;
    name: string;
    benefits: Array<{
      id: string;
      text: string;
      description?: string;
    }>;
  }>;
  // Allow custom benefits beyond presets
  allowCustom: boolean;
  // Show icons for visual representation
  showIcons: boolean;
};

// Team information and structure
// Can include photos and reporting relationships
export type TeamOverviewProperties = {
  // Different content sections about the team
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  // Optional team details
  showTeamSize: boolean;
  showReportingStructure: boolean;
  teamPhotos: boolean;
};

// Interview process breakdown with stages
// Can show timeline and estimated durations
export type InterviewProcessProperties = {
  // Sequential interview stages
  stages: Array<{
    id: string;
    name: string;
    description: string;
    duration?: string;
    participants?: string[];
  }>;
  // Display options
  showTimeline: boolean;
  showDuration: boolean;
};

// Initial screening questions for candidates
// Supports different question types and elimination criteria
export type ScreeningQuestionsProperties = {
  questions: Array<{
    id: string;
    text: string;
    type: "multiple_choice" | "text" | "boolean";
    options?: Array<{
      id: string;
      text: string;
      // Auto-reject based on answer
      eliminatory: boolean;
    }>;
    required: boolean;
  }>;
  // Display all questions at once vs sequential
  showAll: boolean;
  // Randomize question order
  randomizeOrder: boolean;
};

// Required and preferred qualifications checklist
// Can include scoring and auto-disqualification
export type QualificationChecklistProperties = {
  items: Array<{
    id: string;
    text: string;
    required: boolean;
    type: "must_have" | "nice_to_have";
  }>;
  // Enable qualification scoring
  showScoring: boolean;
  // Reject if must-haves aren't met
  autoDisqualify: boolean;
};

// Required skills with proficiency levels
// Can track years of experience
export type SkillsRequiredProperties = {
  skills: Array<{
    id: string;
    name: string;
    level?: "beginner" | "intermediate" | "advanced" | "expert";
    required: boolean;
    yearsRequired?: number;
  }>;
  // Allow adding unlisted skills
  allowOther: boolean;
  // Show proficiency levels
  showLevels: boolean;
  // Show years of experience
  showYears: boolean;
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
  | { type: FormElementType.REDIRECT; properties: RedirectProperties }
  | {
      type: FormElementType.POSITION_DETAILS;
      properties: PositionDetailsProperties;
    }
  | {
      type: FormElementType.JOB_DESCRIPTION;
      properties: JobDescriptionProperties;
    }
  | { type: FormElementType.REQUIREMENTS; properties: RequirementsProperties }
  | { type: FormElementType.SALARY_RANGE; properties: SalaryRangeProperties }
  | {
      type: FormElementType.BENEFITS_PACKAGE;
      properties: BenefitsPackageProperties;
    }
  | { type: FormElementType.TEAM_OVERVIEW; properties: TeamOverviewProperties }
  | {
      type: FormElementType.INTERVIEW_PROCESS;
      properties: InterviewProcessProperties;
    }
  | {
      type: FormElementType.SCREENING_QUESTIONS;
      properties: ScreeningQuestionsProperties;
    }
  | {
      type: FormElementType.QUALIFICATION_CHECKLIST;
      properties: QualificationChecklistProperties;
    }
  | {
      type: FormElementType.SKILLS_REQUIRED;
      properties: SkillsRequiredProperties;
    };

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
    textColor: string;
    sidebarColor: string;
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
  web3: {
    enabled: boolean;
    tokenGating: {
      enabled: boolean;
      chainId: number;
      contractAddress?: string;
      minTokenBalance?: number;
      tokenType: "ERC20" | "ERC721";
    };
    rewards: {
      enabled: boolean;
      tokenAddress?: string;
      rewardAmount?: string;
      chainId: number;
    };
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

export interface FormTemplate {
  id: number;
  name: string;
  description: string | null;
  category: string;
  thumbnail?: string | null;
  elements: FormElement[];
  settings: FormSettings;
  isPublic: boolean;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
