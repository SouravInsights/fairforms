import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    // Try to find form by custom slug or id
    const [form] = await db
      .select()
      .from(forms)
      .where(
        or(
          eq(forms.customSlug, params.formId),
          eq(forms.id, parseInt(params.formId))
        )
      );

    if (!form || !form.isPublished) {
      return NextResponse.json(
        { error: "Form not found or not published" },
        { status: 404 }
      );
    }

    // Cast isPublished to boolean to match our Form type
    const formWithBooleanPublished = {
      ...form,
      isPublished: Boolean(form.isPublished),
    };

    return NextResponse.json(formWithBooleanPublished);
  } catch (error) {
    console.error("[PUBLIC_FORM_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
