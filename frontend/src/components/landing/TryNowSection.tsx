"use client";

import { useState } from "react";

import Section from "@/components/Section";
import { buttonVariants } from "@/components/ui/button";
import { fetchApod, type ApodResponse } from "@/lib/api/apodClient";

const TryNowSection = () => {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apod, setApod] = useState<ApodResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setApod(null);

    try {
      const data = await fetchApod(date || undefined);

      if (data.media_type !== "image" || !data.url) {
        setError(
          "For this date NASA APOD is not an image. Please try another date.",
        );
        return;
      }

      setApod(data);
      setIsModalOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching the image.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Section className="py-20">
      <div className="px-6 lg:px-8 mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Try it now
        </p>
        <h2 className="mt-4 tracking-tight text-balance !leading-tight font-bold text-4xl md:text-5xl text-gray-900">
          Which date changed your universe?
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-600">
          Choose a meaningful date and preview the NASA Astronomy Picture of the
          Day from that moment. This is the image we can turn into your
          SpaceCase.
        </p>
      </div>

      <div className="mt-10 px-6 lg:px-8 mx-auto max-w-xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
        >
          <div className="flex flex-col items-start gap-1">
            <label
              htmlFor="try-now-date"
              className="text-sm font-medium text-slate-900"
            >
              Enter a date that matters to you
            </label>
            <p className="text-xs text-slate-500">
              A birthday, anniversary, the day you moved, or any moment you want
              to remember.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              id="try-now-date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 focus:border-[#4A325E] focus:ring-2 focus:ring-[#4A325E]/20"
            />
            <button
              type="submit"
              disabled={loading}
              className={buttonVariants({
                size: "sm",
                className: "whitespace-nowrap disabled:opacity-60",
              })}
            >
              {loading ? "Fetching image..." : "Show my NASA photo"}
            </button>
          </div>
          {error ? (
            <p className="text-xs text-destructive">
              {error} Try another date or come back later.
            </p>
          ) : (
            <p className="text-[11px] text-slate-400">
              We use NASA&apos;s official Astronomy Picture of the Day (APOD)
              archive. On the next step you will be able to customize your case.
            </p>
          )}
        </form>
      </div>

      {isModalOpen && apod && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 text-xl leading-none"
              aria-label="Close preview"
            >
              ×
            </button>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {apod.title || "Your NASA image"}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Preview of the NASA Astronomy Picture of the Day for your
                  selected date.
                </p>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <img
                  src={apod.url}
                  alt={apod.title || "NASA Astronomy Picture of the Day"}
                  className="h-full w-full object-cover"
                />
              </div>
              {apod.explanation && (
                <p className="text-xs text-slate-600 line-clamp-4">
                  {apod.explanation}
                </p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Close
                </button>
                <a
                  href={`/configure/upload?date=${encodeURIComponent(date)}`}
                  className={buttonVariants({
                    size: "sm",
                    className: "text-xs",
                  })}
                >
                  Use this date for my case
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

