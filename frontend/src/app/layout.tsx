import type { Metadata } from "next";
import { Recursive } from "next/font/google";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`${recursive.variable} antialiased`}>
        {/* Фиксированный фон для iOS и десктопа */}
        <div
          className="fixed inset-0 -z-10 h-[120svh] overflow-hidden pointer-events-none"
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
