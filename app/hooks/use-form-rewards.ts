import { useWriteContract, useReadContract } from "wagmi";
import { FormSettings } from "@/types/form";
import { FORM_TOKEN_ADDRESS, formTokenAbi } from "@/lib/web3/contracts";

type RewardSettings = NonNullable<FormSettings["web3"]>["rewards"];

export function useFormRewards(settings: RewardSettings | undefined) {
  const { writeContractAsync, isPending, isError } = useWriteContract();

  // Check if the form is authorized to send rewards
  const { data: isOperator } = useReadContract({
    address: FORM_TOKEN_ADDRESS,
    abi: formTokenAbi,
    functionName: "formOperators",
    args: [settings?.tokenAddress as `0x${string}`],
  });

  // Get reward limit for the form
  const { data: rewardLimit } = useReadContract({
    address: FORM_TOKEN_ADDRESS,
    abi: formTokenAbi,
    functionName: "formRewardLimits",
    args: [settings?.tokenAddress as `0x${string}`],
  });

  const sendReward = async (to: `0x${string}`, amount: bigint) => {
    if (!settings?.enabled || !isOperator) return;

    return writeContractAsync({
      address: FORM_TOKEN_ADDRESS,
      abi: formTokenAbi,
      functionName: "sendReward",
      args: [to, amount],
    });
  };

  return {
    sendReward,
    isPending,
    isError,
    isOperator,
    rewardLimit,
  };
}
