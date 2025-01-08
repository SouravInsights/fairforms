import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        steam: {
          "0%, 100%": {
            transform: "translateY(0) scale(1)",
            opacity: "0",
          },
          "50%": {
            transform: "translateY(-10px) scale(1.5)",
            opacity: "1",
          },
        },
        sparkle: {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.5) rotate(45deg)",
            opacity: "0.7",
          },
        },
        scan: {
          "0%": {
            transform: "translateY(-100%)",
          },
          "100%": {
            transform: "translateY(100%)",
          },
        },
        gradient: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        typing: {
          "0%": {
            color: "hsl(var(--primary))",
          },
          "50%": {
            color: "hsl(var(--muted-foreground))",
          },
          "100%": {
            color: "hsl(var(--primary))",
          },
        },
        blink: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0",
          },
        },
      },
      animation: {
        steam: "steam 2s ease-out infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
        scan: "scan 2s linear infinite",
        gradient: "gradient 3s ease infinite",
        typing: "typing 1.5s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [animatePlugin],
  safelist: [
    // Light Themes
    "bg-[#F5F3FF]",
    "text-[#27272A]",
    "text-[#4C1D95]",
    "bg-white",
    "border-[#EDE9FE]",
    "bg-[#F5F3FF]",
    "hover:bg-[#EDE9FE]",

    "bg-[#F0F9FF]",
    "text-[#27272A]",
    "text-[#0C4A6E]",
    "bg-white",
    "border-[#E0F2FE]",
    "bg-[#F0F9FF]",
    "hover:bg-[#E0F2FE]",

    // Neon/Dark Themes
    "bg-[#1A202C]",
    "text-[#E2E8F0]",
    "text-[#F472B6]",
    "bg-[#10151B]",
    "border-[#10151B]",
    "bg-[#1A202C]",
    "hover:bg-[#10151B]",

    // Dark Themes
    "bg-[#2D1B69]",
    "text-[#E2E8F0]",
    "text-[#F8FAFC]",
    "bg-[#1E1B4B]",
    "border-[#1E1B4B]",
    "bg-[#2D1B69]",
    "hover:bg-[#1E1B4B]",

    "bg-[#27141E]",
    "text-[#E2E8F0]",
    "text-[#F9FAFB]",
    "bg-[#1A0F15]",
    "border-[#1A0F15]",
    "bg-[#27141E]",
    "hover:bg-[#1A0F15]",
  ],
};
export default config;
