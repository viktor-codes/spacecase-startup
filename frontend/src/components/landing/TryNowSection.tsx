"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import Section from "@/components/Section";
import SectionHeading from "@/components/landing/SectionHeading";

import { fetchApod, type ApodResponse } from "@/lib/api/apodClient";
import TryNowApodPreviewModal from "@/components/landing/TryNowApodPreviewModal";

const SpaceDateScanner = dynamic(() => import("../SpaceDateScanner"), {
  ssr: false,
});

const TryNowSection = () => {
  const [date, setDate] = useState("");
  const [apod, setApod] = useState<ApodResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Запрос в NASA APOD выполняется только по клику на кнопку "Reveal the Universe". */
  const handleRevealUniverse = async (selectedDate?: string) => {
    setApod(null);
    setLoading(true);

    try {
      const effectiveDate = selectedDate ?? date;

      const data = await fetchApod(effectiveDate || undefined);

      if (data.media_type !== "image" || !data.url) {
        console.warn(
          "For this date NASA APOD is not an image. Please try another date.",
        );
        return;
      }

      setApod(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch APOD image", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Section>
      <div id="try-now" className="absolute -top-24" />
      <SectionHeading
        containerClassName="max-w-3xl"
        kicker="Try it now"
        title="See NASA's sky on your date"
        subtitle={
          <>
            Enter a date to preview NASA&apos;s Astronomy Picture of the Day.
            We&apos;ll AI-enhance it for a print-ready SpaceCase.
          </>
        }
      />
      <SpaceDateScanner
        value={date}
        onChange={setDate}
        onSubmit={handleRevealUniverse}
        loading={loading}
        className="mt-8"
      />

      <TryNowApodPreviewModal
        isOpen={isModalOpen}
        apod={apod}
        date={date}
        onClose={handleCloseModal}
      />
    </Section>
  );
};

export default TryNowSection;
