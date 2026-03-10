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
  title: "SpaceCase",
  description: "NASA imagery on custom merchandise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`${recursive.variable} antialiased`}>
        <div className="relative min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
