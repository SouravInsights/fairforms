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
  title: "FairForms - Because forms should be fair",
  description:
    "A fair form builder for everyone. No sneaky upsells, no predatory pricing, just honest, straightforward forms that work.",
  openGraph: {
    title: "FairForms - Because forms should be fair",
    description:
      "A fair form builder for everyone. No sneaky upsells, no predatory pricing, just honest, straightforward forms that work.",
    url: "https://fairforms.xyz",
    siteName: "FairForms",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "FairForms - A fair form builder for everyone",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FairForms - Because forms should be fair",
    description:
      "A fair form builder for everyone. No sneaky upsells, no predatory pricing, just honest, straightforward forms that work.",
    images: ["/og.png"],
  },
  // Adding basic SEO optimization
  keywords: [
    "form builder",
    "fair pricing",
    "forms",
    "surveys",
    "feedback forms",
    "typeform alternative",
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
