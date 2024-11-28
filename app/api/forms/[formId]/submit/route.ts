import { db } from "@/db";
import { forms, responses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const formId = parseInt(params.formId);
    const { responses: formResponses } = await req.json();

    // Check if form exists and is published
    const [form] = await db.select().from(forms).where(eq(forms.id, formId));

    if (!form || !form.isPublished) {
      return NextResponse.json(
        { error: "Form not found or not published" },
        { status: 404 }
      );
    }

    // Create response
    const [response] = await db
      .insert(responses)
      .values({
        formId,
        answers: formResponses,
      })
      .returning();

    return NextResponse.json(response);
  } catch (error) {
    console.error("[FORM_SUBMIT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
