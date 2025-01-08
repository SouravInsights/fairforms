import { NextResponse } from "next/server";
import { encryptFormId } from "@/lib/encrypt";

export async function POST(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { formId } = params;
    const token = encryptFormId(formId);
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/forms/${formId}/responses/${token}`;

    return NextResponse.json({ shareUrl });
  } catch (error) {
    console.error("[SHARE_LINK_GENERATION_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
