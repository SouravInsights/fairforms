import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms, responses, formTemplates } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, desc, sql, and, or } from "drizzle-orm";
import { FormElement, FormSettings } from "@/types/form";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userForms = await db
      .select({
        id: forms.id,
        userId: forms.userId,
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
      .where(eq(forms.userId, userId))
      .orderBy(desc(forms.createdAt));

    // Get response counts separately
    const formsWithCounts = await Promise.all(
      userForms.map(async (form) => {
        const [count] = await db
          .select({ count: sql<number>`count(*)` })
          .from(responses)
          .where(eq(responses.formId, form.id));

        return {
          ...form,
          responseCount: Number(count?.count || 0),
        };
      })
    );

    return NextResponse.json(formsWithCounts);
  } catch (error) {
    console.error("[FORMS_GET] Detailed error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error,
    });

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

    const { templateId } = await request.json();

    // Default settings for new forms
    const defaultSettings: FormSettings = {
      theme: {
        primaryColor: "#0f172a",
        fontFamily: "Inter",
        backgroundColor: "#ffffff",
        questionColor: "#0f172a",
      },
      behavior: {
        showProgressBar: true,
        enableKeyboardNavigation: true,
        requireLogin: false,
        limitResponses: false,
      },
      notifications: {
        enableEmailNotifications: false,
        notificationEmails: [],
      },
      web3: {
        enabled: false,
        tokenGating: {
          enabled: false,
          chainId: 1,
          tokenType: "ERC20",
        },
        rewards: {
          enabled: false,
          chainId: 1,
        },
      },
    };

    // Explicitly type the formData object
    let formData: {
      userId: string;
      title: string;
      description: string;
      elements: FormElement[];
      settings: FormSettings;
      isPublished: boolean;
    } = {
      userId,
      title: "Untitled Form",
      description: "",
      elements: [],
      settings: defaultSettings,
      isPublished: false,
    };

    // If templateId is provided, fetch and use template data
    if (templateId) {
      const [template] = await db
        .select()
        .from(formTemplates)
        .where(
          and(
            eq(formTemplates.id, templateId),
            or(
              eq(formTemplates.isPublic, true),
              eq(formTemplates.userId, userId)
            )
          )
        );

      if (template) {
        formData = {
          ...formData,
          title: `${template.name} Copy`,
          description: template.description || "",
          elements: template.elements as FormElement[], // Explicit type assertion
          settings: template.settings as FormSettings,
        };
      }
    }

    const [form] = await db.insert(forms).values(formData).returning();

    return NextResponse.json(form);
  } catch (error) {
    console.error("[FORMS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
