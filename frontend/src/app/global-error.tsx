"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

import "./globals.css";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#020207] font-sans text-text-primary antialiased">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-20 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-white/70">
            We couldn&apos;t render this page. Try again or return home.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-2xl border border-white/10 bg-white px-5 py-2 text-sm font-semibold text-[#020207]"
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
