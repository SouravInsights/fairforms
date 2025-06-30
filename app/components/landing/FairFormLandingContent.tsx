/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Timer, Wand2, Zap } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { SignInButton } from "@clerk/nextjs";
import { WaitlistDialog } from "../waitlist/WaitlistDialog";

export default function FairFormsLanding() {
  const [prompt, setPrompt] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const examplePrompts = [
    "Create a product feedback form that gets honest responses",
    "Build a job application that attracts top talent",
    "Design a customer survey people actually enjoy taking",
    "Make a lead capture form that converts visitors",
    "Generate an event registration with zero dropoffs",
    "Create a user research form that sparks conversations",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % examplePrompts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Generating: "${prompt}"`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">FairForms</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="lg"
                  className="group w-full sm:w-auto"
                >
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </SignInButton>

              <div className="hidden sm:block">
                <WaitlistDialog>
                  <Button size="lg" className="group">
                    <span className="flex items-center gap-2">
                      Join Early Access
                      <Sparkles className="h-4 w-4 group-hover:animate-spin" />
                    </span>
                  </Button>
                </WaitlistDialog>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div
            style={{
              width: "60%",
              maxWidth: "960px",
              height: "100%",
              backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
              backgroundPosition: "center",
              WebkitMaskImage: `
                linear-gradient(to bottom, black 0%, black 50%, transparent 100%),
                linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)
              `,
              maskImage: `
                linear-gradient(to bottom, black 0%, black 50%, transparent 100%),
                linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)
              `,
              WebkitMaskComposite: "destination-in",
              maskComposite: "intersect",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Timer className="h-4 w-4 mr-2" />
              Most forms are boring. Yours doesn't have to be.
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Stop losing responses to{" "}
              <span className="bg-gradient-to-r from-primary to-primary-gradient-end bg-clip-text text-transparent">
                boring forms
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI-powered forms that people actually want to fill out. Better
              copy, smarter questions, higher completion rates.
            </p>

            {/* Main CTA */}
            <div className="relative mb-12">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute -top-4 -left-4 h-32 w-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl rotate-12 blur-sm" />
                <div className="absolute -bottom-6 -right-6 h-40 w-40 bg-gradient-to-tl from-primary/8 to-primary/3 rounded-3xl -rotate-12 blur-sm" />
              </div>

              <div className="relative bg-background/80 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm font-medium text-primary">
                      AI-Powered
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    What form do you want to build?
                  </h2>
                  <p className="text-muted-foreground">
                    Describe your form and watch AI create something that
                    converts ✨
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mb-8">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Create a product survey form..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="text-lg py-6 pr-12 border-primary/20 focus:border-primary/40 bg-background/50"
                      onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Wand2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    size="lg"
                    className="w-full md:w-auto mt-3 md:mt-0 px-8 py-6 bg-gradient-to-r from-primary to-primary-gradient-end hover:from-primary/90 hover:to-primary-gradient-end/90 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Generating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Generate <Zap className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>

                {/* Marquee */}
                <div className="relative">
                  <p className="text-sm text-muted-foreground mb-3 text-center">
                    💡 Popular examples:
                  </p>
                  <Marquee speed={10} speedFactor={1} direction={1}>
                    {examplePrompts.concat(examplePrompts).map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setPrompt(example)}
                        className="flex-shrink-0 px-6 py-3 bg-background/80 border border-border rounded-full text-sm font-medium hover:border-primary hover:bg-primary/5 hover:text-primary transition-all whitespace-nowrap shadow-sm hover:shadow-md"
                      >
                        {example}
                      </button>
                    ))}
                  </Marquee>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to create forms that convert?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the early access and start building forms that people
              actually want to fill out.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WaitlistDialog>
                <Button size="lg" className="px-8 py-4 text-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Early Access
                </Button>
              </WaitlistDialog>
              <a
                href="https://www.fairforms.xyz/forms/fullstack-dev-assessment"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  See Live Example
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto mt-32 pb-8 px-4">
        <div className="relative group">
          {/* Top decorative wave */}
          <div className="absolute -top-8 left-0 w-full">
            <svg
              viewBox="0 0 100 10"
              className="w-full h-8 fill-background"
              preserveAspectRatio="none"
            >
              <path d="M0 10 C 15 0, 35 10, 50 10 C 65 10, 85 0, 100 10 L 100 0 L 0 0 Z" />
            </svg>
          </div>

          <div className="relative bg-card/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6 md:p-12 group hover:border-primary/20 transition-all duration-500">
            {/* Subtle blue hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-lg sm:opacity-0 opacity-20 sm:group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex flex-col md:flex-row items-center md:items-center justify-between flex-wrap gap-6">
              {/* FairForms Logo */}

              <div className="hidden md:flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">FairForms</span>
              </div>

              <div className="flex items-center gap-4 flex-wrap justify-center">
                {/* Animated coffee */}
                <div className="relative group/coffee cursor-pointer">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center transform sm:group-hover/coffee:scale-110 transition-transform duration-300">
                    <span className="text-xl">☕️</span>
                    <span className="absolute -top-3 -right-2 opacity-0 sm:group-hover/coffee:opacity-100 transition-opacity duration-300">
                      💭
                    </span>
                    {/* Steam */}
                    <div className="absolute -top-4 left-1/2 sm:opacity-0 opacity-30 sm:group-hover/coffee:opacity-100 transition-opacity duration-300">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1.5 h-6 bottom-0"
                          style={{
                            left: `${(i - 1) * 6}px`,
                            transform: "translateX(-50%)",
                            animation: "steam 2s infinite",
                            animationDelay: `${i * 0.3}s`,
                          }}
                        >
                          <div className="w-full h-full bg-gradient-to-t from-primary/20 to-transparent rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-xl hidden sm:block sm:group-hover/coffee:animate-ping bg-primary/5" />
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Crafted by</p>
                  <a
                    href="https://souravinsights.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center group/link"
                  >
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 sm:group-hover/link:from-primary/70 sm:group-hover/link:to-primary transition-all duration-300">
                      SouravInsights
                    </span>
                    <div className="absolute -top-1 -right-1 sm:opacity-0 opacity-30 sm:group-hover/link:opacity-100 transition-all duration-300 flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <span
                          key={i}
                          className="text-xs"
                          style={{
                            animation: "sparkle 1.5s infinite",
                            animationDelay: `${i * 0.2}s`,
                          }}
                        >
                          ✨
                        </span>
                      ))}
                    </div>
                  </a>
                </div>

                {/* QR animated block */}
                <div className="relative group/qr">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 bg-card rounded-lg p-2 grid grid-cols-4 gap-1 transform sm:group-hover/qr:rotate-3 transition-transform duration-300">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm transition-all duration-300 ${
                          Math.random() > 0.5
                            ? "bg-primary/20"
                            : "bg-transparent"
                        }`}
                        style={{ transitionDelay: `${i * 30}ms` }}
                      />
                    ))}
                  </div>
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/10 to-primary/0 h-full sm:translate-y-full sm:group-hover/qr:translate-y-0 transition-transform duration-1000"
                    style={{ animation: "scan 2s linear infinite" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
