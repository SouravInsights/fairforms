// types/response-filters.ts
export interface ResponseFilters {
  feedbackFilter: {
    enabled: boolean;
    minLength: number;
  };
  outfitDesignFilter: {
    enabled: boolean;
    minLength: number;
  };
  demographics: {
    ageGroups: string | null;
    gender: string | null;
  };
}

export const DEFAULT_FILTERS: ResponseFilters = {
  feedbackFilter: {
    enabled: false,
    minLength: 50,
  },
  outfitDesignFilter: {
    enabled: false,
    minLength: 50,
  },
  demographics: {
    ageGroups: null,
    gender: null,
  },
};
