"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import type { ApodResponse } from "@/lib/api/apodClient";

const SpaceDateScanner = dynamic(
  () => import("@/components/SpaceDateScanner"),
  {
    ssr: false,
  },
);

export type ConfigureSkyDateCardProps = {
  selectedDate: string;
  onSelectedDateChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  onSync: () => void | Promise<void>;
  thumbnailUrl: string | null;
  apod: ApodResponse | null;
  onOpenImagePreview: () => void;
};

export default function ConfigureSkyDateCard({
  selectedDate,
  onSelectedDateChange,
  loading,
  error,
  onSync,
  thumbnailUrl,
  apod,
  onOpenImagePreview,
}: ConfigureSkyDateCardProps) {
  return (
    <GlassCard className="shrink-0 space-y-4 p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-sm font-semibold tracking-[0.2em] text-text-primary uppercase">
            01 · Your sky on that day
          </h2>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Choose a meaningful date. We&apos;ll load NASA&apos;s official
            Astronomy Picture of the Day for a live preview on your case.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="space"
          className="font-mono text-[11px] tracking-[0.25em] uppercase"
          disabled={loading}
          data-testid="configure-sync-nasa"
          onClick={() => void onSync()}
        >
          {loading ? "Loading image…" : "Load NASA image"}
        </Button>
      </div>

      <div className="mt-4">
        <SpaceDateScanner
          value={selectedDate}
          onChange={onSelectedDateChange}
          showSlider={false}
          showPrimaryButton={false}
          size="compact"
          helperVariant="minimal"
          helperTextOverride="Enter a date, then tap Load NASA image"
          loading={loading}
          className="space-y-4 rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-5 md:px-5 md:py-6"
        />
      </div>

      {error && <p className="mt-3 font-mono text-xs text-red-500">{error}</p>}

      <div className="border-t border-(--border-default) pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-mono text-xs tracking-[0.25em] text-text-tertiary uppercase">
            Preview
          </p>
          {selectedDate ? (
            <p className="font-mono text-[11px] tracking-[0.2em] text-text-secondary uppercase">
              {selectedDate}
            </p>
          ) : null}
        </div>

        <div className="flex gap-4">
          {thumbnailUrl ? (
            <button
              type="button"
              onClick={onOpenImagePreview}
              className="relative h-24 w-24 shrink-0 cursor-zoom-in overflow-hidden rounded-xl border border-(--border-default) bg-surface-raised/60 focus-visible:ring-2 focus-visible:ring-brand-pink/50 focus-visible:outline-none"
              aria-label="Open full-size image preview"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={thumbnailUrl}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailUrl}
                    alt={apod?.title ?? "NASA APOD"}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </button>
          ) : loading ? (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-(--border-default) bg-surface-raised/60">
              <div className="h-full w-full animate-pulse bg-linear-to-br from-white/10 via-white/5 to-transparent" />
            </div>
          ) : (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-(--border-default) bg-surface-raised/60">
              <div className="flex h-full w-full items-center justify-center bg-surface-raised/60">
                <span className="px-2 text-center font-mono text-[10px] tracking-[0.25em] text-text-tertiary uppercase">
                  Load image to preview
                </span>
              </div>
            </div>
          )}

          <div className="flex min-h-46 min-w-0 flex-col space-y-2 overflow-hidden">
            <p className="shrink-0 font-mono text-xs tracking-[0.25em] text-text-tertiary uppercase">
              Image title
            </p>
            <p className="line-clamp-2 shrink-0 text-sm leading-snug font-semibold text-text-primary">
              {apod?.title ?? "Your preview appears here"}
            </p>

            <p className="line-clamp-4 min-h-0 flex-1 font-mono text-[11px] leading-relaxed text-text-secondary">
              {apod?.explanation ??
                "Once you load an image, you will see NASA's short description of that day's picture."}
            </p>
          </div>
        </div>

        <div className="mt-3 min-h-17">
          {thumbnailUrl ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center text-sm leading-relaxed text-text-tertiary italic"
            >
              On this day, the light you see traveled millions of years to reach
              Earth — and now it&apos;s yours.
            </motion.p>
          ) : (
            <p
              className="invisible text-center text-sm leading-relaxed italic"
              aria-hidden
            >
              On this day, the light you see traveled millions of years to reach
              Earth — and now it&apos;s yours.
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
