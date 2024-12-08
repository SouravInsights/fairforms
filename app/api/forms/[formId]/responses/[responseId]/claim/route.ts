import { db } from "@/db";
import { forms, responses } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { createWalletClient, http, keccak256, toBytes } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { FORM_REWARDS_ABI } from "@/lib/contracts/abi";

const client = createWalletClient({
  account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
  chain: baseSepolia,
  transport: http(process.env.BASE_SEPOLIA_URL),
});

export async function POST(
  req: Request,
  { params }: { params: { formId: string; responseId: string } }
) {
  try {
    // 1. Get form and response
    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.id, parseInt(params.formId)));

    const [response] = await db
      .select()
      .from(responses)
      .where(eq(responses.id, parseInt(params.responseId)));

    if (!form?.settings.web3?.rewards.enabled || !response?.walletAddress) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (response.rewardClaimed) {
      return NextResponse.json({ error: "Already claimed" }, { status: 400 });
    }

    // 2. Create a unique submission ID by hashing the concatenated values
    console.log(
      `formId: ${form.id}, responseId: ${response.id}, walletAddress: ${response.walletAddress}`
    );

    const submissionId = keccak256(
      toBytes(`${form.id}-${response.id}-${response.walletAddress}`)
    );

    console.log("Claiming reward with submission ID:", submissionId);

    // 3. Send claim transaction
    const hash = await client.writeContract({
      address: form.settings.web3.rewards.tokenAddress as `0x${string}`,
      abi: FORM_REWARDS_ABI,
      functionName: "claimReward",
      args: [submissionId],
    });

    console.log("Claim transaction hash:", hash);

    // 4. Update response
    const [updatedResponse] = await db
      .update(responses)
      .set({
        rewardClaimed: true,
        transactionHash: hash,
        chainId: baseSepolia.id,
      })
      .where(eq(responses.id, parseInt(params.responseId)))
      .returning();

    return NextResponse.json(updatedResponse);
  } catch (error) {
    console.error("[CLAIM_REWARD]", error);
    return NextResponse.json(
      {
        error: "Failed to claim reward",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
