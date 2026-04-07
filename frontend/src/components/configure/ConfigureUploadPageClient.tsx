"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import Container from "@/components/Container";
import ConfigureApodImagePreviewModal from "@/components/configure/ConfigureApodImagePreviewModal";
import ConfigureCheckoutDetailsCard from "@/components/configure/ConfigureCheckoutDetailsCard";
import ConfigureDeliveryCard from "@/components/configure/ConfigureDeliveryCard";
import ConfigureDeviceCard from "@/components/configure/ConfigureDeviceCard";
import ConfigureOrderSummaryCard from "@/components/configure/ConfigureOrderSummaryCard";
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
  configureContactFormSchema,
  type ConfigureContactFormValues,
} from "@/lib/schemas/configure-contact-form";
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
  const module2Ref = useRef<HTMLDivElement | null>(null);

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

  const handleLaunch = async () => {
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
  };

  return (
    <FormProvider {...form}>
      <div className="min-h-screen">
        <Container className="h-full">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
            <div className="max-w-xl lg:col-span-2">
              <h1
                className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl"
                data-testid="configure-page-heading"
              >
                Configure Your CosmicCase
              </h1>
            </div>

            <ConfigureUploadHeroColumn
              syncHighlight={syncHighlight}
              phoneImageUrl={apodImageUrl}
            />

            <div className="flex flex-col gap-6 pb-8 lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2">
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

              <ConfigureDeviceCard
                deviceModel={deviceModel}
                onDeviceModelChange={setDeviceModel}
              />

              <ConfigureDeliveryCard
                shipping={shipping}
                onShippingChange={setShipping}
                formatEur={formatEur}
              />

              {apodImageUrl !== null && (
                <ConfigureCheckoutDetailsCard submitError={submitError} />
              )}

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
