"use client";

import { AnimatePresence, motion } from "framer-motion";

export type ConfigureApodImagePreviewModalProps = {
  isOpen: boolean;
  imageUrl: string | null;
  imageTitle: string;
  onClose: () => void;
};

export default function ConfigureApodImagePreviewModal({
  isOpen,
  imageUrl,
  imageTitle,
  onClose,
}: ConfigureApodImagePreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && imageUrl && (
        <motion.div
          className="fixed inset-0 z-(--z-overlay) flex items-center justify-center bg-black/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-10 right-0 font-mono text-sm tracking-[0.2em] text-text-secondary uppercase hover:text-text-primary"
              aria-label="Close image preview"
            >
              Close
            </button>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-(--border-default) bg-surface-overlay">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={imageTitle}
                className="h-full w-full object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
