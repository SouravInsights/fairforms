/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Coffee,
  Rocket,
  Star,
  Sparkles,
  HandCoins,
  PiggyBank,
  Laugh,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WaitlistDialog } from "@/app/components/waitlist/WaitlistDialog";

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
          <Badge variant="secondary" className="mb-4 animate-bounce">
            🚀 Early Access Now Open!
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold group">
            Because Typeform was{" "}
            <span className="relative inline-block">
              expensive
              {/* Underline */}
              <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-primary" />
              {/* Tooltip */}
              <div className="absolute -top-8 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-sm bg-background border px-2 py-1 rounded-md shadow-sm">
                  like, really expensive
                </span>
              </div>
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
            A form builder for the rest of us. No venture capital. No growth
            hacking. Just forms that work.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <WaitlistDialog>
              <Button size="lg" className="gap-2 group">
                Join Early Access{" "}
                <Sparkles className="h-4 w-4 group-hover:animate-spin" />
              </Button>
            </WaitlistDialog>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg">
                Already In? Welcome Back!
              </Button>
            </SignInButton>
          </div>

          <p className="text-md text-muted-foreground mt-4">
            Join <span className="font-semibold text-foreground">142</span>{" "}
            others in early access (the number is fake ofcourse haha 😜)
          </p>
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
        {/* New Timeline Section */}
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-primary/20" />
          <div className="space-y-12 relative">
            <h3 className="text-center text-2xl font-semibold mb-8">
              The Story So Far...
            </h3>

            <div className="ml-[50%] pl-8 relative">
              <div className="absolute left-0 top-3 w-4 h-4 rounded-full bg-primary -translate-x-[9px]" />
              <h4 className="font-semibold">The Breaking Point</h4>
              <p className="text-muted-foreground">
                Saw Typeform's pricing page. Spilled coffee. Started coding.
              </p>
            </div>

            <div className="mr-[50%] pr-8 text-right relative">
              <div className="absolute right-0 top-3 w-4 h-4 rounded-full bg-primary translate-x-[9px]" />
              <h4 className="font-semibold">The Development</h4>
              <p className="text-muted-foreground">
                3 AM coding sessions. Lots of coffee. Some questionable commit
                messages.
              </p>
            </div>

            <div className="ml-[50%] pl-8 relative">
              <div className="absolute left-0 top-3 w-4 h-4 rounded-full bg-primary -translate-x-[9px]" />
              <h4 className="font-semibold">Early Access Launch</h4>
              <p className="text-muted-foreground">
                You're looking at it! Join us and let's build something awesome
                together.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom CTA */}
        <div className="text-center space-y-6 py-12 bg-card rounded-lg p-8">
          <div className="inline-block animate-bounce">
            <Coffee className="h-8 w-8 mx-auto text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">
            Save Money, Get Forms, Buy Coffee Instead
          </h2>
          <p className="text-muted-foreground max-w-[500px] mx-auto">
            For the price of one month of Typeform, you could buy{" "}
            <span className="font-semibold">47 cups of coffee</span>. Join us
            and keep your coffee budget intact.
          </p>
          <WaitlistDialog>
            <Button size="lg" className="gap-2 group">
              Get Early Access{" "}
              <Rocket className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </WaitlistDialog>
          <p className="text-sm text-muted-foreground">
            No credit card required. No sales calls. No nonsense.
            <br />
            <span className="text-xs">
              Just pure, unadulterated form-building joy.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
