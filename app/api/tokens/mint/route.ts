import { FormRewardsABI } from "@/lib/contracts/abi";
import { NextResponse } from "next/server";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const FORM_TOKEN_ADDRESS = "0x050918768C502d9D14D624FF543625df1696Df63";

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY environment variable is not set");
}

const account = privateKeyToAccount(
  process.env.PRIVATE_KEY.startsWith("0x")
    ? (process.env.PRIVATE_KEY as `0x${string}`)
    : (`0x${process.env.PRIVATE_KEY}` as `0x${string}`)
);

const walletClient = createWalletClient({
  account,
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

    // Transfer tokens from owner to user
    const hash = await walletClient.writeContract({
      address: FORM_TOKEN_ADDRESS,
      abi: FormRewardsABI,
      functionName: "transfer",
      args: [address as `0x${string}`, parseEther(amount.toString())],
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
