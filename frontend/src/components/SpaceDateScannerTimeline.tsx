"use client";

import { motion } from "framer-motion";

type SpaceDateScannerTimelineProps = {
  minDate: number;
  maxDate: number;
  sliderValue: number;
  percentage: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCommit: () => void;
  onInteractStart: () => void;
};

const SpaceDateScannerTimeline = ({
  minDate,
  maxDate,
  sliderValue,
  percentage,
  onChange,
  onCommit,
  onInteractStart,
}: SpaceDateScannerTimelineProps) => {
  return (
    <div
      className="relative w-full max-w-2xl px-4 touch-none"
      onMouseDown={onInteractStart}
      onTouchStart={onInteractStart}
    >
      {/* Тонкая линия трека (визуально — только она, нативный range скрыт) */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 rounded-full bg-gray-900" />

      {/* Нативный range — только логика; бегунок и трек полностью скрыты (в т.ч. Safari) */}
      <input
        type="range"
        min={minDate}
        max={maxDate}
        value={sliderValue}
        onChange={onChange}
        onMouseUp={onCommit}
        onTouchEnd={onCommit}
        className="slider-astronaut relative z-10 w-full h-10 bg-transparent appearance-none cursor-pointer"
      />

      {/* КОСМОНАВТ = единственный визуальный бегунок */}
      <motion.div
        className="pointer-events-none absolute top-1/2 z-20 -translate-y-1/2"
        style={{ left: `${percentage}%`, marginTop: "-5px" }}
      >
        <div className="relative w-20 h-20 -translate-x-1/2">
          <img
            src="/slider.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>

      {/* Метки дат под слайдером */}
      <div className="flex justify-between mt-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
        <span>16.06.1995</span>
        <span className="text-accent animate-pulse">Scanning timeline</span>
        <span>Today</span>
      </div>
    </div>
  );
};

export default SpaceDateScannerTimeline;

