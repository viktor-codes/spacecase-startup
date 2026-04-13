"use client";

import * as Slider from "@radix-ui/react-slider";

type SpaceDateScannerTimelineProps = {
  minDate: number;
  maxDate: number;
  value: number;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
};

function formatUtcDayMonthYear(ts: number): string {
  const d = new Date(ts);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

const SpaceDateScannerTimeline = ({
  minDate,
  maxDate,
  value,
  onChange,
  onCommit,
}: SpaceDateScannerTimelineProps) => {
  return (
    <div className="relative w-full max-w-2xl touch-none overflow-hidden px-4">
      {/* Тонкая линия трека */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 rounded-full bg-white" />

      {/* Radix Slider: отвечает за поведение, визуал остаётся кастомным */}
      <Slider.Root
        min={minDate}
        max={maxDate}
        value={[value]}
        step={24 * 60 * 60 * 1000}
        onValueChange={(values: number[]) => {
          const [value] = values;
          onChange(value);
        }}
        onValueCommit={(values: number[]) => {
          const [value] = values;
          onCommit(value);
        }}
        className="relative z-(--z-base) flex h-13 w-full items-center"
      >
        {/* Трек и диапазон оставляем прозрачными, а визуал делаем через Thumb */}
        <Slider.Track className="relative h-10 w-full bg-transparent">
          <Slider.Range className="absolute inset-y-0 bg-transparent" />
        </Slider.Track>
        {/* Бегунок: используем стандартный Thumb от Radix */}
        <Slider.Thumb
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/6 shadow-[0_0_0_6px_rgba(255,255,255,0.05)] outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          aria-label="Date"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
        </Slider.Thumb>
      </Slider.Root>

      {/* Метки дат под слайдером */}
      <div className="mt-4 flex justify-between font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        <span>{formatUtcDayMonthYear(minDate)}</span>
        <span className="hidden animate-pulse text-text-secondary md:block">
          Scanning timeline
        </span>
        <span className="font-technical">{formatUtcDayMonthYear(maxDate)}</span>
      </div>
    </div>
  );
};

export default SpaceDateScannerTimeline;
