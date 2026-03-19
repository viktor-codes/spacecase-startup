"use client";

import * as Slider from "@radix-ui/react-slider";

type SpaceDateScannerTimelineProps = {
  minDate: number;
  maxDate: number;
  value: number;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
};

const SpaceDateScannerTimeline = ({
  minDate,
  maxDate,
  value,
  onChange,
  onCommit,
}: SpaceDateScannerTimelineProps) => {
  return (
    <div className="relative w-full max-w-2xl px-4 touch-none overflow-hidden">
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
          className="h-10 w-10 rounded-full bg-white/6 border border-white/20 shadow-[0_0_0_6px_rgba(255,255,255,0.05)] flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          aria-label="Date"
        >
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        </Slider.Thumb>
      </Slider.Root>

      {/* Метки дат под слайдером */}
      <div className="flex justify-between mt-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
        <span>16.06.1995</span>
        <span className="text-text-secondary animate-pulse hidden md:block">
          Scanning timeline
        </span>
        <span className="font-technical">Today</span>
      </div>
    </div>
  );
};

export default SpaceDateScannerTimeline;
