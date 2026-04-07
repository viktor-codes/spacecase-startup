"use client";

import { AnimatePresence, motion } from "framer-motion";

import { GlassCard } from "@/components/ui/glass-card";
import type { ApodResponse } from "@/lib/api/apodClient";

export type ConfigureCosmicFrameCardProps = {
  selectedDate: string;
  loading: boolean;
  /** NASA APOD image URL after a successful sync; null before sync or if not an image */
  thumbnailUrl: string | null;
  apod: ApodResponse | null;
  onOpenImagePreview: () => void;
};

export default function ConfigureCosmicFrameCard({
  selectedDate,
  loading,
  thumbnailUrl,
  apod,
  onOpenImagePreview,
}: ConfigureCosmicFrameCardProps) {
  return (
    <GlassCard className="shrink-0 space-y-4 p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm font-semibold tracking-[0.2em] text-text-primary uppercase">
          02 · Cosmic frame
        </h2>
        {selectedDate && (
          <p className="font-mono text-[11px] tracking-[0.2em] text-text-secondary uppercase">
            {selectedDate}
          </p>
        )}
      </div>

      <div className="mt-2 flex gap-4">
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
            <div className="h-full w-full animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          </div>
        ) : (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-(--border-default) bg-surface-raised/60">
            <div className="flex h-full w-full items-center justify-center bg-surface-raised/60">
              <span className="px-2 text-center font-mono text-[10px] tracking-[0.25em] text-text-tertiary uppercase">
                NASA preview
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

      {thumbnailUrl && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-3 text-center text-sm leading-relaxed text-text-tertiary italic"
        >
          On this day, the light you see traveled millions of years to reach
          Earth — and now it&apos;s yours.
        </motion.p>
      )}
    </GlassCard>
  );
}
