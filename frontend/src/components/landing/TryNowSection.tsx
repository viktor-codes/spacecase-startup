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
  const [error, setError] = useState<string | null>(null);
  const [notImageHint, setNotImageHint] = useState(false);

  /** Запрос в NASA APOD выполняется только по клику на кнопку "Reveal the Universe". */
  const handleRevealUniverse = async (selectedDate?: string) => {
    setApod(null);
    setError(null);
    setNotImageHint(false);
    setLoading(true);

    try {
      const effectiveDate = selectedDate ?? date;

      const data = await fetchApod(effectiveDate || undefined);

      if (data.media_type !== "image" || !data.url) {
        setNotImageHint(true);
        return;
      }

      setApod(data);
      setIsModalOpen(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(
        message.includes("502")
          ? "NASA data is temporarily unavailable. Please try again in a moment."
          : "We couldn’t load NASA’s picture for this date. Check your connection or try again.",
      );
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

      {(error || notImageHint) && (
        <div className="mt-6 flex max-w-xl flex-col gap-3 rounded-2xl border border-(--border-default) bg-surface-overlay/80 px-4 py-3 text-sm text-text-secondary">
          {notImageHint && (
            <p>
              For this date NASA APOD isn&apos;t a still image (for example, a
              video day). Pick another date or tap Retry after changing it.
            </p>
          )}
          {error && <p>{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleRevealUniverse()}
              className="font-mono text-xs uppercase tracking-[0.2em] text-brand-pink underline-offset-4 hover:underline"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setNotImageHint(false);
              }}
              className="font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary hover:text-text-primary"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <TryNowApodPreviewModal
        isOpen={isModalOpen}
        apod={apod}
        onClose={handleCloseModal}
      />
    </Section>
  );
};

export default TryNowSection;
