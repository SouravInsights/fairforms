import { resend } from "./config";
import CollaborationInviteEmail from "@/app/emails/CollaborationInvite";
import { render } from "@react-email/render";

interface SendInvitationProps {
  formId: number;
  formTitle: string;
  inviterName: string;
  inviteeEmail: string;
  role: "editor" | "viewer";
}

export async function sendInvitationEmail({
  formId,
  formTitle,
  inviterName,
  inviteeEmail,
  role,
}: SendInvitationProps) {
  const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/forms/${formId}/accept-invitation`;

  try {
    // Await the render function
    const html = await render(
      CollaborationInviteEmail({
        formTitle,
        inviterName,
        role,
        acceptUrl,
      })
    );

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Forms <hello@fairforms.xyz>",
      to: inviteeEmail,
      subject: `You've been invited to collaborate on "${formTitle}"`,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending invitation email:", error);
    return { success: false, error };
  }
}
