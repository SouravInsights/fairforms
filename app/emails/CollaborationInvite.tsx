/* eslint-disable react/no-unescaped-entities */
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface CollaborationInviteEmailProps {
  formTitle: string;
  inviterName: string;
  role: "editor" | "viewer";
  email: string;
  formId: number;
}

export const CollaborationInviteEmail = ({
  formTitle,
  inviterName,
  role,
  email,
  formId,
}: CollaborationInviteEmailProps) => {
  const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/forms/${formId}/accept-invitation?email=${encodeURIComponent(email)}`;

  return (
    <Html>
      <Head />
      <Preview>You've been invited to collaborate on "{formTitle}"</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Form Collaboration Invitation</Heading>

          <Text style={text}>Hi there,</Text>

          <Text style={text}>
            {inviterName} has invited you to collaborate on the form "
            {formTitle}" as a {role}.
          </Text>

          <Section style={section}>
            <Text style={text}>As a {role}, you will be able to:</Text>
            {role === "editor" ? (
              <ul>
                <li style={listItem}>View form responses</li>
                <li style={listItem}>Edit form content</li>
                <li style={listItem}>Update form settings</li>
              </ul>
            ) : (
              <ul>
                <li style={listItem}>View form responses</li>
              </ul>
            )}
          </Section>

          <Button href={acceptUrl} style={button}>
            Accept Invitation
          </Button>

          <Text style={footer}>
            If you didn't expect this invitation, you can safely ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const section = {
  margin: "24px 0",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const listItem = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "8px 0",
};

const button = {
  backgroundColor: "#0071e3",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
  margin: "16px 0",
};

const footer = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "24px",
};

export default CollaborationInviteEmail;
