import { FormElementType } from "./form";

export interface FormattedResponse {
  elementId: string;
  elementType: FormElementType;
  question?: string;
  description?: string;
  timestamp: string;
  answer: ResponseValue;
  optionText?: string;
}

export type ResponseValue =
  | string
  | string[]
  | number
  | boolean
  | null
  | { countryCode: string; number: string }
  | {
      street: string;
      apartment?: string;
      city: string;
      state: string;
      zipCode: string;
      country?: string;
    }
  | {
      firstName: string;
      lastName: string;
      middleName?: string;
    }
  | undefined;

export interface FormResponse {
  id: number;
  formId: number;
  answers: {
    formatted: FormattedResponse[];
    submittedAt: string;
  };
  submittedAt: string;
}

export interface EnrichedAnswer {
  elementId: string;
  question: string;
  type: FormElementType;
  answer: ResponseValue;
  readableAnswer: string;
}

export interface EnrichedResponse extends FormResponse {
  processedAnswers: Record<string, ResponseValue>;
  enrichedAnswers: EnrichedAnswer[];
}

export interface Web3Response extends FormResponse {
  walletAddress: string;
  transactionHash?: string;
  rewardClaimed: boolean;
}
