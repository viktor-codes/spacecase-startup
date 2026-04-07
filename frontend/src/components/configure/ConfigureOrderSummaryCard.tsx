"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  SHIPPING_OPTIONS,
  type ShippingOption,
} from "@/lib/configure/constants";

export type ConfigureOrderSummaryCardProps = {
  deviceModel: string;
  selectedDate: string;
  shipping: ShippingOption;
  formattedPrice: string;
  isCheckoutFormValid: boolean;
  completionStep: number;
  isSubmitting: boolean;
  onLaunch: () => void;
};

export default function ConfigureOrderSummaryCard({
  deviceModel,
  selectedDate,
  shipping,
  formattedPrice,
  isCheckoutFormValid,
  completionStep,
  isSubmitting,
  onLaunch,
}: ConfigureOrderSummaryCardProps) {
  return (
    <GlassCard className="shrink-0 space-y-4 p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-mono text-xs tracking-[0.25em] text-text-secondary uppercase">
            06 · Order summary
          </p>
          <p className="font-mono text-sm text-text-primary">
            {deviceModel || "Select your device"}
          </p>
          {selectedDate && (
            <p className="font-mono text-[11px] text-text-secondary">
              Date synced: {selectedDate}
            </p>
          )}
          <p className="font-mono text-[11px] text-text-secondary">
            Shipping: {SHIPPING_OPTIONS[shipping].label}
          </p>
        </div>

        <div className="text-right">
          <p className="font-mono text-xs tracking-[0.25em] text-text-secondary uppercase">
            Total
          </p>
          <p className="text-2xl font-semibold text-text-primary">
            {formattedPrice}
          </p>
        </div>
      </div>

      <div className="space-y-1.5 border-t border-(--border-default) pt-3">
        <p className="font-mono text-[10px] tracking-[0.2em] text-text-tertiary uppercase">
          What&apos;s included
        </p>
        {[
          "NASA APOD image for your exact date",
          "AI reconstruction to 300+ DPI",
          "Dual-layer Tough case (PC + TPU)",
          "Full-wrap edge-to-edge print",
          "Fade-resistant UV ink",
          SHIPPING_OPTIONS[shipping].label,
        ].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <Check className="h-3 w-3 shrink-0 text-brand" />
            <span className="font-mono text-[11px] text-text-secondary">
              {item}
            </span>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="space"
        size="lg"
        className="mt-3 w-full font-mono text-xs tracking-[0.25em] uppercase"
        disabled={!isCheckoutFormValid || isSubmitting}
        onClick={() => void onLaunch()}
      >
        {isSubmitting ? "Redirecting to payment..." : "Launch My CosmicCase"}
      </Button>
      <p className="font-mono text-[10px] tracking-[0.2em] text-text-tertiary uppercase">
        {isCheckoutFormValid
          ? "Ready to launch"
          : `Complete ${completionStep}/4 steps to continue`}
      </p>
    </GlassCard>
  );
}
