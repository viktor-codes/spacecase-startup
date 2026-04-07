"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const SpaceDateScanner = dynamic(
  () => import("@/components/SpaceDateScanner"),
  {
    ssr: false,
  },
);

export type ConfigureDateScannerCardProps = {
  selectedDate: string;
  onSelectedDateChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  onSync: () => void | Promise<void>;
};

const ConfigureDateScannerCard = forwardRef<
  HTMLDivElement,
  ConfigureDateScannerCardProps
>(function ConfigureDateScannerCard(
  { selectedDate, onSelectedDateChange, loading, error, onSync },
  ref,
) {
  return (
    <GlassCard ref={ref} className="shrink-0 space-y-4 p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-sm font-semibold tracking-[0.2em] text-text-primary uppercase">
            01 · Date scanner
          </h2>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Input the date you want to freeze in time.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="space"
          className="font-mono text-[11px] tracking-[0.25em] uppercase"
          disabled={loading}
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
    </GlassCard>
  );
});

ConfigureDateScannerCard.displayName = "ConfigureDateScannerCard";

export default ConfigureDateScannerCard;
