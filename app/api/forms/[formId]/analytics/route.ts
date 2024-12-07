import { db } from "@/db";
import { responses } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const formId = parseInt(params.formId);

    const stats = await db
      .select({
        totalResponses: sql`count(*)`,
        totalRewardsClaimed: sql`count(*) filter (where reward_claimed = true)`,
        uniqueWallets: sql`count(distinct wallet_address)`,
      })
      .from(responses)
      .where(eq(responses.formId, formId));

    return NextResponse.json(stats[0]);
  } catch (error) {
    console.error("[FORM_ANALYTICS]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
