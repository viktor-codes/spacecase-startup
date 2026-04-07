"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, type ReactNode } from "react";

export type ConfigureCarouselSlide = {
  stepIndex: number;
  content: ReactNode;
};

export type ConfigureCardsCarouselProps = {
  slides: readonly ConfigureCarouselSlide[];
  onActiveStepIndexChange: (stepIndex: number) => void;
};

export default function ConfigureCardsCarousel({
  slides,
  onActiveStepIndexChange,
}: ConfigureCardsCarouselProps) {
  const [viewportRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });

  const emitActive = useCallback(() => {
    if (!emblaApi) return;
    const i = emblaApi.selectedScrollSnap();
    const slide = slides[i];
    if (slide !== undefined) {
      onActiveStepIndexChange(slide.stepIndex);
    }
  }, [emblaApi, onActiveStepIndexChange, slides]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", emitActive);
    emblaApi.on("reInit", emitActive);
    emitActive();
    return () => {
      emblaApi.off("select", emitActive);
      emblaApi.off("reInit", emitActive);
    };
  }, [emblaApi, emitActive]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, slides]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden pb-1" ref={viewportRef}>
      <div className="flex touch-pan-y">
        {slides.map((slide) => (
          <div
            key={slide.stepIndex}
            className="min-w-0 shrink-0 grow-0 basis-full px-0.5"
          >
            {slide.content}
          </div>
        ))}
      </div>
    </div>
  );
}
