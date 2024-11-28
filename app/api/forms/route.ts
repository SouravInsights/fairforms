import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { FormSettings, CreateFormData } from "@/types/form";

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
};

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

    const formData: CreateFormData = {
      userId,
      title: "Untitled Form",
      description: "",
      elements: [],
      settings: defaultSettings,
      isPublished: false,
    };

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
