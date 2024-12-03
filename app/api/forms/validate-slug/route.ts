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

    // Basic validation
    if (!slug) {
      return NextResponse.json({ available: true });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "URL can only contain letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    // Check length
    if (slug.length < 3) {
      return NextResponse.json(
        { error: "URL must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (slug.length > 50) {
      return NextResponse.json(
        { error: "URL must be less than 50 characters" },
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

    // List of reserved words you might want to prevent
    const reservedSlugs = [
      "api",
      "admin",
      "dashboard",
      "settings",
      "login",
      "signup",
      "forms",
    ];
    if (reservedSlugs.includes(slug.toLowerCase())) {
      return NextResponse.json(
        { error: "This URL is reserved" },
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
