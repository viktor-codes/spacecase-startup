"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";

import Container from "@/components/Container";
import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { fetchApod, type ApodResponse } from "@/lib/api/apodClient";
import {
  createStripeCheckoutSession,
  type CreateStripeCheckoutSessionPayload,
} from "@/lib/api/ordersClient";

type ConfigureUploadPageClientProps = {
  initialDate?: string;
};

const SpaceDateScanner = dynamic(
  () => import("@/components/SpaceDateScanner"),
  {
    ssr: false,
  },
);

type ShippingOption = "standard" | "express";

const SHIPPING_OPTIONS: Record<
  ShippingOption,
  { label: string; price: number; description: string; delivery: string }
> = {
  standard: {
    label: "Standard Delivery",
    price: 39,
    description: "Tracked postal service",
    delivery: "7–12 business days",
  },
  express: {
    label: "Priority Galactic Launch",
    price: 49,
    description: "DHL/DPD tracked courier · Priority processing",
    delivery: "2–4 business days",
  },
};

const PHONE_MODELS: string[] = [
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15 Plus",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14 Pro",
  "iPhone 14 Plus",
  "iPhone 14",
  "iPhone 13 Pro Max",
  "iPhone 13 Pro",
  "iPhone 13 mini",
  "iPhone 13",
  "iPhone 12 Pro Max",
  "iPhone 12 Pro",
  "iPhone 12 mini",
  "iPhone 12",
  "iPhone 11 Pro Max",
  "iPhone 11 Pro",
  "iPhone 11",
  "iPhone SE (3rd gen)",
  "iPhone SE (2nd gen)",
  "Samsung Galaxy S24 Ultra",
  "Samsung Galaxy S24+",
  "Samsung Galaxy S24",
  "Samsung Galaxy S23 Ultra",
  "Samsung Galaxy S23+",
  "Samsung Galaxy S23",
  "Samsung Galaxy S22 Ultra",
  "Samsung Galaxy S22+",
  "Samsung Galaxy S22",
  "Samsung Galaxy S21 Ultra",
  "Samsung Galaxy S21+",
  "Samsung Galaxy S21",
  "Google Pixel 9 Pro",
  "Google Pixel 9",
  "Google Pixel 8 Pro",
  "Google Pixel 8",
  "Google Pixel 7 Pro",
  "Google Pixel 7",
  "Google Pixel 6 Pro",
  "Google Pixel 6",
  "Nothing Phone (2a)",
  "Nothing Phone (2)",
  "Nothing Phone (1)",
  "OnePlus 12",
  "OnePlus 11",
  "OnePlus 10 Pro",
  "Huawei P60 Pro",
  "Huawei P50 Pro",
  "Xiaomi 14 Pro",
  "Xiaomi 14",
  "Xiaomi 13 Pro",
  "Xiaomi 13",
  "Sony Xperia 1 V",
  "Sony Xperia 5 V",
  "Sony Xperia 10 V",
];

const PHONE_MODEL_GROUPS: { label: string; models: string[] }[] = [
  {
    label: "Apple iPhone",
    models: PHONE_MODELS.filter((model) => model.startsWith("iPhone")),
  },
  {
    label: "Samsung Galaxy",
    models: PHONE_MODELS.filter((model) => model.startsWith("Samsung")),
  },
  {
    label: "Google Pixel",
    models: PHONE_MODELS.filter((model) => model.startsWith("Google")),
  },
  {
    label: "Nothing",
    models: PHONE_MODELS.filter((model) => model.startsWith("Nothing")),
  },
  {
    label: "OnePlus",
    models: PHONE_MODELS.filter((model) => model.startsWith("OnePlus")),
  },
  {
    label: "Huawei",
    models: PHONE_MODELS.filter((model) => model.startsWith("Huawei")),
  },
  {
    label: "Xiaomi",
    models: PHONE_MODELS.filter((model) => model.startsWith("Xiaomi")),
  },
  {
    label: "Sony Xperia",
    models: PHONE_MODELS.filter((model) => model.startsWith("Sony")),
  },
];

export default function ConfigureUploadPageClient({
  initialDate,
}: ConfigureUploadPageClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate ?? "");
  const [apod, setApod] = useState<ApodResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [syncHighlight, setSyncHighlight] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const hasImage = apod && apod.media_type === "image" && apod.url;
  const isEmailValid = useMemo(() => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const isShippingValid = useMemo(() => {
    return shipping === "standard" || shipping === "express";
  }, [shipping]);

  const isEirCodeValid = useMemo(() => {
    if (!eirCode.trim()) return false;
    return /^[AC-FHKNPRTV-Y]\d{2}\s?[AC-FHKNPRTV-Y0-9]{4}$/i.test(
      eirCode.trim(),
    );
  }, [eirCode]);

  const isCheckoutFormValid = useMemo(() => {
    return (
      Boolean(selectedDate) &&
      Boolean(hasImage) &&
      Boolean(deviceModel) &&
      isShippingValid &&
      isEmailValid &&
      isEirCodeValid &&
      fullName.trim().length >= 2 &&
      phone.trim().length >= 5 &&
      line1.trim().length >= 2 &&
      city.trim().length >= 2
    );
  }, [
    selectedDate,
    hasImage,
    deviceModel,
    isShippingValid,
    isEmailValid,
    isEirCodeValid,
    fullName,
    phone,
    line1,
    city,
  ]);

  const completionStep = useMemo(() => {
    let completed = 0;
    if (selectedDate) completed += 1;
    if (hasImage) completed += 1;
    if (deviceModel) completed += 1;
    if (fullName.trim().length >= 2 && isEmailValid && isEirCodeValid) completed += 1;
    return completed;
  }, [selectedDate, hasImage, deviceModel, fullName, isEmailValid, isEirCodeValid]);

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

  useEffect(() => {
    if (!initialDate) return;
    void handleSync(initialDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDate]);

  useEffect(() => {
    if (!isImagePreviewOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImagePreviewOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isImagePreviewOpen]);

  useEffect(() => {
    if (!hasImage) {
      setIsImagePreviewOpen(false);
    }
  }, [hasImage]);

  const handleSync = async (explicitDate?: string) => {
    const dateToUse = explicitDate ?? selectedDate;
    if (!dateToUse) {
      setError("Please select a date to sync your NASA image.");
      return;
    }

    setLoading(true);
    setError(null);
    setApod(null);

    try {
      const data = await fetchApod(dateToUse);

      if (data.media_type !== "image" || !data.url) {
        setError(
          "No image available for this date in NASA APOD. Please try another date.",
        );
        return;
      }

      setApod(data);
      setSyncHighlight(true);
      setTimeout(() => setSyncHighlight(false), 900);
      requestAnimationFrame(() => {
        module2Ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch (e) {
      setError("Failed to fetch NASA APOD data. Please try again later.");

      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Left scene: title + phone, sticky on screen */}
          <div className="flex flex-col gap-10 lg:sticky lg:top-24 lg:self-start">
            <div className="max-w-xl">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Configure Your SpaceCase
              </h1>
            </div>

            <div
              className={cn(
                "relative flex max-w-[280px] items-center justify-center md:max-w-sm",
                syncHighlight && "animate-pulse",
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={hasImage ? (apod as ApodResponse).url : "placeholder"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex w-full items-center justify-center"
                >
                  <Phone
                    imgSrc={hasImage ? (apod as ApodResponse).url : null}
                    dark
                    placeholderText="Your sky is waiting..."
                    className="shadow-[0_40px_80px_rgba(0,0,0,0.65)] rounded-[3.5rem]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right column: vertical module stack */}
          <div className="flex flex-col gap-6 pb-8 lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2">
            {/* Module 1: Date scanner */}
            <GlassCard ref={module2Ref} className="shrink-0 space-y-4 p-5 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-text-primary">
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
                  className="font-mono text-[11px] uppercase tracking-[0.25em]"
                  disabled={loading}
                  onClick={() => void handleSync()}
                >
                  {loading ? "Syncing..." : "Sync with NASA"}
                </Button>
              </div>

              <div className="mt-4">
                <SpaceDateScanner
                  value={selectedDate}
                  onChange={setSelectedDate}
                  showSlider={false}
                  showPrimaryButton={false}
                  size="compact"
                  helperVariant="minimal"
                  helperTextOverride="Type your date and press Sync"
                  loading={loading}
                  className="space-y-4 rounded-xl border border-(--border-default) bg-surface-raised/50 px-4 py-5 md:px-5 md:py-6"
                />
              </div>

              {error && (
                <p className="mt-3 font-mono text-xs text-red-500">{error}</p>
              )}
            </GlassCard>

            {/* Module 2: Image preview + metadata */}
            <GlassCard className="shrink-0 space-y-4 p-5 md:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-text-primary">
                  02 · Cosmic frame
                </h2>
                {selectedDate && (
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                    {selectedDate}
                  </p>
                )}
              </div>

              <div className="mt-2 flex gap-4">
                {hasImage ? (
                  <button
                    type="button"
                    onClick={() => setIsImagePreviewOpen(true)}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-(--border-default) bg-surface-raised/60 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/50"
                    aria-label="Open full-size image preview"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={(apod as ApodResponse).url}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={(apod as ApodResponse).url}
                          alt={(apod as ApodResponse).title}
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
                      <span className="px-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                        NASA preview
                      </span>
                    </div>
                  </div>
                )}

                <div className="min-w-0 space-y-2">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-tertiary">
                    Image title
                  </p>
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary">
                    {apod?.title ?? "Awaiting synced image"}
                  </p>

                  <p className="mt-2 line-clamp-4 font-mono text-[11px] leading-relaxed text-text-secondary">
                    {apod?.explanation ??
                      "Once you sync a date, you will see NASA’s official description of the Astronomy Picture of the Day for that moment in time."}
                  </p>
                </div>
              </div>

              {hasImage && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-3 text-center text-sm italic leading-relaxed text-text-tertiary"
                >
                  On this day, the light you see traveled millions of years to
                  reach Earth — and now it&apos;s yours.
                </motion.p>
              )}
            </GlassCard>

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
                  : "Launch My SpaceCase"}
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
