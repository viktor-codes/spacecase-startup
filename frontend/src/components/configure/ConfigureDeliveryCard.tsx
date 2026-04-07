"use client";

import { GlassCard } from "@/components/ui/glass-card";
import {
  SHIPPING_OPTIONS,
  type ShippingOption,
} from "@/lib/configure/constants";
import { cn } from "@/lib/utils";

export type ConfigureDeliveryCardProps = {
  shipping: ShippingOption;
  onShippingChange: (option: ShippingOption) => void;
  formatEur: (price: number) => string;
};

export default function ConfigureDeliveryCard({
  shipping,
  onShippingChange,
  formatEur,
}: ConfigureDeliveryCardProps) {
  return (
    <GlassCard className="shrink-0 space-y-4 p-5 md:p-6">
      <h2 className="font-mono text-sm font-semibold tracking-[0.2em] text-text-primary uppercase">
        03 · Delivery
      </h2>

      <div className="space-y-3">
        {(
          Object.entries(SHIPPING_OPTIONS) as [
            ShippingOption,
            (typeof SHIPPING_OPTIONS)[ShippingOption],
          ][]
        ).map(([key, option]) => (
          <button
            key={key}
            type="button"
            onClick={() => onShippingChange(key)}
            className={cn(
              "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
              shipping === key
                ? "border-(--border-vivid) bg-brand-pink/10 ring-1 ring-brand-pink/20"
                : "border-(--border-default) hover:border-brand-pink/40",
            )}
          >
            <div
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                shipping === key
                  ? "border-brand-pink bg-brand-pink"
                  : "border-(--border-default)",
              )}
            >
              {shipping === key && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-sm font-semibold text-text-primary">
                  {option.label}
                </p>
                <p className="font-mono text-sm font-semibold text-text-primary">
                  {formatEur(option.price)}
                </p>
              </div>
              <p className="mt-0.5 font-mono text-[11px] text-text-tertiary">
                {option.description}
              </p>
              <p className="font-mono text-[11px] text-text-tertiary">
                {option.delivery}
              </p>
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
