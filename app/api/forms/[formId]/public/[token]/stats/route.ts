import { NextResponse } from "next/server";
import { db } from "@/db";
import { responses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decryptFormId } from "@/lib/encrypt";
import {
  EnrichedAnswer,
  EnrichedResponse,
  FormattedResponse,
  ResponseValue,
} from "@/types/response";

interface StatItem {
  name: string;
  value: number;
  percentage: number;
}

interface StatsData {
  totalResponses: number;
  demographics: {
    age: StatItem[];
    gender: StatItem[];
  };
  shoppingBehavior: {
    frequency: StatItem[];
    channels: StatItem[];
    priceRanges: StatItem[];
  };
  preferences: {
    ethnicWearTypes: StatItem[];
    occasions: StatItem[];
  };
}

const QUESTION_IDS = {
  age: "8UDLz-4s3afPjKGmnWgek",
  gender: "I7OQ_aiIEQGmc3Xe6_lVX",
  shoppingFrequency: "984pyQjnfhlZWc34mkbBc",
  shoppingChannels: "gg1YvI80sGeq4-gaNRvnI",
  priceRange: "HqVWvHFGQppHl8a6kSroX",
  ethnicWearTypes: "m8nKA8CSSJ4D0VaZdieGk",
  occasions: "mYKzidynfpS2yKKj9ZmEE",
} as const;

const QUESTION_OPTIONS = {
  age: {
    option1: "18 - 25",
    option2: "26 - 35",
    option3: "36 - 45",
    "option-1733263976184": "Above 45",
  },
  gender: {
    option1: "Male",
    option2: "Female",
  },
  shoppingFrequency: {
    option1: "Frequently (every month)",
    option2: "Occasionally (once every 3–6 months)",
    option3: "Rarely (once a year or less)",
  },
  shoppingChannels: {
    option1: "Local boutiques",
    option2: "Big retail stores",
    option3: "Online marketplaces",
    "option-1733264555554": "Independent designers",
  },
  priceRanges: {
    option1: "Under ₹2000",
    option2: "₹2,000–₹4,000",
    option3: "₹4,000–₹6,000",
    "option-1733264491671": "₹6,000–₹8,000",
    "option-1733264499321": "₹8,000–₹12,000",
    "option-1733264503618": "Above ₹12,000",
  },
  ethnicWearTypes: {
    option1: "Sarees",
    option2: "Kurtas/Kurtis",
    option3: "Lehengas",
    "option-1733264251303": "Salwar Suits",
    "option-1733264272202": "Indo-Western Fusion Wear",
  },
  occasions: {
    option1: "Weddings",
    option2: "Festivals",
    option3: "Office",
    "option-1733264198683": "Casual",
  },
} as const;

function processAnswers(
  responses: EnrichedResponse[],
  questionId: string,
  isMultipleChoice: boolean = false,
  optionMapping: Record<string, string> = {}
): StatItem[] {
  const counts: Record<string, number> = {};
  let total = 0;

  responses.forEach((response) => {
    const answer = response.enrichedAnswers.find(
      (a) => a.elementId === questionId
    );
    if (!answer?.answer) return;

    if (isMultipleChoice && Array.isArray(answer.answer)) {
      answer.answer.forEach((choice: string) => {
        const mappedChoice = optionMapping[choice] || choice;
        counts[mappedChoice] = (counts[mappedChoice] || 0) + 1;
        total++;
      });
    } else {
      const answerValue = String(answer.answer);
      const mappedAnswer = optionMapping[answerValue] || answerValue;
      counts[mappedAnswer] = (counts[mappedAnswer] || 0) + 1;
      total++;
    }
  });

  // Convert to percentages and format for charts
  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
    percentage: Math.round(
      (value / (isMultipleChoice ? total : responses.length)) * 100
    ),
  }));
}

interface RawDBResponse {
  formId: number;
  id: number;
  answers: unknown;
  submittedAt: Date;
  walletAddress: string | null;
  transactionHash: string | null;
  rewardClaimed: boolean | null;
  chainId: number | null;
}

// Type assertion function to ensure answers has the correct structure
function isValidAnswers(answers: unknown): answers is {
  formatted: FormattedResponse[];
  submittedAt: string;
} {
  return (
    typeof answers === "object" &&
    answers !== null &&
    "formatted" in answers &&
    "submittedAt" in answers &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Array.isArray((answers as any).formatted) // (will use better type later)
  );
}

function enrichResponses(responses: RawDBResponse[]): EnrichedResponse[] {
  return responses.map((response): EnrichedResponse => {
    if (!isValidAnswers(response.answers)) {
      // Provide a default structure if answers are invalid
      return {
        ...response,
        submittedAt: response.submittedAt.toISOString(),
        answers: {
          formatted: [],
          submittedAt: response.submittedAt.toISOString(),
        },
        processedAnswers: {},
        enrichedAnswers: [],
      };
    }

    const { formatted, submittedAt } = response.answers;

    // Process answers
    const processedAnswers: Record<string, ResponseValue> = {};
    const enrichedAnswers = formatted
      .map((formattedResponse) => {
        if (!formattedResponse.elementId) return null;

        processedAnswers[formattedResponse.elementId] =
          formattedResponse.answer;

        return {
          elementId: formattedResponse.elementId,
          question: formattedResponse.question || "",
          type: formattedResponse.elementType,
          answer: formattedResponse.answer,
          readableAnswer:
            formattedResponse.optionText ||
            String(formattedResponse.answer || "-"),
        };
      })
      .filter((answer): answer is EnrichedAnswer => answer !== null);

    return {
      ...response,
      answers: { formatted, submittedAt },
      submittedAt: response.submittedAt.toISOString(),
      processedAnswers,
      enrichedAnswers,
    };
  });
}

export async function GET(
  req: Request,
  { params }: { params: { formId: string; token: string } }
): Promise<NextResponse<StatsData | { error: string }>> {
  try {
    const { formId, token } = params;
    const formIdNumber = parseInt(formId);

    // Verify the token matches the form ID
    const decryptedFormId = decryptFormId(token);
    if (!decryptedFormId || parseInt(decryptedFormId) !== formIdNumber) {
      return NextResponse.json({ error: "Invalid link" }, { status: 401 });
    }

    // Get form responses
    const rawResponses: RawDBResponse[] = await db
      .select()
      .from(responses)
      .where(eq(responses.formId, formIdNumber))
      .orderBy(responses.submittedAt);

    // Enrich responses before processing
    const enrichedResponses = enrichResponses(rawResponses);

    // Process responses
    const stats: StatsData = {
      totalResponses: enrichedResponses.length,
      demographics: {
        age: processAnswers(
          enrichedResponses,
          QUESTION_IDS.age,
          false,
          QUESTION_OPTIONS.age
        ),
        gender: processAnswers(
          enrichedResponses,
          QUESTION_IDS.gender,
          false,
          QUESTION_OPTIONS.gender
        ),
      },
      shoppingBehavior: {
        frequency: processAnswers(
          enrichedResponses,
          QUESTION_IDS.shoppingFrequency,
          false,
          QUESTION_OPTIONS.shoppingFrequency
        ),
        channels: processAnswers(
          enrichedResponses,
          QUESTION_IDS.shoppingChannels,
          true,
          QUESTION_OPTIONS.shoppingChannels
        ),
        priceRanges: processAnswers(
          enrichedResponses,
          QUESTION_IDS.priceRange,
          true,
          QUESTION_OPTIONS.priceRanges
        ),
      },
      preferences: {
        ethnicWearTypes: processAnswers(
          enrichedResponses,
          QUESTION_IDS.ethnicWearTypes,
          true,
          QUESTION_OPTIONS.ethnicWearTypes
        ),
        occasions: processAnswers(
          enrichedResponses,
          QUESTION_IDS.occasions,
          true,
          QUESTION_OPTIONS.occasions
        ),
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[FORM_STATS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
