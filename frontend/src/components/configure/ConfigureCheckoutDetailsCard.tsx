"use client";

import { useFormContext } from "react-hook-form";

import { GlassCard } from "@/components/ui/glass-card";
import type { ConfigureContactFormValues } from "@/lib/schemas/configure-contact-form";

const inputClassName =
  "w-full rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-3 font-mono text-sm text-text-primary outline-none focus:border-(--border-vivid) focus:ring-1 focus:ring-brand-pink/30";

export type ConfigureCheckoutDetailsCardProps = {
  submitError: string | null;
};

export default function ConfigureCheckoutDetailsCard({
  submitError,
}: ConfigureCheckoutDetailsCardProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<ConfigureContactFormValues>();

  const email = watch("email");
  const eirCode = watch("eirCode");

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
              className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
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
              className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
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
            className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary"
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
            <p className="font-mono text-xs text-red-500">{errors.line1.message}</p>
          )}
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
            {...register("line2")}
            className={inputClassName}
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
              {...register("city")}
              className={inputClassName}
              autoComplete="address-level2"
            />
            {errors.city && (
              <p className="font-mono text-xs text-red-500">{errors.city.message}</p>
            )}
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
    </GlassCard>
  );
}
