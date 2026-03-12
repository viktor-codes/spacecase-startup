"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useApodDate } from "@/hooks/useApodDate";
import SpaceDateScannerDateDigits from "@/components/SpaceDateScannerDateDigits";

type SpaceDateScannerProps = {
  value?: string;
  onChange?: (date: string) => void;
  onSubmit?: (date: string) => void;
  showPrimaryButton?: boolean;
  loading?: boolean;
  className?: string;
};

const SpaceDateScanner = ({
  value,
  onChange,
  onSubmit,
  showPrimaryButton = true,
  loading = false,
  className,
}: SpaceDateScannerProps) => {
  const {
    minDate,
    maxDate,
    timestamp,
    setTimestamp,
    sliderValue,
    setSliderValue,
    dateString,
    displayDate,
    handleSliderChange,
    commitSliderValue,
  } = useApodDate({ value, onChange });
  const [isEditing, setIsEditing] = useState(false);
  const [manualDay, setManualDay] = useState<string | null>(null);
  const [manualMonth, setManualMonth] = useState<string | null>(null);
  const [manualYear, setManualYear] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const commitManualInput = (options?: { submit?: boolean }) => {
    const dayString = manualDay ?? displayDate.day;
    const monthString = manualMonth ?? displayDate.month;
    const yearString = manualYear ?? String(displayDate.year);

    if (!dayString || !monthString || !yearString) {
      setHasError(true);
      return;
    }

    const day = Number(dayString);
    const month = Number(monthString);
    const year = Number(yearString);

    if (
      Number.isNaN(day) ||
      Number.isNaN(month) ||
      Number.isNaN(year) ||
      day < 1 ||
      month < 1 ||
      month > 12
    ) {
      setHasError(true);
      return;
    }

    const candidate = new Date(year, month - 1, day);

    if (
      candidate.getFullYear() !== year ||
      candidate.getMonth() !== month - 1 ||
      candidate.getDate() !== day
    ) {
      setHasError(true);
      return;
    }

    const ts = candidate.getTime();
    if (ts < minDate || ts > maxDate) {
      setHasError(true);
      return;
    }

    setTimestamp(ts);
    setSliderValue(ts);
    setManualDay(null);
    setManualMonth(null);
    setManualYear(null);
    setHasError(false);

    if (options?.submit && onSubmit) {
      const iso = new Date(ts).toISOString().split("T")[0];
      onSubmit(iso);
    }
  };

  const handleSubmitClick = () => {
    if (onSubmit) {
      onSubmit(dateString);
    }
  };

  const percentage = useMemo(() => {
    if (maxDate === minDate) return 0;
    return ((sliderValue - minDate) / (maxDate - minDate)) * 100;
  }, [sliderValue, minDate, maxDate]);

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "flex flex-col items-center space-y-12 p-10 bg-surface-elevated/30 rounded-[3rem] border border-white/5 backdrop-blur-xl",
        className,
      )}
    >
      {/* 1. ГИГАНТСКИЕ ЦИФРЫ (РУЧНОЙ ВВОД) */}
      <SpaceDateScannerDateDigits
        displayDate={displayDate}
        manualDay={manualDay}
        manualMonth={manualMonth}
        manualYear={manualYear}
        isEditing={isEditing}
        hasError={hasError}
        setManualDay={setManualDay}
        setManualMonth={setManualMonth}
        setManualYear={setManualYear}
        setIsEditing={setIsEditing}
        setHasError={setHasError}
        onCommit={commitManualInput}
      />

      {/* 2. КОСМИЧЕСКИЙ СЛАЙДЕР — touch-action чтобы не дёргало страницу на тач-устройствах */}
      <div
        className="relative w-full max-w-2xl px-4 touch-none"
        onMouseDown={() => {
          // При взаимодействии со слайдером возвращаемся к последней зафиксированной дате
          setManualDay(null);
          setManualMonth(null);
          setManualYear(null);
          setIsEditing(false);
          setHasError(false);
        }}
        onTouchStart={() => {
          setManualDay(null);
          setManualMonth(null);
          setManualYear(null);
          setIsEditing(false);
          setHasError(false);
        }}
      >
        {/* Тонкая линия трека (визуально — только она, нативный range скрыт) */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 rounded-full bg-gray-900" />

        {/* Нативный range — только логика; бегунок и трек полностью скрыты (в т.ч. Safari) */}
        <input
          type="range"
          min={minDate}
          max={maxDate}
          value={sliderValue}
          onChange={handleSliderChange}
          onMouseUp={commitSliderValue}
          onTouchEnd={commitSliderValue}
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

      {/* 3. КНОПКА ПОИСКА (ОПЦИОНАЛЬНО) — запрос в NASA только по клику */}
      {showPrimaryButton && (
        <button
          type="button"
          disabled={loading}
          onClick={handleSubmitClick}
          className="group cursor-pointer relative px-12 py-5 bg-foreground text-background rounded-2xl font-bold text-xl transition-all hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] disabled:opacity-60 disabled:pointer-events-none"
        >
          <span className="relative z-10 flex items-center gap-3">
            {loading ? "Loading..." : "Reveal the Universe"}
            {!loading && (
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            )}
          </span>
        </button>
      )}
    </div>
  );
};

export default SpaceDateScanner;
