"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import Container from "@/components/Container";
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
  getConfigureStepCompletionFlags,
  getEligibleMaxStepIndex,
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
  /** Monotonic: never decreases when date or device changes; only grows with eligibility. */
  const [maxRevealedStepIndex, setMaxRevealedStepIndex] = useState<number>(
    CONFIGURE_STEP_INDEX.DELIVERY,
  );
  const [mobileCarouselStepIndex, setMobileCarouselStepIndex] = useState<number>(
    CONFIGURE_STEP_INDEX.SKY,
  );
  const module2Ref = useRef<HTMLDivElement | null>(null);
  const isLg = useMinWidthLg();

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
  } = useSyncedApod({ initialDate, scrollAfterSyncRef: module2Ref });

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

  const eligibleMaxStepIndex = useMemo(
    () => getEligibleMaxStepIndex({ hasApodImage: apodImageUrl !== null }),
    [apodImageUrl],
  );

  useEffect(() => {
    setMaxRevealedStepIndex((prev) => Math.max(prev, eligibleMaxStepIndex));
  }, [eligibleMaxStepIndex]);

  const stepCompleteFlags = useMemo(
    () =>
      getConfigureStepCompletionFlags({
        selectedDate,
        hasApodImage: apodImageUrl !== null,
        deviceModel,
        shipping,
        fullName: contactValues.fullName,
        email: contactValues.email,
        eirCode: contactValues.eirCode,
        isFullCheckoutValid: isCheckoutFormValid,
      }),
    [
      selectedDate,
      apodImageUrl,
      deviceModel,
      shipping,
      contactValues.fullName,
      contactValues.email,
      contactValues.eirCode,
      isCheckoutFormValid,
    ],
  );

  const handleLaunch = useCallback(async () => {
    if (!isCheckoutFormValid) return;
    if (apodImageUrl === null) {
      setSubmitError(
        "NASA image for this date is not available. Please try another date.",
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
          : "Failed to start payment. Please try again.";
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

    if (
      isStepIndexVisible(CONFIGURE_STEP_INDEX.SKY, maxRevealedStepIndex)
    ) {
      slides.push({
        stepIndex: CONFIGURE_STEP_INDEX.SKY,
        content: (
          <ConfigureSkyDateCard
            ref={module2Ref}
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

    if (
      isStepIndexVisible(CONFIGURE_STEP_INDEX.DEVICE, maxRevealedStepIndex)
    ) {
      slides.push({
        stepIndex: CONFIGURE_STEP_INDEX.DEVICE,
        content: (
          <ConfigureDeviceCard
            deviceModel={deviceModel}
            onDeviceModelChange={setDeviceModel}
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
            <ConfigureCheckoutDetailsCard submitError={submitError} />
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
              completionStep={completionStep}
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
    completionStep,
    isSubmitting,
    handleLaunch,
  ]);

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
        <Container className="h-full">
          <div className="flex flex-col gap-10">
            <div className="max-w-xl lg:max-w-none">
              <h1
                className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl"
                data-testid="configure-page-heading"
              >
                Configure Your CosmicCase
              </h1>
            </div>

            <div className="lg:hidden">
              <ConfigureProgress
                orientation="horizontal"
                labels={CONFIGURE_PROGRESS_LABELS}
                stepComplete={stepCompleteFlags}
                focusedStepIndex={mobileCarouselStepIndex}
              />
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_auto_minmax(0,1.1fr)] lg:items-start lg:gap-10">
              <ConfigureUploadHeroColumn
                syncHighlight={syncHighlight}
                phoneImageUrl={apodImageUrl}
              />

              <div className="hidden min-w-14 self-start pt-2 lg:block">
                <ConfigureProgress
                  orientation="vertical"
                  labels={CONFIGURE_PROGRESS_LABELS}
                  stepComplete={stepCompleteFlags}
                />
              </div>

              {isLg === true ? (
                <div className="flex flex-col gap-6 pb-8 lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2">
                  {configureSlides.map((slide) => (
                    <div key={slide.stepIndex}>{slide.content}</div>
                  ))}
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
