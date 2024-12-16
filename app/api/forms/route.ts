import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms, responses, formTemplates, collaborators } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, desc, sql, and, or, inArray } from "drizzle-orm";
import { FormElement, FormSettings } from "@/types/form";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's email for checking collaborations
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    // First, get the form IDs where user is a collaborator
    const collaboratedForms = await db
      .select({ formId: collaborators.formId })
      .from(collaborators)
      .where(
        and(
          or(
            eq(collaborators.userId, userId),
            eq(collaborators.email, userEmail || "")
          ),
          eq(collaborators.status, "accepted")
        )
      );

    const collaboratedFormIds = collaboratedForms.map((f) => f.formId);

    // Get all forms (owned + collaborated)
    const allForms = await db
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
      .where(
        collaboratedFormIds.length > 0
          ? or(eq(forms.userId, userId), inArray(forms.id, collaboratedFormIds))
          : eq(forms.userId, userId)
      )
      .orderBy(desc(forms.createdAt));

    // Get the collaboration info for each form
    const formsWithCollabInfo = await Promise.all(
      allForms.map(async (form) => {
        // Get response count
        const [count] = await db
          .select({ count: sql<number>`count(*)` })
          .from(responses)
          .where(eq(responses.formId, form.id));

        // Get collaboration role if user is a collaborator
        let role: "owner" | "editor" | "viewer" = "owner";
        let isCollaborator = false;

        if (form.userId !== userId) {
          const [collaboration] = await db
            .select()
            .from(collaborators)
            .where(
              and(
                eq(collaborators.formId, form.id),
                or(
                  eq(collaborators.userId, userId),
                  eq(collaborators.email, userEmail || "")
                ),
                eq(collaborators.status, "accepted")
              )
            );

          if (collaboration) {
            role = collaboration.role as "editor" | "viewer";
            isCollaborator = true;
          }
        }

        return {
          ...form,
          responseCount: Number(count?.count || 0),
          role,
          isCollaborator,
        };
      })
    );

    return NextResponse.json(formsWithCollabInfo);
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
