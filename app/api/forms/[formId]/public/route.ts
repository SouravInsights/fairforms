import { db } from "@/db";
import { forms } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function GET(
  request: Request,
  { params }: { params: { formId: string } }
) {
  try {
    console.log("Public API Route Hit - Form ID/Slug:", params.formId);

    // Try to parse as numeric ID first
    const formId = parseInt(params.formId);

    let query;
    if (isNaN(formId)) {
      // If not a number, search by slug
      console.log("Searching by slug:", params.formId);
      query = eq(forms.customSlug, params.formId);
    } else {
      // If numeric, search by ID or matching slug
      console.log("Searching by ID:", formId);
      query = or(eq(forms.id, formId), eq(forms.customSlug, params.formId));
    }

    const [form] = await db.select().from(forms).where(query);

    console.log("Form found:", form);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form.isPublished) {
      return NextResponse.json(
        { error: "Form not published" },
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
