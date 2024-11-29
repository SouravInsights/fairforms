/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Share2, Sparkles, Coffee, X } from "lucide-react";
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

  const perks = [
    "Early access to all features",
    "Special founding member badge",
    "Priority support forever",
    "Unlimited forms from day one",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{children}</div>
      <DialogContent className="sm:max-w-[450px] p-0 bg-background overflow-hidden">
        {/* Receipt-style header */}
        <div className="relative bg-primary/10 p-6 rounded-t-lg">
          <div className="absolute top-0 left-0 w-full flex justify-around">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-2 h-4 bg-background rounded-b-sm" />
            ))}
          </div>
          <div className="pt-4 text-center">
            {!isSubmitted ? (
              <>
                <h2 className="text-2xl font-bold">Early Access Ticket</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Limited spots available
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 text-2xl font-bold">
                  <Sparkles className="h-6 w-6" />
                  You're In!
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Time to celebrate with coffee ☕️
                </p>
              </>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Your Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-card border-primary/20 pr-8"
                  />
                  <Coffee className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-base h-12 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Secure Your Spot"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </Button>

              {/* Perks list */}
              <div className="space-y-3 pt-2">
                <p className="text-sm font-medium">You'll get:</p>
                {perks.map((perk, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-4 w-4 rounded-full border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="h-2.5 w-2.5 rotate-45" />
                    </div>
                    {perk}
                  </div>
                ))}
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Position indicator */}
              <div className="bg-primary/5 rounded-lg p-4 text-center space-y-1">
                <p className="text-4xl font-bold text-primary">#{position}</p>
                <p className="text-sm text-muted-foreground">
                  in line for early access
                </p>
              </div>

              {/* Referral section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Your Special Link
                  </label>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm break-all">
                    {referralCode}
                  </div>
                </div>

                <Button
                  onClick={copyReferralLink}
                  className="w-full gap-2 h-12 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share & Skip the Line
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Each friend who joins moves you up 5 spots!
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
