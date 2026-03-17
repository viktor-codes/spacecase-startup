"use client";

import { useState, type KeyboardEvent } from "react";
import {
  DateField,
  DateInput,
  DateSegment,
  type DateValue,
} from "react-aria-components";

import { cn } from "@/lib/utils";

type DateDigitsInputProps = {
  value: DateValue;
  minDate: DateValue;
  maxDate: DateValue;
  size?: "default" | "compact";
  helperVariant?: "default" | "minimal" | "none";
  helperTextOverride?: string;
  hasError: boolean;
  onChange: (value: DateValue) => void;
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
    <div className="relative group cursor-text">
      <DateField
        aria-label="Observation date"
        value={value}
        onChange={(next) => {
          if (!next) return;
          onChange(next);
        }}
        minValue={minDate}
        maxValue={maxDate}
        onFocusChange={(focused) => setIsEditing(focused)}
        onKeyDown={handleKeyDown}
      >
        <DateInput
          className={cn(
            "flex items-center gap-4 font-mono tracking-tighter transition-all duration-500 text-foreground",
            size === "default" && "text-5xl md:text-9xl",
            size === "compact" && "text-xl md:text-3xl",
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
                  "[font-variation-settings:'MONO'_1] bg-transparent border-none outline-none text-current text-center cursor-text transition-all",
                  isDay && "w-[2ch]",
                  isMonth && "w-[2ch]",
                  isYear && "w-[4ch]",
                  isLiteral && "opacity-20 w-auto",
                  // подчёркивание активного сегмента (каретки), без смены цвета текста
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

      {helperVariant !== "none" && (
        <p className="text-center mt-4 text-xs uppercase tracking-[0.3em] font-mono">
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
