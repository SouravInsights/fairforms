import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, currentFormId } = await request.json();

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Invalid slug format" },
        { status: 400 }
      );
    }

    // Check if slug is already taken
    const existingForm = await db
      .select()
      .from(forms)
      .where(eq(forms.customSlug, slug));

    // If slug is taken but by the current form, it's okay
    if (
      existingForm.length > 0 &&
      existingForm[0].id !== parseInt(currentFormId)
    ) {
      return NextResponse.json(
        { error: "This URL is already taken" },
        { status: 400 }
      );
    }

    return NextResponse.json({ available: true });
  } catch (error) {
    console.error("[VALIDATE_SLUG]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
