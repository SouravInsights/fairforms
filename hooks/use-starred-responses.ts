import { useState, useEffect } from "react";

export function useStarredResponses(formId: string, token: string) {
  const [starredResponses, setStarredResponses] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load starred responses
  useEffect(() => {
    const loadStarred = async () => {
      try {
        const response = await fetch(
          `/api/forms/${formId}/public/${token}/star`
        );
        const data = await response.json();
        if (response.ok) {
          setStarredResponses(new Set(data.starred.map(String)));
        }
      } catch (error) {
        console.error("Failed to load starred responses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStarred();
  }, [formId, token]);

  const toggleStar = async (responseId: string) => {
    try {
      const response = await fetch(
        `/api/forms/${formId}/public/${token}/star`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ responseId: parseInt(responseId) }),
        }
      );

      if (response.ok) {
        setStarredResponses((prev) => {
          const next = new Set(prev);
          if (next.has(responseId)) {
            next.delete(responseId);
          } else {
            next.add(responseId);
          }
          return next;
        });
      }
    } catch (error) {
      console.error("Failed to toggle star:", error);
    }
  };

  return { starredResponses, toggleStar, isLoading };
}
