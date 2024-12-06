import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, erc721Abi } from "viem";
import { FormSettings } from "@/types/form";

type TokenGateSettings = NonNullable<FormSettings["web3"]>["tokenGating"];

export function useTokenGate(settings: TokenGateSettings | undefined) {
  const { address, isConnected } = useAccount();

  const { data: balance } = useReadContract({
    address: settings?.contractAddress as `0x${string}`,
    // Only support ERC20 and ERC721 for simplicity
    abi: settings?.tokenType === "ERC20" ? erc20Abi : erc721Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: Boolean(settings?.enabled && isConnected && address),
    },
  });

  return {
    hasAccess:
      !settings?.enabled ||
      (balance && Number(balance) >= (settings?.minTokenBalance || 0)),
    isConnected,
    address,
  };
}
