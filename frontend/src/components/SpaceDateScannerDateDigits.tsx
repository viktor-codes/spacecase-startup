"use client";

import { useState, type KeyboardEvent } from "react";
import {
  DateField,
  DateInput,
  DateSegment,
  I18nProvider,
  type DateValue,
} from "react-aria-components";

import { cn } from "@/lib/utils";

type DateDigitsInputProps = {
  value: DateValue | null;
  minDate: DateValue;
  maxDate: DateValue;
  size?: "default" | "compact";
  helperVariant?: "default" | "minimal" | "none";
  helperTextOverride?: string;
  hasError: boolean;
  onChange: (value: DateValue | null) => void;
  onSubmit?: () => void;
};

const SpaceDateScannerDateDigits = ({
  value,
  minDate,
  maxDate,
  size = "default",
  helperVariant = "default",
  helperTextOverride,
  hasError,
  onChange,
  onSubmit,
}: DateDigitsInputProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && onSubmit) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      className="group relative cursor-text"
      onKeyDownCapture={handleKeyDown}
    >
      {/* en-GB → day-month-year with slash literals (e.g. 13/04/2026) */}
      <I18nProvider locale="en-GB">
        <DateField
          aria-label="Observation date"
          value={value}
          onChange={(next) => {
            onChange(next);
          }}
          minValue={minDate}
          maxValue={maxDate}
          onFocusChange={(focused) => setIsEditing(focused)}
        >
          <DateInput
            className={cn(
              "flex items-center gap-4 font-mono tracking-tighter text-foreground transition-all duration-500",
              size === "default" && "text-[clamp(2.5rem,12vw,8rem)]",
              size === "compact" && "text-[clamp(1.25rem,4vw,2.5rem)]",
            )}
          >
            {(segment) => {
              const isLiteral = segment.type === "literal";
              const isDay = segment.type === "day";
              const isMonth = segment.type === "month";
              const isYear = segment.type === "year";

              const placeholderText = isDay
                ? "DD"
                : isMonth
                  ? "MM"
                  : isYear
                    ? "YYYY"
                    : segment.text;

              return (
                <DateSegment
                  segment={segment}
                  className={cn(
                    "cursor-text border-none bg-transparent text-center text-current transition-all outline-none [font-variation-settings:'MONO'_1]",
                    isDay && "w-[2ch]",
                    isMonth && "w-[2ch]",
                    isYear && "w-[4ch]",
                    isLiteral && "w-auto opacity-20",
                    "data-[focused=true]:scale-110 data-[focused=true]:bg-white/10",
                    segment.isPlaceholder && "text-muted-foreground/60",
                  )}
                >
                  {segment.isPlaceholder ? placeholderText : segment.text}
                </DateSegment>
              );
            }}
          </DateInput>
        </DateField>
      </I18nProvider>

      {helperVariant !== "none" && (
        <p className="font-technical mt-4 text-center text-xs tracking-[0.3em] uppercase">
          <span
            className={cn(
              "transition-colors",
              hasError ? "text-red-400" : "text-muted-foreground",
            )}
          >
            {hasError
              ? (helperTextOverride ?? "Invalid date — check the coordinates")
              : helperTextOverride
                ? helperTextOverride
                : isEditing
                  ? "Entering coordinates..."
                  : helperVariant === "minimal"
                    ? "Click digits to type"
                    : "Click digits to type or slide below"}
          </span>
        </p>
      )}
    </div>
  );
};

export default SpaceDateScannerDateDigits;
