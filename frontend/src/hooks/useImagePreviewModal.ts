import { useEffect, useState } from "react";

export function useImagePreviewModal(hasMedia: boolean) {
  const [openIntent, setOpenIntent] = useState(false);

  if (!hasMedia && openIntent) {
    setOpenIntent(false);
  }

  const isEffectivelyOpen = openIntent && hasMedia;

  useEffect(() => {
    if (!isEffectivelyOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenIntent(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEffectivelyOpen]);

  return {
    isImagePreviewOpen: openIntent,
    setIsImagePreviewOpen: setOpenIntent,
  };
}
