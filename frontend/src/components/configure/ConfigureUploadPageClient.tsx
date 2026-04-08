"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LayoutGroup, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import Container from "@/components/Container";
import SectionHeading from "@/components/landing/SectionHeading";
import ConfigureApodImagePreviewModal from "@/components/configure/ConfigureApodImagePreviewModal";
import ConfigureCheckoutDetailsCard from "@/components/configure/ConfigureCheckoutDetailsCard";
import ConfigureDeliveryCard from "@/components/configure/ConfigureDeliveryCard";
import ConfigureDeviceCard from "@/components/configure/ConfigureDeviceCard";
import ConfigureOrderSummaryCard from "@/components/configure/ConfigureOrderSummaryCard";
import ConfigureCardsCarousel, {
  type ConfigureCarouselSlide,
} from "@/components/configure/configure-cards-carousel";
import ConfigureProgress from "@/components/configure/configure-progress";
import ConfigureRevealPanel from "@/components/configure/configure-reveal-panel";
import ConfigureSkyDateCard from "@/components/configure/ConfigureSkyDateCard";
import ConfigureUploadHeroColumn from "@/components/configure/ConfigureUploadHeroColumn";
import {
  createStripeCheckoutSession,
  type CreateStripeCheckoutSessionPayload,
} from "@/lib/api/ordersClient";
import {
  PHONE_MODELS,
  SHIPPING_OPTIONS,
  type ShippingOption,
} from "@/lib/configure/constants";
import {
  getConfigureCompletionStep,
  isValidShippingOption,
} from "@/lib/configure/checkout-validation";
import {
  CONFIGURE_PROGRESS_LABELS,
  CONFIGURE_STEP_INDEX,
  getSequentialConfigureProgressFlags,
  isStepIndexVisible,
} from "@/lib/configure/configure-steps";
import {
  configureContactFormSchema,
  type ConfigureContactFormValues,
} from "@/lib/schemas/configure-contact-form";
import { useImagePreviewModal } from "@/hooks/useImagePreviewModal";
import { useMinWidthLg } from "@/hooks/use-min-width-lg";
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
  /** Monotonic: unlocks the next card; only increases. */
  const [maxRevealedStepIndex, setMaxRevealedStepIndex] = useState<number>(
    CONFIGURE_STEP_INDEX.SKY,
  );
  const [mobileCarouselStepIndex, setMobileCarouselStepIndex] =
    useState<number>(CONFIGURE_STEP_INDEX.SKY);
  const isLg = useMinWidthLg();
  const heroColumnRef = useRef<HTMLDivElement | null>(null);
  const desktopCardsColumnRef = useRef<HTMLDivElement | null>(null);
  const prevDesktopSlideCountRef = useRef<number | null>(null);
  const [heroColumnHeightPx, setHeroColumnHeightPx] = useState<number | null>(
    null,
  );

  const form = useForm<ConfigureContactFormValues>({
    resolver: zodResolver(configureContactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      eirCode: "",
    },
    mode: "onChange",
  });

  const contactValues = form.watch();

  const {
    selectedDate,
    setSelectedDate,
    apod,
    loading,
    error,
    syncHighlight,
    apodImageUrl,
    handleSync,
  } = useSyncedApod({ initialDate });

  const { isImagePreviewOpen, setIsImagePreviewOpen } = useImagePreviewModal(
    apodImageUrl !== null,
  );

  const isCheckoutFormValid = useMemo(() => {
    const parsed = configureContactFormSchema.safeParse(contactValues);
    if (!parsed.success) return false;
    return (
      Boolean(selectedDate) &&
      apodImageUrl !== null &&
      Boolean(deviceModel) &&
      isValidShippingOption(shipping)
    );
  }, [selectedDate, apodImageUrl, deviceModel, shipping, contactValues]);

  const completionStep = useMemo(
    () =>
      getConfigureCompletionStep({
        selectedDate,
        hasImage: apodImageUrl !== null,
        deviceModel,
        fullName: contactValues.fullName,
        email: contactValues.email,
        eirCode: contactValues.eirCode,
      }),
    [
      selectedDate,
      apodImageUrl,
      deviceModel,
      contactValues.fullName,
      contactValues.email,
      contactValues.eirCode,
    ],
  );

  const orderSummaryStatusCaption = useMemo(() => {
    if (isCheckoutFormValid) {
      return "Next: Stripe’s secure checkout — cards and digital wallets.";
    }
    if (completionStep < 4) {
      const left = 4 - completionStep;
      return `${left} quick setup step${left === 1 ? "" : "s"} left above.`;
    }
    return "Add your phone number and full shipping address to continue.";
  }, [isCheckoutFormValid, completionStep]);

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

  const skyDone = useMemo(
    () => Boolean(selectedDate.trim()) && apodImageUrl !== null,
    [selectedDate, apodImageUrl],
  );

  useEffect(() => {
    if (skyDone) {
      setMaxRevealedStepIndex((prev) =>
        Math.max(prev, CONFIGURE_STEP_INDEX.DEVICE),
      );
    }
  }, [skyDone]);

  const advancePastDevice = useCallback(() => {
    setMaxRevealedStepIndex((prev) =>
      Math.max(prev, CONFIGURE_STEP_INDEX.DELIVERY),
    );
  }, []);

  const advancePastDelivery = useCallback(() => {
    setMaxRevealedStepIndex((prev) =>
      Math.max(prev, CONFIGURE_STEP_INDEX.DETAILS),
    );
  }, []);

  const advancePastDetails = useCallback(() => {
    setMaxRevealedStepIndex((prev) =>
      Math.max(prev, CONFIGURE_STEP_INDEX.SUMMARY),
    );
  }, []);

  const stepCompleteFlags = useMemo(
    () =>
      getSequentialConfigureProgressFlags({
        skyDone,
        maxRevealedStepIndex,
        isCheckoutFormValid: isCheckoutFormValid,
      }),
    [skyDone, maxRevealedStepIndex, isCheckoutFormValid],
  );

  /** Desktop rail: ring on the current (first incomplete) step; mobile uses carousel index instead. */
  const desktopActiveStepIndex = useMemo(() => {
    for (let i = 0; i < stepCompleteFlags.length; i++) {
      if (!stepCompleteFlags[i]) return i;
    }
    return Math.max(0, stepCompleteFlags.length - 1);
  }, [stepCompleteFlags]);

  const handleLaunch = useCallback(async () => {
    if (!isCheckoutFormValid) return;
    if (apodImageUrl === null) {
      setSubmitError(
        "We couldn’t load an image for that date. Try another day.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const v = form.getValues();

    const payload: CreateStripeCheckoutSessionPayload = {
      apodDate: selectedDate,
      deviceModel,
      shippingOption: shipping,
      contact: {
        email: v.email,
        fullName: v.fullName,
        phone: v.phone,
      },
      shippingAddress: {
        line1: v.line1,
        line2: v.line2.trim() ? v.line2 : null,
        city: v.city,
        eirCode: v.eirCode,
      },
    };

    try {
      const { checkoutUrl } = await createStripeCheckoutSession(payload);
      window.location.href = checkoutUrl;
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Couldn’t start checkout. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    apodImageUrl,
    deviceModel,
    form,
    isCheckoutFormValid,
    selectedDate,
    shipping,
  ]);

  const configureSlides = useMemo((): ConfigureCarouselSlide[] => {
    const slides: ConfigureCarouselSlide[] = [];

    if (isStepIndexVisible(CONFIGURE_STEP_INDEX.SKY, maxRevealedStepIndex)) {
      slides.push({
        stepIndex: CONFIGURE_STEP_INDEX.SKY,
        content: (
          <ConfigureSkyDateCard
            selectedDate={selectedDate}
            onSelectedDateChange={setSelectedDate}
            loading={loading}
            error={error}
            onSync={() => void handleSync()}
            thumbnailUrl={apodImageUrl}
            apod={apod}
            onOpenImagePreview={() => setIsImagePreviewOpen(true)}
          />
        ),
      });
    }

    if (isStepIndexVisible(CONFIGURE_STEP_INDEX.DEVICE, maxRevealedStepIndex)) {
      slides.push({
        stepIndex: CONFIGURE_STEP_INDEX.DEVICE,
        content: (
          <ConfigureDeviceCard
            deviceModel={deviceModel}
            onDeviceModelChange={setDeviceModel}
            onContinue={advancePastDevice}
          />
        ),
      });
    }

    if (
      isStepIndexVisible(CONFIGURE_STEP_INDEX.DELIVERY, maxRevealedStepIndex)
    ) {
      slides.push({
        stepIndex: CONFIGURE_STEP_INDEX.DELIVERY,
        content: (
          <ConfigureDeliveryCard
            shipping={shipping}
            onShippingChange={setShipping}
            formatEur={formatEur}
            onContinue={advancePastDelivery}
          />
        ),
      });
    }

    if (
      isStepIndexVisible(CONFIGURE_STEP_INDEX.DETAILS, maxRevealedStepIndex)
    ) {
      slides.push({
        stepIndex: CONFIGURE_STEP_INDEX.DETAILS,
        content: (
          <ConfigureRevealPanel>
            <ConfigureCheckoutDetailsCard
              submitError={submitError}
              onContinue={advancePastDetails}
            />
          </ConfigureRevealPanel>
        ),
      });
    }

    if (
      isStepIndexVisible(CONFIGURE_STEP_INDEX.SUMMARY, maxRevealedStepIndex)
    ) {
      slides.push({
        stepIndex: CONFIGURE_STEP_INDEX.SUMMARY,
        content: (
          <ConfigureRevealPanel>
            <ConfigureOrderSummaryCard
              deviceModel={deviceModel}
              selectedDate={selectedDate}
              shipping={shipping}
              formattedPrice={formattedPrice}
              isCheckoutFormValid={isCheckoutFormValid}
              statusCaption={orderSummaryStatusCaption}
              isSubmitting={isSubmitting}
              onLaunch={() => void handleLaunch()}
            />
          </ConfigureRevealPanel>
        ),
      });
    }

    return slides;
  }, [
    maxRevealedStepIndex,
    selectedDate,
    setSelectedDate,
    loading,
    error,
    handleSync,
    apodImageUrl,
    apod,
    setIsImagePreviewOpen,
    deviceModel,
    shipping,
    formatEur,
    submitError,
    formattedPrice,
    isCheckoutFormValid,
    orderSummaryStatusCaption,
    isSubmitting,
    handleLaunch,
    advancePastDevice,
    advancePastDelivery,
    advancePastDetails,
  ]);

  useEffect(() => {
    if (isLg !== true) {
      setHeroColumnHeightPx(null);
      return;
    }

    const el = heroColumnRef.current;
    if (!el) return;

    const apply = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) setHeroColumnHeightPx(Math.round(h));
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [isLg, apodImageUrl, configureSlides.length]);

  useEffect(() => {
    if (isLg !== true) {
      prevDesktopSlideCountRef.current = null;
      return;
    }
    const len = configureSlides.length;
    const prev = prevDesktopSlideCountRef.current;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (prev !== null && len > prev) {
      timeoutId = setTimeout(() => {
        const el = desktopCardsColumnRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }, 240);
    }
    prevDesktopSlideCountRef.current = len;

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [configureSlides.length, isLg]);

  useEffect(() => {
    if (configureSlides.length === 0) return;
    setMobileCarouselStepIndex((prev) => {
      const visible = new Set(configureSlides.map((s) => s.stepIndex));
      if (visible.has(prev)) return prev;
      return configureSlides[0]!.stepIndex;
    });
  }, [configureSlides]);

  return (
    <FormProvider {...form}>
      <div className="min-h-screen">
        <Container className="mt-20 h-full">
          <div className="flex flex-col gap-10">
            <SectionHeading
              align="center"
              className="px-0 lg:px-0"
              containerClassName="max-w-2xl lg:max-w-none"
              kicker="CREATE MODE"
              subtitle={
                <>
                  Pick your sky, your iPhone model, and where we ship — no
                  account needed. You&apos;ll finish payment on Stripe&apos;s
                  secure page.
                </>
              }
              subtitleClassName="mx-auto max-w-md leading-relaxed text-balance md:leading-loose lg:max-w-lg"
              title={
                <span data-testid="configure-page-heading">
                  Design your CosmicCase
                </span>
              }
              titleAs="h1"
              titleClassName="mx-0 max-w-xl text-[clamp(2.5rem,5vw,3.5rem)] lg:max-w-none"
            />

            <div className="my-15 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_auto_minmax(0,1.1fr)] lg:items-start lg:gap-10">
              <ConfigureUploadHeroColumn
                ref={heroColumnRef}
                syncHighlight={syncHighlight}
                phoneImageUrl={apodImageUrl}
              />

              <div className="lg:hidden">
                <ConfigureProgress
                  dataTestId="configure-progress-mobile"
                  orientation="horizontal"
                  labels={CONFIGURE_PROGRESS_LABELS}
                  stepComplete={stepCompleteFlags}
                  focusedStepIndex={mobileCarouselStepIndex}
                />
              </div>

              <div
                className="hidden min-w-14 self-start pt-2 lg:flex lg:flex-col lg:items-center lg:justify-center lg:self-start lg:pt-0"
                style={
                  isLg === true && heroColumnHeightPx !== null
                    ? { minHeight: heroColumnHeightPx }
                    : undefined
                }
              >
                <ConfigureProgress
                  dataTestId="configure-progress-desktop"
                  orientation="vertical"
                  labels={CONFIGURE_PROGRESS_LABELS}
                  stepComplete={stepCompleteFlags}
                  focusedStepIndex={desktopActiveStepIndex}
                />
              </div>

              {isLg === true ? (
                <div
                  ref={desktopCardsColumnRef}
                  className="flex min-h-0 flex-col gap-6 overflow-y-auto pb-8 lg:pr-2"
                  style={
                    heroColumnHeightPx !== null
                      ? {
                          height: heroColumnHeightPx,
                          maxHeight: heroColumnHeightPx,
                        }
                      : undefined
                  }
                >
                  <LayoutGroup id="configure-desktop-cards">
                    {configureSlides.map((slide) => (
                      <motion.div
                        key={slide.stepIndex}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          layout: {
                            type: "tween",
                            duration: 1,
                            ease: "linear",
                          },
                          opacity: {
                            duration: 0.9,
                            ease: "linear",
                          },
                          y: {
                            type: "tween",
                            duration: 1.1,
                            ease: "linear",
                          },
                        }}
                      >
                        {slide.content}
                      </motion.div>
                    ))}
                  </LayoutGroup>
                </div>
              ) : (
                <div className="pb-8">
                  <ConfigureCardsCarousel
                    slides={configureSlides}
                    stepLabels={CONFIGURE_PROGRESS_LABELS}
                    onActiveStepIndexChange={setMobileCarouselStepIndex}
                  />
                </div>
              )}
            </div>
          </div>
        </Container>

        <ConfigureApodImagePreviewModal
          isOpen={isImagePreviewOpen}
          imageUrl={apodImageUrl}
          imageTitle={apod?.title ?? "NASA APOD"}
          onClose={() => setIsImagePreviewOpen(false)}
        />
      </div>
    </FormProvider>
  );
}
