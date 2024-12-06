import { useWriteContract } from "wagmi";
import { erc20Abi } from "viem";
import { FormSettings } from "@/types/form";

type RewardSettings = NonNullable<FormSettings["web3"]>["rewards"];

// Helper to ensure address is properly formatted
function ensureHexAddress(
  address: string | undefined
): `0x${string}` | undefined {
  if (!address) return undefined;
  return address.startsWith("0x")
    ? (address as `0x${string}`)
    : (`0x${address}` as `0x${string}`);
}

export function useFormRewards(settings: RewardSettings | undefined) {
  const { writeContractAsync, isPending, isError } = useWriteContract();

  const sendReward = async (to: `0x${string}`, amount: bigint) => {
    if (!settings?.enabled || !settings?.tokenAddress) return;

    const tokenAddress = ensureHexAddress(settings.tokenAddress);
    if (!tokenAddress) {
      throw new Error("Invalid token address");
    }

    return writeContractAsync({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "transfer",
      args: [to, amount],
    });
  };

  return {
    sendReward,
    isPending,
    isError,
  };
}
