import { db } from "@/db";
import { collaborators } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formId = parseInt(params.formId);
    const { email } = await req.json();

    // Find and update the pending collaboration
    const invitation = await db.query.collaborators.findFirst({
      where: and(
        eq(collaborators.formId, formId),
        eq(collaborators.email, email),
        eq(collaborators.status, "pending")
      ),
    });

    if (!invitation) {
      return new NextResponse("Invitation not found", { status: 404 });
    }

    const updatedCollaborator = await db
      .update(collaborators)
      .set({
        userId,
        status: "accepted",
        acceptedAt: new Date(),
      })
      .where(eq(collaborators.id, invitation.id))
      .returning();

    return NextResponse.json(updatedCollaborator[0]);
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
