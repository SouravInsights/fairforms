import { db } from "@/db";
import { forms, responses } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { FormRewardsABI } from "@/lib/contracts/abi";

// Ensure private key exists
if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY environment variable is not set");
}

// Initialize Viem clients
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const account = privateKeyToAccount(
  process.env.PRIVATE_KEY.startsWith("0x")
    ? (process.env.PRIVATE_KEY as `0x${string}`)
    : (`0x${process.env.PRIVATE_KEY}` as `0x${string}`)
);

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(),
});

export async function POST(
  req: Request,
  { params }: { params: { formId: string; responseId: string } }
) {
  try {
    // Get form and response
    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.id, parseInt(params.formId)));

    const [response] = await db
      .select()
      .from(responses)
      .where(eq(responses.id, parseInt(params.responseId)));

    if (!form || !response) {
      return NextResponse.json(
        { error: "Form or response not found" },
        { status: 404 }
      );
    }

    // Verify web3 settings
    if (!form.settings.web3?.rewards.enabled) {
      return NextResponse.json(
        { error: "Rewards not enabled for this form" },
        { status: 400 }
      );
    }

    // Check if already claimed
    if (response.rewardClaimed) {
      return NextResponse.json(
        { error: "Reward already claimed" },
        { status: 400 }
      );
    }

    if (!response.walletAddress) {
      return NextResponse.json(
        { error: "No wallet address provided" },
        { status: 400 }
      );
    }

    // Get contract details
    const contractAddress = form.settings.web3.rewards.tokenAddress;
    if (!contractAddress) {
      return NextResponse.json(
        { error: "No reward token address configured" },
        { status: 400 }
      );
    }

    const rewardAmount = form.settings.web3.rewards.rewardAmount;
    if (!rewardAmount) {
      return NextResponse.json(
        { error: "No reward amount configured" },
        { status: 400 }
      );
    }

    console.log("Distributing reward:", {
      contractAddress,
      recipient: response.walletAddress,
      amount: rewardAmount,
    });

    // Send reward transaction
    const { request } = await publicClient.simulateContract({
      address: contractAddress as `0x${string}`,
      abi: FormRewardsABI,
      functionName: "distributeReward",
      args: [response.walletAddress as `0x${string}`, parseEther(rewardAmount)],
      account: account.address,
    });

    const hash = await walletClient.writeContract(request);
    console.log("Transaction hash:", hash);

    // Wait for transaction
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction receipt:", receipt);

    // Update response with transaction details
    const [updatedResponse] = await db
      .update(responses)
      .set({
        rewardClaimed: true,
        transactionHash: receipt.transactionHash,
      })
      .where(eq(responses.id, parseInt(params.responseId)))
      .returning();

    return NextResponse.json(updatedResponse);
  } catch (error) {
    console.error("[CLAIM_REWARD]", error);
    return NextResponse.json(
      {
        error: "Failed to process reward",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
