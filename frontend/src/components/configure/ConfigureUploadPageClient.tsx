"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";

import Container from "@/components/Container";
import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchApod, type ApodResponse } from "@/lib/api/apodClient";

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

export default function ConfigureUploadPageClient({
  initialDate,
}: ConfigureUploadPageClientProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate ?? "");
  const [apod, setApod] = useState<ApodResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceModel, setDeviceModel] = useState<string>(PHONE_MODELS[0] ?? "");
  const [shipping, setShipping] = useState<ShippingOption>("standard");

  const hasImage = apod && apod.media_type === "image" && apod.url;

  const euroFormatter = useMemo(
    () =>
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }),
    [],
  );

  const totalPrice = SHIPPING_OPTIONS[shipping].price;
  const formattedPrice = euroFormatter.format(totalPrice);

  useEffect(() => {
    if (!initialDate) return;
    void handleSync(initialDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDate]);

  const handleSync = async (explicitDate?: string) => {
    const dateToUse = explicitDate ?? selectedDate;
    if (!dateToUse) {
      setError(
        "Please select a date to sync your NASA image.",
      );
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
    } catch (e) {
      setError(
        "Failed to fetch NASA APOD data. Please try again later.",
      );

      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // TODO: cart integration
    console.log("Add to cart", {
      date: selectedDate,
      deviceModel,
      shipping,
      totalPrice,
      apod,
    });
  };

  return (
    <div className="grain-dark min-h-[calc(100vh-56px)] py-10">
      <Container className="h-full">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)] lg:gap-12">
          {/* Left scene: title + phone, sticky on screen */}
          <div className="flex flex-col gap-10 lg:sticky lg:top-20 lg:h-[calc(100vh-120px)]">
            <div className="max-w-xl">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Configure Your SpaceCase
              </h1>
            </div>

            <div className="relative flex flex-1 max-w-sm items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={hasImage ? (apod as ApodResponse).url : "placeholder"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex w-full max-w-sm items-center justify-center md:max-w-md"
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
          <div className="flex flex-col gap-6 pb-8">
            {/* Module 1: Date scanner */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
                    01 · Date scanner
                  </h2>
                  <p className="mt-1 font-mono text-xs text-slate-600">
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
                  className="space-y-4 rounded-xl border border-slate-200 bg-white px-4 py-5 md:px-5 md:py-6"
                />
              </div>

              {error && (
                <p className="mt-3 font-mono text-xs text-red-500">{error}</p>
              )}
            </section>

            {/* Module 2: Image preview + metadata */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
                  02 · Cosmic frame
                </h2>
                {selectedDate && (
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-600">
                    {selectedDate}
                  </p>
                )}
              </div>

              <div className="mt-2 flex gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={
                        hasImage
                          ? (apod as ApodResponse).url
                          : "thumb-placeholder"
                      }
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full"
                    >
                      {hasImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={(apod as ApodResponse).url}
                          alt={(apod as ApodResponse).title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100">
                          <span className="px-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                            NASA preview
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="min-w-0 space-y-2">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                    Image title
                  </p>
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
                    {apod?.title ?? "Awaiting synced image"}
                  </p>

                  <p className="mt-2 line-clamp-4 font-mono text-[11px] leading-relaxed text-slate-600">
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
                  className="mt-3 text-center text-sm italic leading-relaxed text-slate-500"
                >
                  On this day, the light you see traveled millions of years to
                  reach Earth — and now it&apos;s yours.
                </motion.p>
              )}
            </section>

            {/* Module 3: Device configuration */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
                  03 · Device configuration
                </h2>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="device-model"
                  className="font-mono text-xs uppercase tracking-[0.25em] text-slate-600"
                >
                  Device Model
                </label>
                <div
                  className={cn(
                    "relative mt-1 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900",
                    "focus-within:border-slate-900/40 focus-within:ring-1 focus-within:ring-slate-900/30",
                  )}
                >
                  <select
                    id="device-model"
                    value={deviceModel}
                    onChange={(event) => setDeviceModel(event.target.value)}
                    className="w-full appearance-none border-none bg-transparent font-mono text-sm text-slate-900 outline-none"
                  >
                    {PHONE_MODELS.map((model) => (
                      <option
                        key={model}
                        value={model}
                        className="bg-white text-slate-900"
                      >
                        {model}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none ml-3 font-mono text-xs text-slate-500">
                    ▼
                  </span>
                </div>
              </div>
            </section>

            {/* Module 4: Delivery options */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
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
                        ? "border-brand bg-brand/5 ring-1 ring-brand/20"
                        : "border-slate-200 hover:border-slate-300",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                        shipping === key
                          ? "border-brand bg-brand"
                          : "border-slate-300",
                      )}
                    >
                      {shipping === key && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="font-mono text-sm font-semibold text-slate-900">
                          {option.label}
                        </p>
                        <p className="font-mono text-sm font-semibold text-slate-900">
                          {euroFormatter.format(option.price)}
                        </p>
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                        {option.description}
                      </p>
                      <p className="font-mono text-[11px] text-slate-500">
                        {option.delivery}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Module 5: Order summary */}
            <section className="sticky bottom-4 mt-auto space-y-4 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-600">
                    05 · Order summary
                  </p>
                  <p className="font-mono text-sm text-slate-900">
                    {deviceModel || "Select your device"}
                  </p>
                  {selectedDate && (
                    <p className="font-mono text-[11px] text-slate-600">
                      Date synced: {selectedDate}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-600">
                    Total
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {formattedPrice}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
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
                  <div
                    key={item}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-3 w-3 shrink-0 text-brand" />
                    <span className="font-mono text-[11px] text-slate-600">
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
                disabled={!deviceModel}
                onClick={handleAddToCart}
              >
                Launch My SpaceCase
              </Button>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
