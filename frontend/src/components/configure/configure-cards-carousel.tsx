"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConfigureCarouselSlide = {
  stepIndex: number;
  content: ReactNode;
};

export type ConfigureCardsCarouselProps = {
  slides: readonly ConfigureCarouselSlide[];
  onActiveStepIndexChange: (stepIndex: number) => void;
  /** Labels indexed by logical step (0–4), e.g. CONFIGURE_PROGRESS_LABELS */
  stepLabels: readonly string[];
};

export default function ConfigureCardsCarousel({
  slides,
  onActiveStepIndexChange,
  stepLabels,
}: ConfigureCardsCarouselProps) {
  const [viewportRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });

  const [selectedSnap, setSelectedSnap] = useState(0);
  const [liveMessage, setLiveMessage] = useState("");
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const emitActive = useCallback(() => {
    if (!emblaApi) return;
    const i = emblaApi.selectedScrollSnap();
    setSelectedSnap(i);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());

    const slide = slides[i];
    if (slide !== undefined) {
      onActiveStepIndexChange(slide.stepIndex);
      const label = stepLabels[slide.stepIndex] ?? `Step ${slide.stepIndex + 1}`;
      setLiveMessage(`Step ${i + 1} of ${slides.length}: ${label}`);
    }
  }, [emblaApi, onActiveStepIndexChange, slides, stepLabels]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", emitActive);
    emblaApi.on("reInit", emitActive);
    queueMicrotask(() => {
      emitActive();
    });
    return () => {
      emblaApi.off("select", emitActive);
      emblaApi.off("reInit", emitActive);
    };
  }, [emblaApi, emitActive]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, slides]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Configure case steps"
      aria-roledescription="carousel"
      className="w-full"
      data-testid="configure-carousel"
      role="region"
    >
      <div className="w-full overflow-hidden pb-1" ref={viewportRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => {
            const label =
              stepLabels[slide.stepIndex] ?? `Step ${slide.stepIndex + 1}`;
            const isActive = selectedSnap === index;

            return (
              <div
                key={slide.stepIndex}
                aria-label={`${index + 1} of ${slides.length}: ${label}`}
                aria-roledescription="slide"
                aria-hidden={!isActive}
                className={cn(
                  "min-w-0 shrink-0 grow-0 basis-full px-0.5",
                  !isActive && "pointer-events-none",
                )}
                inert={!isActive ? true : undefined}
                role="group"
              >
                {slide.content}
              </div>
            );
          })}
        </div>
      </div>

      <div
        aria-label="Step navigation"
        className="mt-3 flex items-center justify-center gap-3"
        role="group"
      >
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="shrink-0 rounded-xl border border-(--border-default) bg-surface-raised/60 text-text-primary hover:bg-surface-raised"
          disabled={!canScrollPrev}
          aria-label="Previous configuration step"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>

        <span
          className="min-w-[3.5rem] text-center font-mono text-[10px] tabular-nums tracking-[0.2em] text-text-tertiary uppercase"
          aria-hidden
        >
          {selectedSnap + 1} / {slides.length}
        </span>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="shrink-0 rounded-xl border border-(--border-default) bg-surface-raised/60 text-text-primary hover:bg-surface-raised"
          disabled={!canScrollNext}
          aria-label="Next configuration step"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>

      <p className="sr-only" aria-atomic="true" aria-live="polite" role="status">
        {liveMessage}
      </p>
    </section>
  );
}
