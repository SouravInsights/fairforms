import { useAccount, useChainId, useReadContract, useSwitchChain } from "wagmi";
import { erc20Abi, erc721Abi } from "viem";
import { FormSettings } from "@/types/form";
import { useEffect } from "react";
import { baseSepolia } from "viem/chains";

type TokenGateSettings = NonNullable<FormSettings["web3"]>["tokenGating"];

export function useTokenGate(settings: TokenGateSettings | undefined) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Check if we're on the right network
  useEffect(() => {
    if (settings?.enabled && chainId !== baseSepolia.id) {
      switchChain({ chainId: baseSepolia.id });
    }
  }, [settings?.enabled, chainId, switchChain]);

  const { data: balance = 0 } = useReadContract({
    address: settings?.contractAddress as `0x${string}`,
    abi: settings?.tokenType === "ERC20" ? erc20Abi : erc721Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(
        settings?.enabled && isConnected && address && settings?.contractAddress
      ),
    },
  });

  const hasAccess = Boolean(
    !settings?.enabled ||
      (balance !== undefined &&
        Number(balance) >= (settings?.minTokenBalance || 0))
  );

  return {
    hasAccess,
    isConnected,
    address,
    balance: Number(balance),
  };
}
