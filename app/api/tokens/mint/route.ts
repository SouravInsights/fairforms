import { FORM_REWARDS_ABI } from "@/lib/contracts/abi";
import { NextResponse } from "next/server";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

if (!process.env.PRIVATE_KEY || !process.env.FORM_REWARDS_ADDRESS) {
  throw new Error("Missing environment variables");
}

const client = createWalletClient({
  account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
  chain: baseSepolia,
  transport: http(),
});

export async function POST(req: Request) {
  try {
    const { address, amount } = await req.json();

    if (!address || !amount) {
      return NextResponse.json(
        { error: "Address and amount are required" },
        { status: 400 }
      );
    }

    const hash = await client.writeContract({
      address: process.env.FORM_REWARDS_ADDRESS as `0x${string}`,
      abi: FORM_REWARDS_ABI,
      functionName: "transfer",
      args: [address as `0x${string}`, BigInt(amount) * BigInt(1e18)],
    });

    return NextResponse.json({ hash });
  } catch (error) {
    console.error("[TOKEN_MINT]", error);
    return NextResponse.json(
      { error: "Failed to mint tokens" },
      { status: 500 }
    );
  }
}
