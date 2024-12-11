import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms, formTemplates } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { FormElement, FormSettings } from "@/types/form";

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

    const { name, description, formId } = await request.json();

    // Initialize with empty arrays/objects with proper types
    let elements: FormElement[] = [];
    let settings: FormSettings = {
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

    if (formId) {
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

      elements = existingForm.elements;
      settings = existingForm.settings;
    }

    const [template] = await db
      .insert(formTemplates)
      .values({
        name,
        description,
        category: "custom",
        elements,
        settings,
        userId,
        isPublic: false,
      })
      .returning();

    return NextResponse.json(template);
  } catch (error) {
    console.error("[TEMPLATES_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
