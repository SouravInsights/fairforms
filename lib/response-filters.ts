// lib/response-filters.ts
import { EnrichedResponse } from "@/types/response";
import { ResponseFilters } from "@/types/response-filters";

export const FEEDBACK_QUESTION_ID = "FKQsjhARqqm9MnzQNAXcB";
export const OUTFIT_DESIGN_QUESTION_ID = "Lss_iaMPzwGt0NhAflzTa";
export const AGE_QUESTION_ID = "8UDLz-4s3afPjKGmnWgek";
export const GENDER_QUESTION_ID = "I7OQ_aiIEQGmc3Xe6_lVX";

export function filterResponses(
  responses: EnrichedResponse[],
  filters: ResponseFilters
): EnrichedResponse[] {
  return responses.filter((response) => {
    // Find answers by question ID
    const feedbackAnswer = response.enrichedAnswers.find(
      (ans) => ans.elementId === FEEDBACK_QUESTION_ID
    );

    console.log("feedbackAnswer:", feedbackAnswer);

    const outfitDesignAnswer = response.enrichedAnswers.find(
      (ans) => ans.elementId === OUTFIT_DESIGN_QUESTION_ID
    );

    console.log("outfitDesignAnswer:", outfitDesignAnswer);

    const ageAnswer = response.enrichedAnswers.find(
      (ans) => ans.elementId === AGE_QUESTION_ID
    );

    console.log("ageAnswer:", ageAnswer);

    const genderAnswer = response.enrichedAnswers.find(
      (ans) => ans.elementId === GENDER_QUESTION_ID
    );

    console.log("genderAnswer:", genderAnswer);

    // Check feedback filter
    if (filters.feedbackFilter.enabled) {
      if (
        !feedbackAnswer?.readableAnswer ||
        feedbackAnswer.readableAnswer.length < filters.feedbackFilter.minLength
      ) {
        return false;
      }
    }

    // Check outfit design filter
    if (filters.outfitDesignFilter.enabled) {
      if (
        !outfitDesignAnswer?.readableAnswer ||
        outfitDesignAnswer.readableAnswer.length <
          filters.outfitDesignFilter.minLength
      ) {
        return false;
      }
    }

    // Check demographics filters
    if (filters.demographics.ageGroups) {
      if (
        !ageAnswer?.readableAnswer ||
        ageAnswer.readableAnswer !== filters.demographics.ageGroups
      ) {
        return false;
      }
    }

    if (filters.demographics.gender) {
      if (
        !genderAnswer?.readableAnswer ||
        genderAnswer.readableAnswer !== filters.demographics.gender
      ) {
        return false;
      }
    }

    return true;
  });
}
