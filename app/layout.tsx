import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FairForms – Beautiful, High-Converting Forms",
  description:
    "Stop losing responses to boring forms. FairForms helps you create AI-powered forms that people actually want to fill out, boosting completion rates and capturing better data effortlessly.",
  openGraph: {
    title: "FairForms – Beautiful, High-Converting Forms",
    description:
      "Stop losing responses to boring forms. FairForms helps you create AI-powered forms that people actually want to fill out, boosting completion rates and capturing better data effortlessly.",
    url: "https://fairforms.xyz",
    siteName: "FairForms",
    images: [
      {
        url: "/og-img.jpg",
        width: 1200,
        height: 630,
        alt: "FairForms – Beautiful, High-Converting Forms",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FairForms – Beautiful, High-Converting Forms",
    description:
      "Stop losing responses to boring forms. FairForms helps you create AI-powered forms that people actually want to fill out, boosting completion rates and capturing better data effortlessly.",
    images: ["/og-img.jpg"],
  },
  keywords: [
    "form builder",
    "AI forms",
    "high-conversion forms",
    "surveys",
    "feedback forms",
    "typeform alternative",
    "lead capture",
    "customer research forms",
  ],
  authors: [{ name: "SouravInsights" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <main>
            {children}
            <Toaster />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
