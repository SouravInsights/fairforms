import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { NextResponse } from "next/server";
import { FormSettings } from "@/types/form";
import { generateForm } from "@/lib/services/form-ai-generator";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const { title, description, elements } = await generateForm(prompt);

    // Default settings
    const defaultSettings: FormSettings = {
      theme: {
        primaryColor: "#0f172a",
        fontFamily: "Inter",
        backgroundColor: "#ffffff",
        questionColor: "#0f172a",
        textColor: "#374151",
        sidebarColor: "#F8FAFC",
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

    const [form] = await db
      .insert(forms)
      .values({
        userId,
        title,
        description,
        elements,
        settings: defaultSettings,
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      formId: form.id,
      title,
      description,
    });
  } catch (error) {
    console.error("[AI_GENERATE_FORM]", error);
    return NextResponse.json(
      { error: "Failed to generate form" },
      { status: 500 }
    );
  }
}
