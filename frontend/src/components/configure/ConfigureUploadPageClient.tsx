"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Container from "@/components/Container";
import ConfigureApodImagePreviewModal from "@/components/configure/ConfigureApodImagePreviewModal";
import ConfigureCheckoutDetailsCard from "@/components/configure/ConfigureCheckoutDetailsCard";
import ConfigureCosmicFrameCard from "@/components/configure/ConfigureCosmicFrameCard";
import ConfigureDateScannerCard from "@/components/configure/ConfigureDateScannerCard";
import ConfigureDeliveryCard from "@/components/configure/ConfigureDeliveryCard";
import ConfigureDeviceCard from "@/components/configure/ConfigureDeviceCard";
import ConfigureOrderSummaryCard from "@/components/configure/ConfigureOrderSummaryCard";
import ConfigureUploadHeroColumn from "@/components/configure/ConfigureUploadHeroColumn";
import {
  createStripeCheckoutSession,
  type CreateStripeCheckoutSessionPayload,
} from "@/lib/api/ordersClient";
import { PHONE_MODELS, SHIPPING_OPTIONS, type ShippingOption } from "@/lib/configure/constants";
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

            <ConfigureDeviceCard
              deviceModel={deviceModel}
              onDeviceModelChange={setDeviceModel}
            />

            <ConfigureDeliveryCard
              shipping={shipping}
              onShippingChange={setShipping}
              formatEur={formatEur}
            />

            {hasImage && (
              <ConfigureCheckoutDetailsCard
                fullName={fullName}
                onFullNameChange={setFullName}
                email={email}
                onEmailChange={setEmail}
                phone={phone}
                onPhoneChange={setPhone}
                line1={line1}
                onLine1Change={setLine1}
                line2={line2}
                onLine2Change={setLine2}
                city={city}
                onCityChange={setCity}
                eirCode={eirCode}
                onEirCodeChange={setEirCode}
                isEmailValid={isEmailValid}
                isEirCodeValid={isEirCodeValid}
                submitError={submitError}
              />
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
        imageUrl={typeof hasImage === "string" ? hasImage : null}
        imageTitle={apod?.title ?? "NASA APOD"}
        onClose={() => setIsImagePreviewOpen(false)}
      />
    </div>
  );
}
