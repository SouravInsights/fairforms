interface InvitationEmailProps {
  formTitle: string;
  inviterName: string;
  role: string;
  acceptUrl: string;
}

export function getInvitationEmailContent({
  formTitle,
  inviterName,
  role,
  acceptUrl,
}: InvitationEmailProps) {
  return {
    subject: `You've been invited to collaborate on "${formTitle}"`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Form Collaboration Invitation</h2>
        <p>Hi there,</p>
        <p>${inviterName} has invited you to collaborate on the form "${formTitle}" as a ${role}.</p>
        
        <div style="margin: 24px 0;">
          <p>As a ${role}, you will be able to:</p>
          <ul>
            ${
              role === "editor"
                ? `
              <li>View form responses</li>
              <li>Edit form content</li>
              <li>Update form settings</li>
            `
                : `
              <li>View form responses</li>
            `
            }
          </ul>
        </div>

        <a href="${acceptUrl}" style="
          background-color: #0071e3;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
          margin: 16px 0;
        ">Accept Invitation</a>

        <p style="color: #666; font-size: 14px;">
          If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </div>
    `,
    text: `
      Form Collaboration Invitation

      Hi there,

      ${inviterName} has invited you to collaborate on the form "${formTitle}" as a ${role}.

      As a ${role}, you will be able to:
      ${
        role === "editor"
          ? "- View form responses\n- Edit form content\n- Update form settings"
          : "- View form responses"
      }

      Accept the invitation here: ${acceptUrl}

      If you didn't expect this invitation, you can safely ignore this email.
    `,
  };
}
