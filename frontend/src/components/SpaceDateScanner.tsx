"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDate } from "@internationalized/date";

import { cn } from "@/lib/utils";
import { useApodDate } from "@/hooks/useApodDate";
import SpaceDateScannerDateDigits from "@/components/SpaceDateScannerDateDigits";
import SpaceDateScannerTimeline from "@/components/SpaceDateScannerTimeline";
import { Button } from "@/components/ui/button";

type SpaceDateScannerProps = {
  value?: string;
  onChange?: (date: string) => void;
  onSubmit?: (date: string) => void;
  showPrimaryButton?: boolean;
  showSlider?: boolean;
  size?: "default" | "compact";
  helperVariant?: "default" | "minimal" | "none";
  helperTextOverride?: string;
  loading?: boolean;
  className?: string;
};

const SpaceDateScanner = ({
  value,
  onChange,
  onSubmit,
  showPrimaryButton = true,
  showSlider = true,
  size = "default",
  helperVariant = "default",
  helperTextOverride,
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
    handleSliderChange,
    commitSliderValue,
  } = useApodDate({ value, onChange });
  const hasError = useMemo(() => {
    return timestamp < minDate || timestamp > maxDate;
  }, [timestamp, minDate, maxDate]);

  const calendarValue = useMemo(() => {
    const d = new Date(timestamp);
    return new CalendarDate(
      d.getUTCFullYear(),
      d.getUTCMonth() + 1,
      d.getUTCDate(),
    );
  }, [timestamp]);

  const minCalendarDate = useMemo(() => {
    const d = new Date(minDate);
    return new CalendarDate(
      d.getUTCFullYear(),
      d.getUTCMonth() + 1,
      d.getUTCDate(),
    );
  }, [minDate]);

  const maxCalendarDate = useMemo(() => {
    const d = new Date(maxDate);
    return new CalendarDate(
      d.getUTCFullYear(),
      d.getUTCMonth() + 1,
      d.getUTCDate(),
    );
  }, [maxDate]);

  const handleDateFieldChange = (value: { year: number; month: number; day: number }) => {
    const ts = Date.UTC(value.year, value.month - 1, value.day);
    if (ts < minDate || ts > maxDate) {
      return;
    }

    setTimestamp(ts);
    setSliderValue(ts);
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
        "flex flex-col items-center space-y-12 p-10 bg-brand-subtle rounded-[3rem] border border-(--border-subtle) backdrop-blur-xl",
        className,
      )}
    >
      {/* 1. ГИГАНТСКИЕ ЦИФРЫ (РУЧНОЙ ВВОД) */}
      <SpaceDateScannerDateDigits
        value={calendarValue}
        minDate={minCalendarDate}
        maxDate={maxCalendarDate}
        size={size}
        helperVariant={helperVariant}
        helperTextOverride={helperTextOverride}
        hasError={hasError}
        onChange={handleDateFieldChange}
        onSubmit={showPrimaryButton ? handleSubmitClick : undefined}
      />

      {/* 2. КОСМИЧЕСКИЙ СЛАЙДЕР — touch-action чтобы не дёргало страницу на тач-устройствах */}
      {showSlider && (
        <SpaceDateScannerTimeline
          minDate={minDate}
          maxDate={maxDate}
          sliderValue={sliderValue}
          percentage={percentage}
          onChange={handleSliderChange}
          onCommit={commitSliderValue}
          onInteractStart={() => {
            // взаимодействие со слайдером не сбрасывает состояние даты,
            // React Aria DateField синхронизируется через timestamp
          }}
        />
      )}

      {/* 3. КНОПКА ПОИСКА (ОПЦИОНАЛЬНО) — запрос в NASA по клику или Enter */}
      {showPrimaryButton && (
        <Button
          type="button"
          disabled={loading}
          onClick={handleSubmitClick}
          variant="space"
          size="hero"
          className="group cursor-pointer relative"
        >
          <span className="relative z-[var(--z-top)] flex items-center gap-3">
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
        </Button>
      )}
    </div>
  );
};

export default SpaceDateScanner;
