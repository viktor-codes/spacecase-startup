"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import Section from "@/components/Section";
import SectionHeading from "@/components/landing/SectionHeading";

import { buttonVariants } from "@/components/ui/button";
import { fetchApod, type ApodResponse } from "@/lib/api/apodClient";

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
        className=""
      />

      {isModalOpen && apod && (
        <div className="fixed inset-0 z-(--z-overlay) flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-surface-overlay border border-(--border-default) p-5 shadow-xl">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute right-3 top-3 text-text-tertiary hover:text-text-primary text-xl leading-none"
              aria-label="Close preview"
            >
              ×
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {apod.title || "Your NASA image"}
                </h3>

                <p className="mt-1 text-xs text-text-secondary">
                  NASA APOD preview for your selected date.
                </p>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-(--border-default) bg-surface-base">
                <Image
                  src={apod.url}
                  alt={apod.title || "NASA Astronomy Picture of the Day"}
                  fill
                  sizes="(min-width: 1024px) 768px, 100vw"
                  className="object-cover"
                />
              </div>

              {apod.explanation && (
                <p className="text-xs text-text-secondary line-clamp-4">
                  {apod.explanation}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
                >
                  Close
                </button>

                <a
                  href={`/configure/upload?date=${encodeURIComponent(date)}`}
                  className={buttonVariants({
                    variant: "space",
                    size: "sm",
                    className: "text-xs",
                  })}
                >
                  Continue to my SpaceCase
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

export default TryNowSection;
