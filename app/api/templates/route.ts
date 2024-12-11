import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms, formTemplates } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    // Fetch both public templates and user's private templates
    const templates = await db
      .select()
      .from(formTemplates)
      .where(
        or(
          eq(formTemplates.isPublic, true),
          userId ? eq(formTemplates.userId, userId) : undefined
        )
      );

    return NextResponse.json(templates);
  } catch (error) {
    console.error("[TEMPLATES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, formId, isPublic } = await request.json();

    if (!formId) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 }
      );
    }

    // Fetch the existing form
    const [existingForm] = await db
      .select()
      .from(forms)
      .where(eq(forms.id, formId));

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (existingForm.userId !== userId) {
      return NextResponse.json(
        { error: "You don't have permission to save this form as a template" },
        { status: 403 }
      );
    }

    // Create the template with the form's elements and settings
    const [template] = await db
      .insert(formTemplates)
      .values({
        name,
        description,
        category: "custom",
        elements: existingForm.elements,
        settings: existingForm.settings,
        userId,
        isPublic: isPublic ?? false, // Use the isPublic value from request, fallback to false
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(template);
  } catch (error) {
    console.error("[TEMPLATES_POST]", error);
    return NextResponse.json(
      { error: "Failed to save template" },
      { status: 500 }
    );
  }
}
