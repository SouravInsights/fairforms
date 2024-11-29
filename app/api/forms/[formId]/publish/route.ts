import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formId = parseInt(params.formId);
    if (isNaN(formId)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    // Get current form data
    const [existingForm] = await db
      .select()
      .from(forms)
      .where(eq(forms.id, formId));

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (existingForm.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [updatedForm] = await db
      .update(forms)
      .set({
        ...existingForm,
        isPublished: !existingForm.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(forms.id, formId))
      .returning();

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error("[FORM_PUBLISH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
