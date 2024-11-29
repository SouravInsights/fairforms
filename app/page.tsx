import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Coffee,
  Rocket,
  Sparkles,
  HandCoins,
  PiggyBank,
  Laugh,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WaitlistDialog } from "@/app/components/waitlist/WaitlistDialog";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/10">
      <div className="container mx-auto px-4 py-16 space-y-32">
        {/* Hero Section with Animated Background */}
        <div className="relative">
          {/* Animated shapes in background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-700" />
          </div>

          <div className="space-y-6 text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="animate-bounce inline-flex items-center gap-2 px-4 py-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Early Access Now Open!
            </Badge>

            <h1 className="text-4xl md:text-7xl font-bold leading-tight">
              Because Typeform was{" "}
              <div className="relative inline-block group">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                  expensive
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-primary/80 rounded-full transform origin-left transition-all duration-300 group-hover:scale-x-110" />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="bg-card px-4 py-2 rounded-lg shadow-lg text-sm">
                    like, really expensive 💸
                  </div>
                </div>
              </div>
            </h1>

            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto leading-relaxed">
              A form builder for the rest of us. No venture capital. No growth
              hacking. Just forms that work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <WaitlistDialog>
                <Button
                  size="lg"
                  className="gap-2 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Join Early Access
                    <Sparkles className="h-4 w-4 group-hover:animate-spin" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </Button>
              </WaitlistDialog>

              <SignInButton mode="modal">
                <Button variant="outline" size="lg" className="group">
                  Already In? Welcome Back
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </SignInButton>
            </div>

            <p className="text-md text-muted-foreground mt-8">
              <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                Join
                <span className="inline-block font-semibold text-foreground bg-muted px-3 py-1 rounded-full">
                  142
                </span>
                others in early access
                <span className="inline-block text-xs opacity-70">
                  (the number is fake ofcourse haha)
                </span>
              </span>
            </p>
          </div>
        </div>

        {/* Feature Grid with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Background gradient for features */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl blur-xl" />

          {[
            {
              icon: HandCoins,
              title: `The "No Upsell" Promise`,
              description: `No "Premium" popups every 2 seconds. No "Upgrade to access basic features". Just forms, pure and simple.`,
            },
            {
              icon: PiggyBank,
              title: "Budget-Friendly (Like, Free)",
              description:
                "Remember when software was made to help people, not to maximize MRR? Yeah, we're bringing that back.",
            },
            {
              icon: Laugh,
              title: "Built Out of Spite",
              description:
                "When the Typeform pricing page made me cry, I didn't just complain. I built this. Take that, enterprise pricing!",
            },
            {
              icon: Heart,
              title: "Made with Love (and Caffeine)",
              description: `Every feature was built after midnight, fueled by coffee and the dream of never seeing a "Your free trial has ended" email again.`,
            },
          ].map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 space-y-4 relative border border-primary/10 hover:border-primary/20 transition-colors duration-300">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <feature.icon />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline with Enhanced Visual Elements */}
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-primary/50 via-primary/20 to-primary/50" />

          <div className="space-y-16 relative">
            <h3 className="text-center text-3xl font-semibold mb-12">
              The Story So Far...
            </h3>

            {[
              {
                title: "The Breaking Point",
                content:
                  "Saw Typeform's pricing page. Spilled coffee. Started coding.",
                position: "right",
              },
              {
                title: "The Development",
                content:
                  "3 AM coding sessions. Lots of coffee. Some questionable commit messages.",
                position: "left",
              },
              {
                title: "Early Access Launch",
                content:
                  "You're looking at it! Join us and let's build something awesome together.",
                position: "right",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${
                  item.position === "right"
                    ? "ml-[50%] pl-8"
                    : "mr-[50%] pr-8 text-right"
                } relative group`}
              >
                <div
                  className={`absolute ${
                    item.position === "right"
                      ? "left-0 -translate-x-[9px]"
                      : "right-0 translate-x-[9px]"
                  } top-3 w-4 h-4 rounded-full bg-primary group-hover:scale-125 transition-transform duration-300`}
                />
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <p className="text-muted-foreground">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA with Enhanced Design */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl blur-xl" />
          <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-12 text-center space-y-8 border border-primary/10">
            <div className="inline-block animate-bounce">
              <Coffee className="h-12 w-12 text-primary" />
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold">
                Save Money, Get Forms, Buy Coffee Instead
              </h2>
              <p className="text-lg text-muted-foreground">
                For the price of one month of Typeform, you could buy{" "}
                <span className="font-semibold text-primary">
                  47 cups of coffee
                </span>
                . Join us and keep your coffee budget intact.
              </p>
            </div>

            <WaitlistDialog>
              <Button size="lg" className="gap-2 group">
                Get Early Access
                <Rocket className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </WaitlistDialog>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>No credit card required. No sales calls. No nonsense.</p>
              <p className="text-xs">
                Just pure, unadulterated form-building joy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
