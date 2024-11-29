import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Sparkles,
  HandCoins,
  PiggyBank,
  Laugh,
  Heart,
  ArrowRight,
  GitCommit,
  Terminal,
} from "lucide-react";
import { WaitlistDialog } from "@/app/components/waitlist/WaitlistDialog";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section - Reimagined as a "receipt" style design */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-24">
          {/* Receipt-style hero */}
          <div className="relative bg-card p-8 rounded-lg border border-primary/20">
            {/* Decorative receipt top */}
            <div className="absolute top-0 left-0 w-full h-4 bg-primary/10 rounded-t-lg" />
            <div className="absolute -top-2 left-0 w-full flex justify-around">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-2 h-4 bg-background rounded-b-sm" />
              ))}
            </div>

            <div className="space-y-8 pt-4">
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 animate-pulse">
                  <span className="text-sm bg-primary/10 px-3 py-1 rounded-full">
                    LIVE
                  </span>
                  <span className="text-sm">Early Access Now Open</span>
                </div>

                <div className="relative">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Fair forms for
                    <br />
                    <span className="relative inline-block mt-2">
                      <span className="relative z-10">everyone</span>
                      <div className="absolute bottom-2 left-0 w-full h-4 bg-primary/20 -rotate-2" />
                    </span>
                  </h1>
                </div>

                {/* Receipt items */}
                <div className="max-w-md mx-auto mt-12 space-y-4 font-mono">
                  <div className="flex justify-between items-center p-2 border-b border-dashed">
                    <span>Simple & Transparent</span>
                    <span className="text-primary">✓</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b border-dashed">
                    <span>No Feature Gates</span>
                    <span className="text-primary">✓</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b border-dashed">
                    <span>Community First</span>
                    <span className="text-primary">✓</span>
                  </div>
                  <div className="flex justify-between items-center p-2 font-bold text-lg">
                    <span>Better Forms</span>
                    <span className="text-primary">✓</span>
                  </div>
                </div>

                <div className="pt-8 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <WaitlistDialog>
                      <Button
                        size="lg"
                        className="relative group overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Join the Fair Side
                          <Sparkles className="h-4 w-4 group-hover:animate-spin" />
                        </span>
                        <div className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </Button>
                    </WaitlistDialog>

                    <SignInButton mode="modal">
                      <Button variant="outline" size="lg" className="group">
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </SignInButton>
                  </div>

                  <p className="text-sm">
                    <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                      Join
                      <span className="inline-block font-mono bg-primary/10 px-3 py-1 rounded-full">
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
            </div>
          </div>

          {/* Features Section - Reimagined as a "Comparison Invoice" */}
          <div className="relative bg-card p-8 rounded-lg border border-primary/20">
            {/* Decorative receipt top */}
            <div className="absolute top-0 left-0 w-full h-4 bg-primary/10 rounded-t-lg" />
            <div className="absolute -top-2 left-0 w-full flex justify-around">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-2 h-4 bg-background rounded-b-sm" />
              ))}
            </div>

            <div className="pt-8 space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Why We&apos;re Different</h2>
                <p className="text-sm text-muted-foreground">
                  Four fair reasons
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: HandCoins,
                    title: `Fair Pricing Promise`,
                    description: `No 'Premium' popups, no sneaky upsells, no surprises. Just forms, pure and simple.`,
                  },
                  {
                    icon: PiggyBank,
                    title: "Fair Features",
                    description:
                      "Remember when software was made to help people, not to maximize MRR? Yeah, we're bringing that back.",
                  },
                  {
                    icon: Laugh,
                    title: "Built for Fairness",
                    description:
                      "When other form builders got too greedy, we didn't just complain. We built a fair alternative.",
                  },
                  {
                    icon: Heart,
                    title: "Made with Love (and Caffeine)",
                    description: `Every feature was built after midnight, fueled by coffee and the dream of making forms fair again.`,
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 border-b border-dashed last:border-0 md:even:border-l"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mt-1 shrink-0">
                        <feature.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-bold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Section - Reimagined as Git Commits */}
          <div className="relative bg-card p-8 rounded-lg border border-primary/20">
            <div className="font-mono space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Terminal className="h-5 w-5" />
                <span className="text-sm">development_history.log</span>
              </div>

              {[
                {
                  hash: "8f4e71d",
                  message: "feat: Initial commit after seeing Typeform pricing",
                  detail: "Spilled coffee. Started coding.",
                  time: "3 months ago",
                },
                {
                  hash: "2b9c4a0",
                  message: "refactor: Making forms fair at 3AM",
                  detail: "Coffee-driven development at its finest",
                  time: "2 months ago",
                },
                {
                  hash: "1a3b5c7",
                  message: "fix: Removed unfair pricing logic",
                  detail: "Because forms should be fair",
                  time: "1 month ago",
                },
                {
                  hash: "9d8f7e6",
                  message: "release: Launching early access",
                  detail:
                    "You're looking at it! Join us in making forms fair again.",
                  time: "Just now",
                },
              ].map((commit, index) => (
                <div
                  key={index}
                  className="group relative pl-6 border-l border-primary/20"
                >
                  <div className="absolute left-0 top-2 w-2 h-2 bg-primary/40 rounded-full -translate-x-[4.5px]" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <GitCommit className="h-4 w-4 text-primary/60" />
                      <span className="font-bold text-primary/60">
                        {commit.hash}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {commit.time}
                      </span>
                    </div>
                    <p className="font-semibold">{commit.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {commit.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA - Reimagined as a Final Invoice */}
          <div className="relative bg-card p-8 rounded-lg border border-primary/20">
            <div className="absolute -top-6 -right-6 rotate-12">
              <div className="bg-primary/90 text-white px-8 py-2 rounded-sm transform rotate-45 text-sm font-bold">
                FAIR DEAL
              </div>
            </div>

            <div className="text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Value Report</h2>
                <p className="text-sm text-muted-foreground">
                  What you get with FairForms
                </p>
              </div>

              <div className="max-w-sm mx-auto space-y-4 font-mono">
                <div className="flex justify-between items-center p-2 border-b border-dashed">
                  <span>Form Builder Drama</span>
                  <span className="text-muted-foreground">None</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b border-dashed">
                  <span>Feature Restrictions</span>
                  <span className="text-muted-foreground">Zero</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b border-dashed">
                  <span>Hidden Costs</span>
                  <span className="text-muted-foreground">Nope</span>
                </div>
                <div className="flex justify-between items-center p-2 font-bold">
                  <span>Peace of Mind</span>
                  <span className="text-primary text-xl">✓</span>
                </div>

                <div className="text-sm text-muted-foreground pt-4">
                  More budget for coffee: Always a good thing ☕️
                </div>
              </div>

              <div className="pt-4">
                <WaitlistDialog>
                  <Button size="lg" className="gap-2">
                    Create Your Fair Forms
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </WaitlistDialog>
                <p className="text-xs text-muted-foreground mt-4">
                  No hidden costs. No surprises. Just fair forms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
