/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Loader2, LogOut, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Collaborator } from "@/types/collaborator";
import { SignOutButton } from "@clerk/nextjs";

export default function AcceptInvitationPage({
  params,
}: {
  params: { formId: string };
}) {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isAccepting, setIsAccepting] = useState(false);
  const [invitationDetails, setInvitationDetails] = useState<{
    formTitle: string;
    role: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const invitationEmail = searchParams.get("email");
  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (!invitationEmail) {
      setError("Missing email in invitation link");
      setIsLoading(false);
      return;
    }

    if (!user) {
      setIsLoading(false);
      return;
    }

    // Check if the invitation email matches the logged-in user's email
    if (currentUserEmail !== invitationEmail) {
      setError(
        "Please log in with the email address that received the invitation"
      );
      setIsLoading(false);
      return;
    }

    const loadInvitationDetails = async () => {
      try {
        const formResponse = await fetch(`/api/forms/${params.formId}`);
        if (!formResponse.ok) {
          throw new Error("Form not found");
        }
        const form = await formResponse.json();

        const collaboratorResponse = await fetch(
          `/api/forms/${params.formId}/collaborators`
        );
        if (!collaboratorResponse.ok) {
          throw new Error("Failed to load invitation details");
        }
        const collaborators =
          (await collaboratorResponse.json()) as Collaborator[];

        const invitation = collaborators.find(
          (c) => c.email === invitationEmail && c.status === "pending"
        );

        if (!invitation) {
          throw new Error("Invitation not found or already accepted");
        }

        setInvitationDetails({
          formTitle: form.title,
          role: invitation.role,
        });
        setError(null);
      } catch (err) {
        console.error("Error loading invitation:", err);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    loadInvitationDetails();
  }, [params.formId, invitationEmail, user, currentUserEmail]);

  const handleAcceptInvitation = async () => {
    if (!invitationEmail || !user) return;

    setIsAccepting(true);
    try {
      const response = await fetch(
        `/api/forms/${params.formId}/collaborators/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: invitationEmail,
            userId: user.id,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to accept invitation");
      }

      toast({
        title: "Success!",
        description: "You now have access to the form",
      });

      router.push(`/dashboard/forms/${params.formId}`);
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to accept invitation",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Show email mismatch error with option to sign out
  if (currentUserEmail !== invitationEmail) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Wrong Account
            </CardTitle>
            <CardDescription>
              This invitation was sent to {invitationEmail}. Please sign in with
              that email address to accept the invitation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Currently signed in as: {currentUserEmail}
            </div>
            <div className="flex gap-2">
              <SignOutButton>
                <Button variant="outline" className="flex-1">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </SignOutButton>
              <Button asChild className="flex-1">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show invitation acceptance UI
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
          <CardDescription>
            You've been invited to collaborate on "
            {invitationDetails?.formTitle}" as a {invitationDetails?.role}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {invitationDetails?.role === "editor" ? (
                <p>
                  As an editor, you'll be able to view responses and edit the
                  form.
                </p>
              ) : (
                <p>As a viewer, you'll be able to view form responses.</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleAcceptInvitation}
                disabled={isAccepting}
                className="flex-1"
              >
                {isAccepting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Accept Invitation
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
