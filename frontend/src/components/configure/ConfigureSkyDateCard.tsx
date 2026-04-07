"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
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

const ConfigureSkyDateCard = forwardRef<
  HTMLDivElement,
  ConfigureSkyDateCardProps
>(function ConfigureSkyDateCard(
  {
    selectedDate,
    onSelectedDateChange,
    loading,
    error,
    onSync,
    thumbnailUrl,
    apod,
    onOpenImagePreview,
  },
  ref,
) {
  return (
    <GlassCard ref={ref} className="shrink-0 space-y-4 p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-sm font-semibold tracking-[0.2em] text-text-primary uppercase">
            01 · Your sky
          </h2>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Choose a date, sync with NASA, then preview your Astronomy Picture
            of the Day.
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
          {loading ? "Syncing..." : "Sync with NASA"}
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
          helperTextOverride="Type your date and press Sync"
          loading={loading}
          className="space-y-4 rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-5 md:px-5 md:py-6"
        />
      </div>

      {error && <p className="mt-3 font-mono text-xs text-red-500">{error}</p>}

      <div className="border-t border-(--border-default) pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-mono text-xs tracking-[0.25em] text-text-tertiary uppercase">
            NASA preview
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
                  Awaiting sync
                </span>
              </div>
            </div>
          )}

          <div className="min-w-0 space-y-2">
            <p className="font-mono text-xs tracking-[0.25em] text-text-tertiary uppercase">
              Image title
            </p>
            <p className="line-clamp-2 text-sm leading-snug font-semibold text-text-primary">
              {apod?.title ?? "Awaiting synced image"}
            </p>

            <p className="mt-2 line-clamp-4 font-mono text-[11px] leading-relaxed text-text-secondary">
              {apod?.explanation ??
                "Once you sync a date, you will see NASA’s official description of the Astronomy Picture of the Day for that moment in time."}
            </p>
          </div>
        </div>

        {thumbnailUrl ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-3 text-center text-sm leading-relaxed text-text-tertiary italic"
          >
            On this day, the light you see traveled millions of years to reach
            Earth — and now it&apos;s yours.
          </motion.p>
        ) : null}
      </div>
    </GlassCard>
  );
});

ConfigureSkyDateCard.displayName = "ConfigureSkyDateCard";

export default ConfigureSkyDateCard;
