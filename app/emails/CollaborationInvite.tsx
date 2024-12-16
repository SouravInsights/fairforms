/* eslint-disable react/no-unescaped-entities */
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
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
  acceptUrl: string;
}

export const CollaborationInviteEmail = ({
  formTitle,
  inviterName,
  role,
  acceptUrl,
}: CollaborationInviteEmailProps) => {
  const roleCapabilities = {
    editor: [
      "View form responses",
      "Edit form content",
      "Update form settings",
    ],
    viewer: ["View form responses"],
  };

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

          <Section style={capabilities}>
            <Text style={text}>As a {role}, you will be able to:</Text>
            <ul>
              {roleCapabilities[role].map((capability, index) => (
                <li key={index} style={listItem}>
                  {capability}
                </li>
              ))}
            </ul>
          </Section>

          <Button
            href={acceptUrl}
            style={{
              ...button,
              padding: "12px 20px",
            }}
          >
            Accept Invitation
          </Button>

          <Hr style={hr} />

          <Text style={footer}>
            If you didn't expect this invitation, you can safely ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
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

const capabilities = {
  margin: "24px 0",
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
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  margin: "16px 0",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "32px 0",
};

const footer = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "24px",
};

export default CollaborationInviteEmail;
