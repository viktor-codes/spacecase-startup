import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Recursive } from "next/font/google";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppBackground from "@/components/AppBackground";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

const recursive = Recursive({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-recursive",
  axes: ["MONO", "CASL"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const defaultTitle =
  "SpaceCase — The Sky From Your Most Important Date, On Your Phone";
const defaultDescription =
  "Choose a date that matters. We find NASA's Astronomy Picture of the Day, restore it with AI to 300+ DPI, and print it on a premium dual-layer phone case.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/spacecaselogonew3.svg", type: "image/svg+xml" }],
    apple: [{ url: "/spacecaselogonew3.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "/",
    siteName: "SpaceCase",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/spacecaselogonew3.svg",
        width: 1200,
        height: 630,
        alt: "SpaceCase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${recursive.variable} ${plusJakartaSans.variable}`}
    >
      <body className="antialiased">
        <AppBackground />
        <div className="relative min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
