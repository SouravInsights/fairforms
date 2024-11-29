import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userForms = await db
      .select()
      .from(forms)
      .where(eq(forms.userId, userId));

    return NextResponse.json(userForms);
  } catch (error) {
    console.error("[FORMS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if a draft form already exists for this user
    const [existingDraft] = await db
      .select()
      .from(forms)
      .where(
        and(
          eq(forms.userId, userId),
          eq(forms.isPublished, false),
          eq(forms.title, "Untitled Form")
        )
      );

    if (existingDraft) {
      // Return the existing draft instead of creating a new one
      return NextResponse.json(existingDraft);
    }

    const defaultSettings = {
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
    };

    const [form] = await db
      .insert(forms)
      .values({
        userId,
        title: "Untitled Form",
        description: "",
        elements: [],
        settings: defaultSettings,
        isPublished: false,
      })
      .returning();

    return NextResponse.json(form);
  } catch (error) {
    console.error("[FORMS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
