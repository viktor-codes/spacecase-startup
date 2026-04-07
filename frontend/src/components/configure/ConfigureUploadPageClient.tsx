"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

import Container from "@/components/Container";
import ConfigureCosmicFrameCard from "@/components/configure/ConfigureCosmicFrameCard";
import ConfigureDateScannerCard from "@/components/configure/ConfigureDateScannerCard";
import ConfigureUploadHeroColumn from "@/components/configure/ConfigureUploadHeroColumn";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import type { ApodResponse } from "@/lib/api/apodClient";
import {
  createStripeCheckoutSession,
  type CreateStripeCheckoutSessionPayload,
} from "@/lib/api/ordersClient";
import {
  PHONE_MODEL_GROUPS,
  PHONE_MODELS,
  SHIPPING_OPTIONS,
  type ShippingOption,
} from "@/lib/configure/constants";
import {
  getConfigureCompletionStep,
  isConfigureCheckoutComplete,
  isValidEirCode,
  isValidEmail,
} from "@/lib/configure/checkout-validation";
import { useImagePreviewModal } from "@/hooks/useImagePreviewModal";
import { useSyncedApod } from "@/hooks/useSyncedApod";

type ConfigureUploadPageClientProps = {
  initialDate?: string;
};

export default function ConfigureUploadPageClient({
  initialDate,
}: ConfigureUploadPageClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deviceModel, setDeviceModel] = useState<string>(PHONE_MODELS[0] ?? "");
  const [shipping, setShipping] = useState<ShippingOption>("standard");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [eirCode, setEirCode] = useState("");
  const module2Ref = useRef<HTMLDivElement | null>(null);

  const {
    selectedDate,
    setSelectedDate,
    apod,
    loading,
    error,
    syncHighlight,
    hasImage,
    handleSync,
  } = useSyncedApod({ initialDate, scrollAfterSyncRef: module2Ref });

  const { isImagePreviewOpen, setIsImagePreviewOpen } = useImagePreviewModal(
    Boolean(hasImage),
  );

  const isEmailValid = useMemo(() => isValidEmail(email), [email]);

  const isEirCodeValid = useMemo(() => isValidEirCode(eirCode), [eirCode]);

  const isCheckoutFormValid = useMemo(
    () =>
      isConfigureCheckoutComplete({
        selectedDate,
        hasImage: Boolean(hasImage),
        deviceModel,
        shipping,
        email,
        fullName,
        phone,
        line1,
        city,
        eirCode,
      }),
    [
      selectedDate,
      hasImage,
      deviceModel,
      shipping,
      email,
      fullName,
      phone,
      line1,
      city,
      eirCode,
    ],
  );

  const completionStep = useMemo(
    () =>
      getConfigureCompletionStep({
        selectedDate,
        hasImage: Boolean(hasImage),
        deviceModel,
        fullName,
        email,
        eirCode,
      }),
    [selectedDate, hasImage, deviceModel, fullName, email, eirCode],
  );

  const totalPrice = SHIPPING_OPTIONS[shipping].price;
  const formatEur = useMemo(() => {
    if (!isMounted) return (price: number) => `€${price}`;
    const formatter = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    });
    return (price: number) => formatter.format(price);
  }, [isMounted]);

  const formattedPrice = formatEur(totalPrice);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLaunch = async () => {
    if (!isCheckoutFormValid) return;
    if (!hasImage) {
      setSubmitError(
        "NASA image for this date is not available. Please try another date.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: CreateStripeCheckoutSessionPayload = {
      apodDate: selectedDate,
      deviceModel,
      shippingOption: shipping,
      contact: {
        email,
        fullName,
        phone,
      },
      shippingAddress: {
        line1,
        line2: line2.trim() ? line2 : null,
        city,
        eirCode,
      },
    };

    try {
      const { checkoutUrl } = await createStripeCheckoutSession(payload);
      window.location.href = checkoutUrl;
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Failed to start payment. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Container className="h-full">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)] lg:gap-12 lg:items-start">
          <ConfigureUploadHeroColumn
            syncHighlight={syncHighlight}
            phoneImageUrl={
              typeof hasImage === "string" ? hasImage : null
            }
          />

          {/* Right column: vertical module stack */}
          <div className="flex flex-col gap-6 pb-8 lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2">
            <ConfigureDateScannerCard
              ref={module2Ref}
              selectedDate={selectedDate}
              onSelectedDateChange={setSelectedDate}
              loading={loading}
              error={error}
              onSync={() => void handleSync()}
            />

            <ConfigureCosmicFrameCard
              selectedDate={selectedDate}
              loading={loading}
              thumbnailUrl={
                typeof hasImage === "string" ? hasImage : null
              }
              apod={apod}
              onOpenImagePreview={() => setIsImagePreviewOpen(true)}
            />

            {/* Module 3: Device configuration */}
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
                    onChange={(event) => setDeviceModel(event.target.value)}
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

            {/* Module 4: Delivery options */}
            <GlassCard className="shrink-0 space-y-4 p-5 md:p-6">
              <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-text-primary">
                04 · Delivery
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
                    onClick={() => setShipping(key)}
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

            {/* Module 5: Your details */}
            {hasImage && (
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
                      onChange={(e) => setFullName(e.target.value)}
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
                        onChange={(e) => setEmail(e.target.value)}
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
                        onChange={(e) => setPhone(e.target.value)}
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
                      onChange={(e) => setLine1(e.target.value)}
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
                      onChange={(e) => setLine2(e.target.value)}
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
                        onChange={(e) => setCity(e.target.value)}
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
                        onChange={(e) => setEirCode(e.target.value)}
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
                  <p className="mt-1 font-mono text-xs text-red-500">
                    {submitError}
                  </p>
                )}
              </GlassCard>
            )}

            {/* Module 6: Order summary */}
            <GlassCard className="shrink-0 space-y-4 p-5 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
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
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
                    Total
                  </p>
                  <p className="text-2xl font-semibold text-text-primary">
                    {formattedPrice}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-(--border-default) pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
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
                className="mt-3 w-full font-mono text-xs uppercase tracking-[0.25em]"
                disabled={!isCheckoutFormValid || isSubmitting}
                onClick={() => void handleLaunch()}
              >
                {isSubmitting
                  ? "Redirecting to payment..."
                  : "Launch My CosmicCase"}
              </Button>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                {isCheckoutFormValid
                  ? "Ready to launch"
                  : `Complete ${completionStep}/4 steps to continue`}
              </p>
            </GlassCard>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {isImagePreviewOpen && hasImage && (
          <motion.div
            className="fixed inset-0 z-(--z-overlay) flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImagePreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsImagePreviewOpen(false)}
                className="absolute -top-10 right-0 text-text-secondary hover:text-text-primary text-sm font-mono uppercase tracking-[0.2em]"
                aria-label="Close image preview"
              >
                Close
              </button>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-(--border-default) bg-surface-overlay">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={(apod as ApodResponse).url}
                  alt={(apod as ApodResponse).title}
                  className="h-full w-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
