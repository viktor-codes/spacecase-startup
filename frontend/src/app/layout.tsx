import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Recursive } from "next/font/google";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
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
        {/* Fixed background for iOS and desktop */}
        <div
          className="fixed inset-0 -z-10 h-[200svh] overflow-hidden pointer-events-none"
          style={{
            WebkitTransform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
        >
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: `
        radial-gradient(
          circle at 20% -10%,
          rgba(77, 48, 255, 0.22),
          transparent 60%
        ),
        radial-gradient(
          circle at 85% 110%,
          rgba(203, 124, 253, 0.18),
          transparent 60%
        )
      `,
              backgroundSize: "cover",
            }}
          />
        </div>
        <div className="relative min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
