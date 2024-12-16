import { resend } from "./config";
import { render } from "@react-email/render";
import CollaborationInviteEmail from "@/app/emails/CollaborationInvite";

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
  try {
    const html = await render(
      CollaborationInviteEmail({
        formTitle,
        inviterName,
        role,
        email: inviteeEmail,
        formId,
      })
    );

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Forms <forms@yourdomain.com>",
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
