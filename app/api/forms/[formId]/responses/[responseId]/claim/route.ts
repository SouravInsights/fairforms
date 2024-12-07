import { db } from "@/db";
import { responses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { formId: string; responseId: string } }
) {
  try {
    const { transactionHash } = await req.json();

    const [response] = await db
      .update(responses)
      .set({
        rewardClaimed: true,
        transactionHash,
      })
      .where(eq(responses.id, parseInt(params.responseId)))
      .returning();

    return NextResponse.json(response);
  } catch (error) {
    console.error("[CLAIM_REWARD]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
