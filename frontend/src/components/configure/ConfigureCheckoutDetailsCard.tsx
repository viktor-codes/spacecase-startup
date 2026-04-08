"use client";

import { useCallback } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import type { ConfigureContactFormValues } from "@/lib/schemas/configure-contact-form";

const inputClassName =
  "w-full rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-3 font-mono text-sm text-text-primary outline-none focus:border-(--border-vivid) focus:ring-1 focus:ring-brand-pink/30";

export type ConfigureCheckoutDetailsCardProps = {
  submitError: string | null;
  onContinue: () => void | Promise<void>;
};

export default function ConfigureCheckoutDetailsCard({
  submitError,
  onContinue,
}: ConfigureCheckoutDetailsCardProps) {
  const {
    register,
    formState: { errors },
    watch,
    trigger,
  } = useFormContext<ConfigureContactFormValues>();

  const email = watch("email");
  const eirCode = watch("eirCode");

  const handleContinue = useCallback(async () => {
    const ok = await trigger();
    if (ok) await onContinue();
  }, [onContinue, trigger]);

  return (
    <GlassCard className="shrink-0 space-y-4 p-5 md:p-6">
      <div className="space-y-1">
        <h2 className="font-mono text-sm font-semibold tracking-[0.2em] text-text-primary uppercase">
          04 · Contact &amp; shipping
        </h2>
        <p className="font-mono text-xs text-text-secondary">
          No account needed. We&apos;ll email your order confirmation and
          tracking to the address below.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="font-mono text-xs tracking-[0.25em] text-text-secondary uppercase"
          >
            Full name
          </label>
          <input
            id="fullName"
            {...register("fullName")}
            className={inputClassName}
            autoComplete="name"
          />
          {errors.fullName && (
            <p className="font-mono text-xs text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="font-mono text-xs tracking-[0.25em] text-text-secondary uppercase"
            >
              Email
            </label>
            <input
              id="email"
              {...register("email")}
              className={inputClassName}
              autoComplete="email"
              inputMode="email"
            />
            {errors.email && email.trim().length > 0 && (
              <p className="font-mono text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="font-mono text-xs tracking-[0.25em] text-text-secondary uppercase"
            >
              Phone
            </label>
            <input
              id="phone"
              {...register("phone")}
              className={inputClassName}
              autoComplete="tel"
              inputMode="tel"
            />
            {errors.phone && (
              <p className="font-mono text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="line1"
            className="font-mono text-xs tracking-[0.25em] text-text-secondary uppercase"
          >
            Address line 1
          </label>
          <input
            id="line1"
            {...register("line1")}
            className={inputClassName}
            autoComplete="address-line1"
          />
          {errors.line1 && (
            <p className="font-mono text-xs text-red-500">
              {errors.line1.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="line2"
            className="font-mono text-xs tracking-[0.25em] text-text-secondary uppercase"
          >
            Address line 2 (optional)
          </label>
          <input
            id="line2"
            {...register("line2")}
            className={inputClassName}
            autoComplete="address-line2"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="city"
              className="font-mono text-xs tracking-[0.25em] text-text-secondary uppercase"
            >
              City
            </label>
            <input
              id="city"
              {...register("city")}
              className={inputClassName}
              autoComplete="address-level2"
            />
            {errors.city && (
              <p className="font-mono text-xs text-red-500">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="eirCode"
              className="font-mono text-xs tracking-[0.25em] text-text-secondary uppercase"
            >
              Eircode
            </label>
            <input
              id="eirCode"
              {...register("eirCode")}
              className={inputClassName}
              autoComplete="postal-code"
            />
            {errors.eirCode && eirCode.trim().length > 0 && (
              <p className="font-mono text-xs text-red-500">
                {errors.eirCode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {submitError && (
        <p className="mt-1 font-mono text-xs text-red-500">{submitError}</p>
      )}

      <Button
        type="button"
        variant="space"
        size="lg"
        className="mt-2 w-full font-mono text-xs tracking-[0.25em] uppercase"
        data-testid="configure-details-continue"
        onClick={() => void handleContinue()}
      >
        Continue
      </Button>
    </GlassCard>
  );
}
