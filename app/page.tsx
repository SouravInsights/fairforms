/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { WaitlistDialog } from "@/app/components/waitlist/WaitlistDialog";
import {
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Palette,
  Users,
  Coins,
  Terminal,
  BarChart2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 md:px-6">
        {/* Hero Section - Terminal Theme */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-card border border-primary/20 rounded-lg overflow-hidden">
            <div className="bg-primary/10 p-2 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                fairforms ~ main
              </div>
            </div>

            <div className="p-8 md:p-12 font-mono">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Terminal className="h-4 w-4" />
                <span className="text-sm typing-animation">
                  initializing fairforms...
                </span>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm">$ type fairforms</p>
                  <h1 className="text-4xl md:text-6xl font-bold text-primary typing-animation">
                    Forms that work for everyone.
                  </h1>
                </div>

                <div className="space-y-2">
                  <p className="text-sm">$ cat features.md</p>
                  <div className="text-lg text-muted-foreground typing-animation-delay">
                    Advanced builder • Team collaboration • Token gating • Rich
                    analytics • Beautiful themes • Rewards system
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <WaitlistDialog>
                    <Button size="lg" className="group">
                      <span className="flex items-center gap-2">
                        Join Beta
                        <Sparkles className="h-4 w-4 group-hover:animate-spin" />
                      </span>
                    </Button>
                  </WaitlistDialog>

                  <SignInButton mode="modal">
                    <Button variant="outline" size="lg" className="group">
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Interactive Code Editor Theme */}
        <div className="max-w-6xl mx-auto mt-32">
          <div className="text-center mb-12">
            <div className="font-mono text-sm text-primary mb-2">
              $ cat features.md
            </div>
            <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
            <p className="text-muted-foreground">
              Powerful features that respect both your users and your workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileSpreadsheet,
                title: "Advanced Form Builder",
                description:
                  "Drag-and-drop form builder with real-time preview, rich question types, and custom themes.",
                code: [
                  "# Form Structure",
                  "├── Welcome Screen",
                  "├── Question Types",
                  "│   ├── Short/Long Text",
                  "│   ├── Contact Fields",
                  "│   ├── File Upload",
                  "│   └── Choice Fields",
                  "└── End Screen",
                  "",
                  "🎨 Live Preview Active",
                ],
                output: "14 question types available",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Invite team members with role-based access control and email invitations.",
                code: [
                  "# Team Access",
                  "├── Roles",
                  "│   ├── Editor ✏️",
                  "│   └── Viewer 👀",
                  "└── Status",
                  "    ├── Pending",
                  "    └── Active",
                  "",
                  "📧 Instant Email Invites",
                ],
                output: "team@company.com added as Editor",
              },
              {
                icon: FileSpreadsheet,
                title: "Template Gallery",
                description:
                  "Jumpstart your forms with ready-made templates or share your own designs with the community.",
                code: [
                  "# Template Library",
                  "├── Categories",
                  "│   └── Browse by type",
                  "├── Visibility",
                  "│   ├── Public 🌐",
                  "│   └── Private 🔒",
                  "└── Actions",
                  "    ├── Preview",
                  "    ├── Clone",
                  "    └── Save as Template",
                  "",
                  "📋 Quick-start enabled",
                ],
                output: "10+ templates available",
              },
              {
                icon: Coins,
                title: "Web3 Integration",
                description:
                  "Gate your forms with tokens and reward participants for submissions.",
                code: [
                  "# Web3 Features",
                  "├── Token Gating",
                  "│   ├── NFT Access 🎫",
                  "│   └── Min Balance Check",
                  "└── Rewards System",
                  "    ├── Auto-distribute 💰",
                  "    └── Multiple Chains",
                  "",
                  "🔗 Wallet Connected",
                ],
                output: "Form gated & rewards enabled",
              },
              {
                icon: Palette,
                title: "Beautiful Themes",
                description:
                  "Beautiful themes for forms and delightful color schemes for public pages.",
                code: [
                  "# Design Options",
                  "├── Form Themes",
                  "│   ├── Light Mode",
                  "│   │   ├── Rose Gold 🌸",
                  "│   │   └── Ocean Breeze 🌊",
                  "│   └── Dark Mode",
                  "│       ├── Midnight 🌙",
                  "│       └── Cherry Noir 🍷",
                  "└── Public Pages",
                  "    └── Color Schemes",
                  "",
                  "🎨 Live preview",
                ],
                output: "Theme changed: Midnight",
              },
              {
                icon: BarChart2,
                title: "Rich Response Analytics",
                description:
                  "Analyze responses with real-time insights, starring, and team collaboration features.",
                code: [
                  "# Response Dashboard",
                  "├── Views",
                  "│   ├── Table View 📋",
                  "│   └── Analytics 📊",
                  "├── Features",
                  "│   ├── Star Responses ⭐️",
                  "│   ├── Filter & Sort",
                  "│   └── Demographics",
                  "└── Insights",
                  "    └── Data Visualization",
                  "",
                  "📱 Mobile optimized",
                ],
                output: "145 responses analyzed",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-card border border-primary/20 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg flex flex-col"
              >
                {/* Header */}
                <div className="bg-primary/10 p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <feature.icon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium">
                      {feature.title}.js
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors" />
                    <div className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors" />
                    <div className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors" />
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-4 md:p-12 flex-1">
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {feature.description}
                  </p>

                  {/* Code Area */}
                  <div className="bg-primary/5 rounded-lg p-4 font-mono text-xs space-y-1">
                    {feature.code.map((line, i) => (
                      <div key={i} className="group/line flex">
                        <span className="text-muted-foreground w-6 select-none group-hover/line:text-primary/60">
                          {i + 1}
                        </span>
                        <span className="text-primary/80">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output Bar */}
                <div className="border-t border-primary/10 p-3 bg-primary/5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-mono">{feature.output}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Command Palette Style CTA */}
        <div className="max-w-6xl mx-auto mt-32">
          <div className="bg-card border border-primary/20 rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-primary/10 p-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="text-sm font-mono">Get Started</span>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Build better forms today</h2>
                <p className="text-muted-foreground">
                  Join the early access and start creating
                </p>
              </div>

              <div className="max-w-xl mx-auto bg-primary/5 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2 text-primary font-mono">
                  <span>→</span>
                  <span className="typing-animation">
                    fairforms.join("early-access")
                  </span>
                </div>

                {/* Early Access Button */}
                <div className="pt-4 text-center">
                  <WaitlistDialog>
                    <Button size="lg" className="group font-mono">
                      Get Early Access
                      <Terminal className="ml-2 h-4 w-4 group-hover:text-primary transition-colors" />
                    </Button>
                  </WaitlistDialog>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="max-w-6xl mx-auto mt-32 pb-8">
          <div className="relative group">
            {/* Top decorative edge */}
            <div className="absolute -top-8 left-0 w-full">
              <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent h-16" />
              <svg
                viewBox="0 0 100 10"
                className="w-full h-8 fill-background"
                preserveAspectRatio="none"
              >
                <path d="M0 10 C 15 0, 35 10, 50 10 C 65 10, 85 0, 100 10 L 100 0 L 0 0 Z" />
              </svg>
            </div>

            {/* Main content */}
            <div className="relative bg-card/50 backdrop-blur-sm border border-primary/10 rounded-lg p-8 md:p-12 group hover:border-primary/20 transition-all duration-500">
              {/* Background gradient - Mobile subtle persistent, Desktop on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-lg sm:opacity-0 opacity-20 sm:group-hover:opacity-100 transition-opacity duration-500 animate-gradient" />

              {/* Receipt header */}
              <div className="text-xs font-mono flex items-center justify-between mb-6 opacity-70">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary/50 animate-pulse" />
                  <span className="sm:group-hover:animate-typing">
                    SIGNATURE.LOG
                  </span>
                </div>
                <span className="sm:group-hover:animate-pulse">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              {/* Main signature section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Animated coffee cup */}
                  <div className="relative group/coffee cursor-pointer">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center transform sm:group-hover/coffee:scale-110 transition-transform duration-300">
                      <span className="text-xl">☕️</span>
                      {/* Thought bubble - Desktop: hover, Mobile: active/focus */}
                      <span className="absolute -top-3 -right-2 opacity-0 sm:group-hover/coffee:opacity-100 active:opacity-100 focus:opacity-100 transition-opacity duration-300">
                        💭
                      </span>
                      {/* Steam animation */}
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
                    {/* Coffee ripple effect - Desktop only */}
                    <div className="absolute inset-0 rounded-xl hidden sm:block sm:group-hover/coffee:animate-ping bg-primary/5" />
                  </div>

                  {/* Creator info */}
                  <div>
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
                      {/* Sparkles - Mobile subtle, Desktop on hover */}
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
                </div>

                {/* Decorative QR section */}
                <div className="relative group/qr">
                  <div className="h-16 w-16 bg-card rounded-lg p-2 grid grid-cols-4 gap-1 transform sm:group-hover/qr:rotate-3 transition-transform duration-300">
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
                  {/* Scan line effect - Mobile subtle, Desktop on hover */}
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/10 to-primary/0 h-full sm:translate-y-full sm:group-hover/qr:translate-y-0 transition-transform duration-1000"
                    style={{ animation: "scan 2s linear infinite" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
