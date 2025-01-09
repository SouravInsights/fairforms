// hooks/use-starred-responses.ts
import { useState, useEffect } from "react";

export function useStarredResponses(formId: string) {
  const storageKey = `starred-responses-${formId}`;
  const [starredResponses, setStarredResponses] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setStarredResponses(new Set(JSON.parse(saved)));
    }
  }, [storageKey]);

  const toggleStar = (responseId: string) => {
    setStarredResponses((prev) => {
      const next = new Set(prev);
      if (next.has(responseId)) {
        next.delete(responseId);
      } else {
        next.add(responseId);
      }
      // Convert Set to Array for JSON serialization
      localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  return { starredResponses, toggleStar };
}
