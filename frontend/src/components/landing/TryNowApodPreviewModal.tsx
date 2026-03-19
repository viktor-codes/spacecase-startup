"use client";

import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import type { ApodResponse } from "@/lib/api/apodClient";

type TryNowApodPreviewModalProps = {
  isOpen: boolean;
  apod: ApodResponse | null;
  date: string;
  onClose: () => void;
};

const TryNowApodPreviewModal = ({
  isOpen,
  apod,
  date,
  onClose,
}: TryNowApodPreviewModalProps) => {
  if (!isOpen || !apod) return null;

  return (
    <div className="fixed inset-0 z-(--z-overlay) flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface-overlay border border-(--border-default) p-5 shadow-xl">
        <button
          type="button"
          onClick={onClose}
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
              onClick={onClose}
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
  );
};

export default TryNowApodPreviewModal;

