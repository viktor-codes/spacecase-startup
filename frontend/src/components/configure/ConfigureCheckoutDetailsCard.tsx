"use client";

import { GlassCard } from "@/components/ui/glass-card";

export type ConfigureCheckoutDetailsCardProps = {
  fullName: string;
  onFullNameChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  line1: string;
  onLine1Change: (value: string) => void;
  line2: string;
  onLine2Change: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  eirCode: string;
  onEirCodeChange: (value: string) => void;
  isEmailValid: boolean;
  isEirCodeValid: boolean;
  submitError: string | null;
};

export default function ConfigureCheckoutDetailsCard({
  fullName,
  onFullNameChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  line1,
  onLine1Change,
  line2,
  onLine2Change,
  city,
  onCityChange,
  eirCode,
  onEirCodeChange,
  isEmailValid,
  isEirCodeValid,
  submitError,
}: ConfigureCheckoutDetailsCardProps) {
  return (
    <GlassCard className="shrink-0 space-y-4 p-5 md:p-6">
      <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-text-primary">
        05 · Your details
      </h2>

      <div className="space-y-3">
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
          >
            Full name
          </label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            className="w-full rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-3 font-mono text-sm text-text-primary outline-none focus:border-(--border-vivid) focus:ring-1 focus:ring-brand-pink/30"
            autoComplete="name"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
            >
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-3 font-mono text-sm text-text-primary outline-none focus:border-(--border-vivid) focus:ring-1 focus:ring-brand-pink/30"
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
            >
              Phone
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="w-full rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-3 font-mono text-sm text-text-primary outline-none focus:border-(--border-vivid) focus:ring-1 focus:ring-brand-pink/30"
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="line1"
            className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
          >
            Address line 1
          </label>
          <input
            id="line1"
            value={line1}
            onChange={(e) => onLine1Change(e.target.value)}
            className="w-full rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-3 font-mono text-sm text-text-primary outline-none focus:border-(--border-vivid) focus:ring-1 focus:ring-brand-pink/30"
            autoComplete="address-line1"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="line2"
            className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
          >
            Address line 2 (optional)
          </label>
          <input
            id="line2"
            value={line2}
            onChange={(e) => onLine2Change(e.target.value)}
            className="w-full rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-3 font-mono text-sm text-text-primary outline-none focus:border-(--border-vivid) focus:ring-1 focus:ring-brand-pink/30"
            autoComplete="address-line2"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="city"
              className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
            >
              City
            </label>
            <input
              id="city"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-3 font-mono text-sm text-text-primary outline-none focus:border-(--border-vivid) focus:ring-1 focus:ring-brand-pink/30"
              autoComplete="address-level2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="eirCode"
              className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
            >
              Eircode
            </label>
            <input
              id="eirCode"
              value={eirCode}
              onChange={(e) => onEirCodeChange(e.target.value)}
              className="w-full rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-3 font-mono text-sm text-text-primary outline-none focus:border-(--border-vivid) focus:ring-1 focus:ring-brand-pink/30"
              autoComplete="postal-code"
            />
          </div>
        </div>

        {!isEmailValid && email.trim().length > 0 && (
          <p className="font-mono text-xs text-red-500">
            Please enter a valid email address.
          </p>
        )}
        {!isEirCodeValid && eirCode.trim().length > 0 && (
          <p className="font-mono text-xs text-red-500">
            Enter a valid Eircode (e.g. A65 F4E2).
          </p>
        )}
      </div>

      {submitError && (
        <p className="mt-1 font-mono text-xs text-red-500">{submitError}</p>
      )}
    </GlassCard>
  );
}
