import { db } from "@/db";
import { forms } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function GET(
  request: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const headers = new Headers();
    headers.set("Cache-Control", "no-store, max-age=0");

    const formId = parseInt(params.formId);
    const query = isNaN(formId)
      ? eq(forms.customSlug, params.formId)
      : or(eq(forms.id, formId), eq(forms.customSlug, params.formId));

    const [form] = await db
      .select({
        id: forms.id,
        title: forms.title,
        description: forms.description,
        elements: forms.elements,
        settings: forms.settings,
        isPublished: forms.isPublished,
        customSlug: forms.customSlug,
        createdAt: forms.createdAt,
        updatedAt: forms.updatedAt,
        metaTitle: forms.metaTitle,
        metaDescription: forms.metaDescription,
        socialImageUrl: forms.socialImageUrl,
      })
      .from(forms)
      .where(query);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form.isPublished) {
      return NextResponse.json(
        { error: "Form not published" },
        { status: 404 }
      );
    }

    const formWithBooleanPublished = {
      ...form,
      isPublished: Boolean(form.isPublished),
    };

    return NextResponse.json(formWithBooleanPublished, { headers });
  } catch (error) {
    console.error("[PUBLIC_FORM_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
