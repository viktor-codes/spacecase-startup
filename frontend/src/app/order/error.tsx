"use client";

import Link from "next/link";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";

type OrderSegmentErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function OrderSegmentError({
  error,
  reset,
}: OrderSegmentErrorProps) {
  return (
    <div className="grain-dark min-h-[calc(100vh-56px)] py-10">
      <Container>
        <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Could not load your order
          </h1>
          <p className="text-sm text-slate-600">
            Something went wrong while fetching order details. You can try again
            or return home.
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="font-mono text-xs text-red-600 break-all">
              {error.message}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="button" variant="space" size="sm" onClick={reset}>
              Try again
            </Button>
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
