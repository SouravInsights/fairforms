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
import { Collaborator } from "@/types/collaborator";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AcceptInvitationPage({
  params,
}: {
  params: { formId: string };
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isAccepting, setIsAccepting] = useState(false);
  const [invitationDetails, setInvitationDetails] = useState<{
    formTitle: string;
    role: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const email = searchParams.get("email");

  useEffect(() => {
    // If user is loaded but not signed in, redirect to sign-in
    if (isLoaded && !isSignedIn) {
      const currentUrl = window.location.href;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`);
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const loadInvitationDetails = async () => {
      if (!email) {
        setError("Invalid invitation link");
        return;
      }

      try {
        const response = await fetch(`/api/forms/${params.formId}`);
        if (!response.ok) {
          throw new Error("Form not found");
        }
        const form = await response.json();

        // Get collaborator details
        const collaboratorResponse = await fetch(
          `/api/forms/${params.formId}/collaborators`
        );
        if (!collaboratorResponse.ok) {
          throw new Error("Failed to load invitation details");
        }
        const collaborators =
          (await collaboratorResponse.json()) as Collaborator[];

        const invitation = collaborators.find(
          (c: Collaborator) => c.email === email && c.status === "pending"
        );

        if (!invitation) {
          throw new Error("Invitation not found or already accepted");
        }

        setInvitationDetails({
          formTitle: form.title,
          role: invitation.role,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    };

    if (isSignedIn && email) {
      loadInvitationDetails();
    }
  }, [params.formId, email, isSignedIn]);

  const handleAcceptInvitation = async () => {
    if (!email || !user) return;

    setIsAccepting(true);
    try {
      const response = await fetch(
        `/api/forms/${params.formId}/collaborators/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept invitation");
      }

      toast({
        title: "Success!",
        description: "You now have access to the form",
      });

      // Redirect to the form
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

  if (!isLoaded || (!isSignedIn && isLoaded)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
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

  if (!invitationDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
          <CardDescription>
            You've been invited to collaborate on "{invitationDetails.formTitle}
            " as a {invitationDetails.role}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {invitationDetails.role === "editor" ? (
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
