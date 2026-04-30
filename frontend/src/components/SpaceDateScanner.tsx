"use client";

import { motion } from "framer-motion";
import type { DateValue } from "@internationalized/date";

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
    handleDigitsClear,
  } = useApodDate({ value, onChange });

  const handleDateFieldChange = (next: DateValue | null) => {
    if (!next) {
      handleDigitsClear();
      return;
    }
    handleDigitsChange({
      year: next.year,
      month: next.month,
      day: next.day,
    });
  };

  const handleSubmitClick = () => {
    if (!dateString || !onSubmit) {
      return;
    }
    onSubmit(dateString);
  };

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "flex flex-col items-center space-y-12 rounded-[3rem] border border-(--border-subtle) bg-brand-subtle p-10 backdrop-blur-xl",
        className,
      )}
    >
      {/* 1. Large digit fields (manual input) */}
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

      {/* 2. Timeline slider — touch-none avoids scroll tug-of-war on touch devices */}
      {showSlider && (
        <SpaceDateScannerTimeline
          minDate={minDate}
          maxDate={maxDate}
          value={previewTimestamp}
          onChange={handleSliderChange}
          onCommit={commitSliderValue}
        />
      )}

      {/* 3. Optional fetch button — NASA request on click or Enter */}
      {showPrimaryButton && (
        <Button
          type="button"
          disabled={loading || !dateString}
          onClick={handleSubmitClick}
          variant="space"
          size="hero"
          className="group relative cursor-pointer"
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
