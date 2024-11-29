/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PiggyBank, Laugh, Heart, HandCoins } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-16 space-y-24">
        {/* Hero Section */}
        <div className="space-y-4 text-center">
          <Badge variant="secondary" className="mb-4">
            👋 Hey there, form enthusiast!
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold">
            Because Typeform was{" "}
            <span className="relative">
              expensive
              <div className="absolute -top-1 left-0 w-full h-[2px] bg-primary" />
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
            A form builder that won't cost you a kidney. Built by a dev who
            refused to pay enterprise pricing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <SignUpButton mode="modal">
              <Button size="lg" className="gap-2">
                Start Building <span className="text-sm">(It's Free!)</span>
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg">
                Welcome Back
              </Button>
            </SignInButton>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <HandCoins />
            </div>
            <h3 className="text-xl font-semibold">The "No Upsell" Promise</h3>
            <p className="text-muted-foreground">
              No "Premium" popups every 2 seconds. No "Upgrade to access basic
              features". Just forms, pure and simple.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <PiggyBank />
            </div>
            <h3 className="text-xl font-semibold">
              Budget-Friendly (Like, Free)
            </h3>
            <p className="text-muted-foreground">
              Remember when software was made to help people, not to maximize
              MRR? Yeah, we're bringing that back.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Laugh />
            </div>
            <h3 className="text-xl font-semibold">Built Out of Spite</h3>
            <p className="text-muted-foreground">
              When the Typeform pricing page made me cry, I didn't just
              complain. I built this. Take that, enterprise pricing!
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Heart />
            </div>
            <h3 className="text-xl font-semibold">
              Made with Love (and Caffeine)
            </h3>
            <p className="text-muted-foreground">
              Every feature was built after midnight, fueled by coffee and the
              dream of never seeing a "Your free trial has ended" email again.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-6 py-12">
          <h2 className="text-2xl font-semibold">
            Ready to Join the Revolution?
          </h2>
          <p className="text-muted-foreground max-w-[500px] mx-auto">
            Create forms that look like they cost $200/month, but keep your
            money for what really matters. Like coffee. Or pizza.
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" className="gap-2">
              Start Creating Forms{" "}
              <span className="text-sm">(Still Free!)</span>
            </Button>
          </SignUpButton>
          <p className="text-sm text-muted-foreground">
            No credit card required. Ever. Seriously.
          </p>
        </div>
      </div>
    </div>
  );
}
