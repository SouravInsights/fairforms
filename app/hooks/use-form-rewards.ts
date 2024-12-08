import { useAccount, useWriteContract, useSimulateContract } from "wagmi";
import { FormSettings } from "@/types/form";
import { useState } from "react";
import { keccak256, encodePacked } from "viem";
import { FORM_REWARDS_ABI } from "@/lib/contracts/abi";

interface UseFormRewardsProps {
  rewards: FormSettings["web3"]["rewards"];
  formId: number;
  responseId: number;
}

export function useFormRewards({
  rewards,
  formId,
  responseId,
}: UseFormRewardsProps) {
  const { address } = useAccount();
  const [isClaimingReward, setIsClaimingReward] = useState(false);

  // Generate unique submission ID
  const submissionId = address
    ? keccak256(
        encodePacked(
          ["uint256", "uint256", "address"],
          [BigInt(formId), BigInt(responseId), address]
        )
      )
    : "0x";

  const { data: simulateData } = useSimulateContract({
    address: rewards.tokenAddress as `0x${string}`,
    abi: FORM_REWARDS_ABI,
    functionName: "claimReward",
    args: [submissionId],
    query: {
      enabled: Boolean(rewards.enabled && address && submissionId !== "0x"),
    },
  });

  const { writeContractAsync } = useWriteContract();

  const claimReward = async () => {
    if (!rewards.enabled || !address || isClaimingReward || !simulateData)
      return;

    try {
      setIsClaimingReward(true);
      await writeContractAsync({
        ...simulateData.request,
        chainId: rewards.chainId,
      });
    } catch (error) {
      console.error("Failed to claim reward:", error);
      throw error;
    } finally {
      setIsClaimingReward(false);
    }
  };

  return {
    claimReward,
    isClaimingReward,
    canClaim: Boolean(simulateData),
    isReady: Boolean(address && rewards.enabled && submissionId !== "0x"),
  };
}
