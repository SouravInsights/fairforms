// app/api/forms/[formId]/public/[token]/star/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { starredResponses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { decryptFormId } from "@/lib/encrypt";

export async function POST(
  req: Request,
  { params }: { params: { formId: string; token: string } }
) {
  try {
    const { responseId } = await req.json();
    const { formId, token } = params;
    const formIdNumber = parseInt(formId);

    // Verify the token matches the form ID
    const decryptedFormId = decryptFormId(token);
    if (!decryptedFormId || parseInt(decryptedFormId) !== formIdNumber) {
      return NextResponse.json({ error: "Invalid link" }, { status: 401 });
    }

    // Check if already starred
    const [existing] = await db
      .select()
      .from(starredResponses)
      .where(
        and(
          eq(starredResponses.responseId, responseId),
          eq(starredResponses.formId, formIdNumber),
          eq(starredResponses.token, token)
        )
      );

    // If starred, unstar it
    if (existing) {
      await db
        .delete(starredResponses)
        .where(eq(starredResponses.id, existing.id));
      return NextResponse.json({ starred: false });
    }

    // If not starred, star it
    await db.insert(starredResponses).values({
      responseId,
      formId: formIdNumber,
      token,
    });

    return NextResponse.json({ starred: true });
  } catch (error) {
    console.error("[STAR_RESPONSE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Get starred responses
export async function GET(
  req: Request,
  { params }: { params: { formId: string; token: string } }
) {
  try {
    const { formId, token } = params;
    const formIdNumber = parseInt(formId);

    // Verify token
    const decryptedFormId = decryptFormId(token);
    if (!decryptedFormId || parseInt(decryptedFormId) !== formIdNumber) {
      return NextResponse.json({ error: "Invalid link" }, { status: 401 });
    }

    const starred = await db
      .select()
      .from(starredResponses)
      .where(
        and(
          eq(starredResponses.formId, formIdNumber),
          eq(starredResponses.token, token)
        )
      );

    return NextResponse.json({
      starred: starred.map((s) => s.responseId),
    });
  } catch (error) {
    console.error("[GET_STARRED_RESPONSES_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
