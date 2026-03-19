"use client";

import * as Slider from "@radix-ui/react-slider";

type SpaceDateScannerTimelineProps = {
  minDate: number;
  maxDate: number;
  sliderValue: number;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
  onInteractStart: () => void;
};

const SpaceDateScannerTimeline = ({
  minDate,
  maxDate,
  sliderValue,
  onChange,
  onCommit,
  onInteractStart,
}: SpaceDateScannerTimelineProps) => {
  return (
    <div
      className="relative w-full max-w-2xl px-4 touch-none overflow-hidden"
      onMouseDown={onInteractStart}
      onTouchStart={onInteractStart}
    >
      {/* Тонкая линия трека */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 rounded-full bg-gray-900" />

      {/* Radix Slider: отвечает за поведение, визуал остаётся кастомным */}
      <Slider.Root
        min={minDate}
        max={maxDate}
        value={[sliderValue]}
        step={24 * 60 * 60 * 1000}
        onValueChange={(values: number[]) => {
          const [value] = values;
          onChange(value);
        }}
        onValueCommit={(values: number[]) => {
          const [value] = values;
          onCommit(value);
        }}
        className="relative z-(--z-base) flex h-10 w-full items-center"
      >
        {/* Трек и диапазон оставляем прозрачными, а визуал делаем через Thumb */}
        <Slider.Track className="relative h-10 w-full bg-transparent">
          <Slider.Range className="absolute inset-y-0 bg-transparent" />
        </Slider.Track>
        {/* Бегунок: используем стандартный Thumb от Radix */}
        <Slider.Thumb
          className="h-[40px] w-[100px] bg-transparent border-0 outline-none cursor-pointer"
          aria-label="Date"
          style={{
            backgroundImage: 'url("/slider.svg")',
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        />
      </Slider.Root>

      {/* Метки дат под слайдером */}
      <div className="flex justify-between mt-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
        <span>16.06.1995</span>
        <span className="text-accent animate-pulse">Scanning timeline</span>
        <span className="font-technical">Today</span>
      </div>
    </div>
  );
};

export default SpaceDateScannerTimeline;
