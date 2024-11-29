import { db } from "@/db";
import { waitlistTable } from "@/db/schema";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email, referredBy } = await req.json();

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(waitlistTable)
      .where(eq(waitlistTable.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate referral code
    const referralCode = nanoid(8);

    // Get current position
    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(waitlistTable);

    let position = count;

    // Check if referredBy exists and is valid
    if (referredBy) {
      const referrer = await db
        .select()
        .from(waitlistTable)
        .where(eq(waitlistTable.referralCode, referredBy));

      if (referrer.length > 0) {
        // Place the new user right after the referrer's position
        position = Math.max(0, referrer[0].position - 1);
      }
    }

    // Insert new waitlist entry
    const [newEntry] = await db
      .insert(waitlistTable)
      .values({
        email,
        referralCode,
        position,
        referredBy: referredBy || null,
      })
      .returning();

    // If this was a referral, update positions for users after the referrer
    if (referredBy) {
      await db
        .update(waitlistTable)
        .set({
          position: sql`${waitlistTable.position} + 1`,
        })
        .where(
          sql`${waitlistTable.position} >= ${position} AND ${waitlistTable.referralCode} != ${referralCode}`
        );
    }

    return NextResponse.json({
      referralCode: newEntry.referralCode,
      position: newEntry.position,
    });
  } catch (error) {
    console.error("[WAITLIST_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const email = url.searchParams.get("email");

    if (!code && !email) {
      return NextResponse.json(
        { error: "Code or email is required" },
        { status: 400 }
      );
    }

    let entry = null;

    if (code) {
      // Find by referral code
      const referralEntries = await db
        .select({
          position: waitlistTable.position,
          referralCount: sql<number>`(
            SELECT count(*)
            FROM ${waitlistTable} as refs
            WHERE refs.referred_by = ${waitlistTable.referralCode}
          )`.mapWith(Number),
        })
        .from(waitlistTable)
        .where(eq(waitlistTable.referralCode, code));

      if (referralEntries.length > 0) entry = referralEntries[0];
    } else if (email) {
      // Find by email
      const emailEntries = await db
        .select({
          position: waitlistTable.position,
          referralCount: sql<number>`(
            SELECT count(*)
            FROM ${waitlistTable} as refs
            WHERE refs.referred_by = ${waitlistTable.referralCode}
          )`.mapWith(Number),
        })
        .from(waitlistTable)
        .where(eq(waitlistTable.email, email));

      if (emailEntries.length > 0) entry = emailEntries[0];
    }

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    // Get total count for percentage calculation
    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(waitlistTable);

    const percentile = ((count - entry.position) / count) * 100;

    return NextResponse.json({
      position: entry.position,
      totalCount: count,
      percentile: Math.round(percentile),
      referralCount: entry.referralCount,
    });
  } catch (error) {
    console.error("[WAITLIST_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  try {
    const [stats] = await db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
        referrals: sql<number>`
          count(case when referred_by is not null then 1 end)
        `.mapWith(Number),
      })
      .from(waitlistTable);

    return new Response(null, {
      headers: {
        "X-Total-Waitlist": stats.count.toString(),
        "X-Total-Referrals": stats.referrals.toString(),
      },
    });
  } catch (error) {
    console.error("[WAITLIST_STATS_ERROR]", error);
    return new Response(null, { status: 500 });
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      Allow: "POST, GET, HEAD, OPTIONS",
      "Access-Control-Allow-Methods": "POST, GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
