"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { PHONE_MODEL_GROUPS } from "@/lib/configure/constants";
import { cn } from "@/lib/utils";

export type ConfigureDeviceCardProps = {
  deviceModel: string;
  onDeviceModelChange: (model: string) => void;
};

export default function ConfigureDeviceCard({
  deviceModel,
  onDeviceModelChange,
}: ConfigureDeviceCardProps) {
  return (
    <GlassCard className="shrink-0 space-y-4 p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-text-primary">
          03 · Device configuration
        </h2>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="device-model"
          className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
        >
          Device Model
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
    </GlassCard>
  );
}
