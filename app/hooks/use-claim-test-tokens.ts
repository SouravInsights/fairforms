import { useWriteContract } from "wagmi";
import { FORM_REWARDS_ABI } from "@/lib/contracts/abi";
import { baseSepolia } from "viem/chains";
import { useState } from "react";

// We'll use the existing claimReward function but with a test submission ID
export function useClaimTestTokens(contractAddress: string) {
  const [isClaiming, setIsClaiming] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const claimTestTokens = async () => {
    if (!contractAddress || isClaiming) {
      return { hash: undefined as `0x${string}` | undefined };
    }

    try {
      setIsClaiming(true);
      // Generate a unique test submission ID
      const testSubmissionId = `0x${"0".repeat(64)}`; // This will be our test submission ID

      const hash = await writeContractAsync({
        abi: FORM_REWARDS_ABI,
        address: contractAddress as `0x${string}`,
        chainId: baseSepolia.id,
        functionName: "claimReward",
        args: [testSubmissionId as `0x${string}`],
      });

      return { hash };
    } catch (error) {
      console.error("Failed to claim test tokens:", error);
      throw error;
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    claimTestTokens,
    isClaiming,
  };
}
