import { db } from "@/db";
import { forms } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function GET(
  request: Request,
  { params }: { params: { formId: string } }
) {
  try {
    console.log("Public API Route Hit - Form ID:", params.formId);

    const formId = parseInt(params.formId);
    if (isNaN(formId)) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    const [form] = await db.select().from(forms).where(eq(forms.id, formId));

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
