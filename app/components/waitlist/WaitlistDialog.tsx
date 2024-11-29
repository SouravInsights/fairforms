/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Share2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface WaitlistDialogProps {
  children: React.ReactNode;
}

export function WaitlistDialog({ children }: WaitlistDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [position, setPosition] = useState<number | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const referredBy = searchParams.get("ref");
      const payload = { email, referredBy };

      console.log("Submitting waitlist entry:", payload); // Debug log

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Debug logs
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      // If not JSON, log the text
      if (!response.headers.get("content-type")?.includes("application/json")) {
        const text = await response.text();
        console.error("Received non-JSON response:", text);
        throw new Error("Received invalid response from server");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist");
      }

      console.log("Received data:", data); // Debug log

      setReferralCode(data.referralCode);
      setPosition(data.position);
      setIsSubmitted(true);

      toast({
        title: "Welcome to the waitlist! 🎉",
        description: referredBy
          ? "You've been added with a referral bonus!"
          : "You've been successfully added to the waitlist.",
      });
    } catch (error) {
      console.error("Waitlist submission error:", error); // Debug log
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied! 🔗",
      description: "Share this link with friends to move up the waitlist!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{children}</div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSubmitted ? "You're In! 🎉" : "Join the Waitlist"}
          </DialogTitle>
          <DialogDescription>
            {isSubmitted
              ? "Share with friends to move up the list!"
              : "Get early access and special perks."}
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Your referral code:</p>
              <code className="block mt-1 bg-muted p-2 rounded text-center">
                {referralCode}
              </code>
              {position !== null && (
                <p className="text-sm text-muted-foreground text-center">
                  You're #{position} in line
                </p>
              )}
            </div>
            <Button onClick={copyReferralLink} className="w-full">
              <Share2 className="mr-2 h-4 w-4" /> Share Referral Link
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Share your link and move up 5 spots for each friend who joins!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
