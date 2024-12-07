import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useClaimReward() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const claimReward = async (formId: string, responseId: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/forms/${formId}/responses/${responseId}/claim`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to claim reward");
      }

      toast({
        title: "Success!",
        description: `Reward claimed successfully. Transaction: ${data.transactionHash}`,
      });

      return data;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to claim reward",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claimReward,
    isLoading,
  };
}
