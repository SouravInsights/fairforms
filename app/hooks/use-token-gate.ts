import { useAccount, useReadContract } from "wagmi";
import { FormSettings } from "@/types/form";
import { FORM_REWARDS_ABI } from "@/lib/contracts/abi";
import { useState, useEffect } from "react";

interface UseTokenGateResult {
  hasAccess: boolean;
  isLoading: boolean;
  isConnected: boolean;
  address?: `0x${string}`;
}

export function useTokenGate(
  tokenGating?: FormSettings["web3"]["tokenGating"]
): UseTokenGateResult {
  const { address, isConnected } = useAccount();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: canAccess } = useReadContract({
    address: tokenGating?.contractAddress as `0x${string}`,
    abi: FORM_REWARDS_ABI,
    functionName: "canAccessForm",
    args:
      tokenGating?.enabled && address
        ? [address, BigInt(tokenGating.minTokenBalance || 0)]
        : undefined,
    query: {
      enabled: Boolean(
        tokenGating?.enabled && address && tokenGating.contractAddress
      ),
    },
  });

  useEffect(() => {
    setIsLoading(true);

    // If token gating is not enabled, grant access
    if (!tokenGating?.enabled) {
      setHasAccess(true);
      setIsLoading(false);
      return;
    }

    // No access if not connected
    if (!isConnected) {
      setHasAccess(false);
      setIsLoading(false);
      return;
    }

    // Set access based on contract response
    setHasAccess(Boolean(canAccess));
    setIsLoading(false);
  }, [canAccess, tokenGating, isConnected]);

  return {
    hasAccess,
    isLoading,
    isConnected,
    address,
  };
}
