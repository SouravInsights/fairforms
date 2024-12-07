import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useChainId, useSwitchChain } from "wagmi";
import { baseSepolia } from "viem/chains";

export function useClaimReward() {
  const [isLoading, setIsLoading] = useState(false);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { toast } = useToast();

  const claimReward = async (formId: string, responseId: string) => {
    try {
      setIsLoading(true);

      // Check if user is on the right network
      if (chainId !== baseSepolia.id) {
        toast({
          title: "Switching Network",
          description: "Please switch to Base Sepolia to claim rewards",
        });

        switchChain({ chainId: baseSepolia.id });
      }

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
        description: `Reward claimed successfully! Transaction: ${data.transactionHash}`,
      });

      return data;
    } catch (error) {
      console.error("Claim error:", error);

      // Handle specific error cases
      if (error instanceof Error && error.message.includes("user rejected")) {
        toast({
          title: "Network Switch Cancelled",
          description: "You need to be on Base Sepolia to claim rewards",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? `Failed to claim reward: ${error.message}`
              : "Failed to claim reward",
          variant: "destructive",
        });
      }
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
