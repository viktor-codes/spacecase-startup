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

export const metadata: Metadata = {
  title: "SpaceCase — The Sky From Your Most Important Date, On Your Phone",
  description:
    "Choose a date that matters. We find NASA's Astronomy Picture of the Day, restore it with AI to 300+ DPI, and print it on a premium dual-layer phone case.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/spacecaselogonew3.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/spacecaselogonew3.svg", type: "image/svg+xml" },
    ],
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
