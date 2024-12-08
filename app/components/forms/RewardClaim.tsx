import { useFormRewards } from "@/app/hooks/use-form-rewards";
import { FormSettings } from "@/types/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface RewardClaimProps {
  rewards: FormSettings["web3"]["rewards"];
  formId: number;
  responseId: number;
}

export function RewardClaim({ rewards, formId, responseId }: RewardClaimProps) {
  const { claimReward, isClaimingReward, canClaim } = useFormRewards({
    rewards,
    formId,
    responseId,
  });
  const { toast } = useToast();

  if (!rewards.enabled || !canClaim) return null;

  const handleClaim = async () => {
    try {
      await claimReward();
      toast({
        title: "Success!",
        description: "Your reward has been claimed.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleClaim} disabled={isClaimingReward}>
      {isClaimingReward ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Claiming...
        </>
      ) : (
        "Claim Reward"
      )}
    </Button>
  );
}
