import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { forms, collaborators } from "@/db/schema";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { UpdateFormData } from "@/types/form";
import { CollaboratorRole } from "@/types/collaborator";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function checkFormAccess(
  formId: number,
  userId: string,
  includePending: boolean = false // Add new parameter
): Promise<{
  hasAccess: boolean;
  role?: CollaboratorRole;
  isOwner: boolean;
}> {
  const [form] = await db.select().from(forms).where(eq(forms.id, formId));

  if (!form) {
    return { hasAccess: false, isOwner: false };
  }

  // Check if user is the owner
  if (form.userId === userId) {
    return { hasAccess: true, isOwner: true };
  }

  // Build the collaborator query conditions
  const conditions = [
    eq(collaborators.formId, formId),
    eq(collaborators.userId, userId),
  ];

  // Only add status check if we don't want to include pending
  if (!includePending) {
    conditions.push(eq(collaborators.status, "accepted"));
  }

  // Check if user is a collaborator
  const [collaborator] = await db
    .select()
    .from(collaborators)
    .where(and(...conditions));

  if (collaborator) {
    return {
      hasAccess: true,
      role: collaborator.role as CollaboratorRole,
      isOwner: false,
    };
  }

  // If we want to include pending, check for pending invitations by email
  if (includePending) {
    // Get user's email from Clerk
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (userEmail) {
      const [pendingInvite] = await db
        .select()
        .from(collaborators)
        .where(
          and(
            eq(collaborators.formId, formId),
            eq(collaborators.email, userEmail),
            eq(collaborators.status, "pending")
          )
        );

      if (pendingInvite) {
        return {
          hasAccess: true,
          role: pendingInvite.role as CollaboratorRole,
          isOwner: false,
        };
      }
    }
  }

  return { hasAccess: false, isOwner: false };
}

export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formId = parseInt(params.formId);
    // Pass true to include pending invitations
    const { hasAccess } = await checkFormAccess(formId, userId, true);

    if (!hasAccess) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [form] = await db.select().from(forms).where(eq(forms.id, formId));

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("[FORM_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { userId } = await auth();
    const updates: UpdateFormData = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formId = parseInt(params.formId);
    const { hasAccess, role, isOwner } = await checkFormAccess(formId, userId);

    if (!hasAccess) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Only owners and editors can update the form
    if (!isOwner && role !== "editor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clean up updates object to only include non-undefined values
    const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key as keyof UpdateFormData] = value;
      }
      return acc;
    }, {} as UpdateFormData);

    // Update the form
    const [updatedForm] = await db
      .update(forms)
      .set({
        ...cleanUpdates,
        updatedAt: new Date(),
      })
      .where(eq(forms.id, formId))
      .returning();

    if (!updatedForm) {
      throw new Error("Failed to update form");
    }

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error("[FORM_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formId = parseInt(params.formId);
    const { isOwner } = await checkFormAccess(formId, userId);

    // Only the owner can delete the form
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete collaborators first
    await db.delete(collaborators).where(eq(collaborators.formId, formId));

    // Then delete the form
    const [form] = await db
      .delete(forms)
      .where(eq(forms.id, formId))
      .returning();

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("[FORM_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
