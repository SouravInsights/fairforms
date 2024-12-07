import { FormElement } from "./form";

export interface FormResponse {
  id: number;
  formId: number;
  answers: Record<string, ResponseValue>;
  submittedAt: string;
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
    };

export interface EnrichedResponse extends FormResponse {
  enrichedAnswers: EnrichedAnswer[];
}

export interface Web3Response extends FormResponse {
  walletAddress: string;
  transactionHash?: string;
  rewardClaimed: boolean;
}

export interface EnrichedAnswer {
  elementId: string;
  question: string;
  type: FormElement["type"];
  answer: ResponseValue;
  readableAnswer: string;
}

export interface ResponsesData {
  form: FormElement;
  responses: EnrichedResponse[];
  total: number;
}
