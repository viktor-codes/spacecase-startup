"use client";

import { motion } from "framer-motion";

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
    previewTimestamp,
    dateString,
    handleSliderChange,
    commitSliderValue,
    previewCalendarValue,
    minCalendarDate,
    maxCalendarDate,
    handleDigitsChange,
  } = useApodDate({ value, onChange });

  const handleDateFieldChange = (value: {
    year: number;
    month: number;
    day: number;
  }) => {
    handleDigitsChange(value);
  };

  const handleSubmitClick = () => {
    if (onSubmit) {
      onSubmit(dateString);
    }
  };

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
        value={previewCalendarValue}
        minDate={minCalendarDate}
        maxDate={maxCalendarDate}
        size={size}
        helperVariant={helperVariant}
        helperTextOverride={helperTextOverride}
        hasError={false}
        onChange={handleDateFieldChange}
        onSubmit={showPrimaryButton ? handleSubmitClick : undefined}
      />

      {/* 2. КОСМИЧЕСКИЙ СЛАЙДЕР — touch-action чтобы не дёргало страницу на тач-устройствах */}
      {showSlider && (
        <SpaceDateScannerTimeline
          minDate={minDate}
          maxDate={maxDate}
          value={previewTimestamp}
          onChange={handleSliderChange}
          onCommit={commitSliderValue}
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
          <span className="relative z-(--z-top) flex items-center gap-3">
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
