import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { formTemplates } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: { templateId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if template exists and belongs to user
    const [template] = await db
      .select()
      .from(formTemplates)
      .where(eq(formTemplates.id, parseInt(params.templateId)));

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    if (template.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the template
    await db
      .delete(formTemplates)
      .where(eq(formTemplates.id, parseInt(params.templateId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TEMPLATE_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
