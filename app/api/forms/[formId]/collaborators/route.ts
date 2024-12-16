import { db } from "@/db";
import { collaborators, forms } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendInvitationEmail } from "@/lib/email/send-invitation";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const addCollaboratorSchema = z.object({
  email: z.string().email(),
  role: z.enum(["editor", "viewer"]),
});

async function checkFormOwnership(formId: number, userId: string) {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
  });

  if (!form) {
    throw new Error("Form not found");
  }

  if (form.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return form;
}

export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formId = parseInt(params.formId);

    // Get user's email from Clerk
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    // Check if user is form owner or a collaborator
    const form = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
      with: {
        collaborators: true,
      },
    });

    if (!form) {
      return new NextResponse("Form not found", { status: 404 });
    }

    const isOwner = form.userId === userId;
    const isCollaborator = form.collaborators.some(
      (c) =>
        c.userId === userId || (c.email === userEmail && c.status === "pending")
    );

    if (!isOwner && !isCollaborator) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formCollaborators = await db.query.collaborators.findMany({
      where: eq(collaborators.formId, formId),
    });

    // If user is not the owner, only return their own collaboration record
    if (!isOwner) {
      const userCollaboration = formCollaborators.filter(
        (c) =>
          c.userId === userId ||
          (c.email === userEmail && c.status === "pending")
      );
      return NextResponse.json(userCollaboration);
    }

    return NextResponse.json(formCollaborators);
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

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

    // Get form details and check ownership
    const form = await checkFormOwnership(formId, userId);

    const body = await req.json();
    const { email, role } = addCollaboratorSchema.parse(body);

    // Check if collaborator already exists
    const existingCollaborator = await db.query.collaborators.findFirst({
      where: and(
        eq(collaborators.formId, formId),
        eq(collaborators.email, email)
      ),
    });

    if (existingCollaborator) {
      return new NextResponse("Collaborator already exists", { status: 400 });
    }

    // Get inviter's name from Clerk
    const inviter = await clerkClient.users.getUser(userId);
    const inviterName = inviter.firstName
      ? `${inviter.firstName} ${inviter.lastName || ""}`
      : email;

    const newCollaborator = await db
      .insert(collaborators)
      .values({
        formId,
        email,
        role,
        userId: "", // Will be updated when user accepts invitation
        addedBy: userId,
        status: "pending",
      })
      .returning();

    console.log("Attempting to send email with data:", {
      formId,
      formTitle: form.title,
      inviterName: inviterName.trim(),
      inviteeEmail: email,
      role,
    });

    // Send invitation email
    const emailResult = await sendInvitationEmail({
      formId,
      formTitle: form.title,
      inviterName: inviterName.trim(),
      inviteeEmail: email,
      role,
    });

    console.log("Email result:", emailResult);

    if (!emailResult.success) {
      // If email fails, we might want to delete the collaborator record
      // or mark it as failed
      console.error("Failed to send invitation email:", emailResult.error);
    }

    return NextResponse.json(newCollaborator[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 });
    }
    console.error("Error adding collaborator:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formId = parseInt(params.formId);
    const { searchParams } = new URL(req.url);
    const collaboratorId = searchParams.get("collaboratorId");

    if (!collaboratorId) {
      return new NextResponse("Collaborator ID is required", { status: 400 });
    }

    // Only form owner can remove collaborators
    await checkFormOwnership(formId, userId);

    await db
      .delete(collaborators)
      .where(
        and(
          eq(collaborators.id, parseInt(collaboratorId)),
          eq(collaborators.formId, formId)
        )
      );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
