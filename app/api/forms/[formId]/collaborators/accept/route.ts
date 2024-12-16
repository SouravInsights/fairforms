import { db } from "@/db";
import { collaborators } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const acceptInviteSchema = z.object({
  email: z.string().email(),
  userId: z.string().min(1),
});

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
    const body = await req.json();
    const { email, userId: invitedUserId } = acceptInviteSchema.parse(body);

    // Verify that the authenticated user matches the invited user
    if (userId !== invitedUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find and update the pending collaboration
    const [invitation] = await db
      .select()
      .from(collaborators)
      .where(
        and(
          eq(collaborators.formId, formId),
          eq(collaborators.email, email),
          eq(collaborators.status, "pending")
        )
      );

    if (!invitation) {
      return new NextResponse("Invitation not found", { status: 404 });
    }

    const [updatedCollaborator] = await db
      .update(collaborators)
      .set({
        userId: invitedUserId,
        status: "accepted",
        acceptedAt: new Date(),
      })
      .where(eq(collaborators.id, invitation.id))
      .returning();

    return NextResponse.json(updatedCollaborator);
  } catch (error) {
    console.error("Error accepting invitation:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
