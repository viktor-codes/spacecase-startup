"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PHONE_MODEL_GROUPS } from "@/lib/configure/constants";
import { cn } from "@/lib/utils";

export type ConfigureDeviceCardProps = {
  deviceModel: string;
  onDeviceModelChange: (model: string) => void;
  onContinue: () => void;
};

export default function ConfigureDeviceCard({
  deviceModel,
  onDeviceModelChange,
  onContinue,
}: ConfigureDeviceCardProps) {
  return (
    <GlassCard className="shrink-0 space-y-4 p-5 md:p-6">
      <div className="space-y-1">
        <h2 className="font-mono text-sm font-semibold tracking-[0.2em] text-text-primary uppercase">
          02 · Your iPhone
        </h2>
        <p className="font-mono text-xs text-text-secondary">
          We print for your exact model so the artwork lines up with edges and
          camera cutouts.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="device-model"
          className="font-mono text-xs tracking-[0.25em] text-text-secondary uppercase"
        >
          iPhone model
        </label>
        <div
          className={cn(
            "relative mt-1 flex items-center justify-between rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-3 text-sm text-text-primary",
            "focus-within:border-(--border-vivid) focus-within:ring-1 focus-within:ring-brand-pink/30",
          )}
        >
          <select
            id="device-model"
            value={deviceModel}
            onChange={(event) => onDeviceModelChange(event.target.value)}
            className="w-full appearance-none border-none bg-transparent font-mono text-sm text-text-primary outline-none"
          >
            {PHONE_MODEL_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.models.map((model) => (
                  <option
                    key={model}
                    value={model}
                    className="bg-surface-overlay text-text-primary"
                  >
                    {model}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <span className="pointer-events-none ml-3 font-mono text-xs text-text-tertiary">
            ▼
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="space"
        size="lg"
        className="mt-2 w-full font-mono text-xs tracking-[0.25em] uppercase"
        data-testid="configure-device-continue"
        onClick={onContinue}
      >
        Continue
      </Button>
    </GlassCard>
  );
}
