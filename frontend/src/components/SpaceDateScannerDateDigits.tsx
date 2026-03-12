"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

type DisplayDate = {
  day: string;
  month: string;
  year: number;
};

type DateDigitsInputProps = {
  displayDate: DisplayDate;
  manualDay: string | null;
  manualMonth: string | null;
  manualYear: string | null;
  size?: "default" | "compact";
  helperVariant?: "default" | "minimal" | "none";
  helperTextOverride?: string;
  isEditing: boolean;
  hasError: boolean;
  setManualDay: (value: string | null) => void;
  setManualMonth: (value: string | null) => void;
  setManualYear: (value: string | null) => void;
  setIsEditing: (value: boolean) => void;
  setHasError: (value: boolean) => void;
  onCommit: (options?: { submit?: boolean }) => void;
};

const SpaceDateScannerDateDigits = ({
  displayDate,
  manualDay,
  manualMonth,
  manualYear,
  size = "default",
  helperVariant = "default",
  helperTextOverride,
  isEditing,
  hasError,
  setManualDay,
  setManualMonth,
  setManualYear,
  setIsEditing,
  setHasError,
  onCommit,
}: DateDigitsInputProps) => {
  const dayInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  const handleManualPartChange =
    (part: "day" | "month" | "year") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");

      if (part === "year") {
        const value = raw.slice(0, 4);
        if (!value) {
          setManualYear(null);
          return;
        }
        setManualYear(value);
      } else {
        const value = raw.slice(0, 2);
        if (part === "day") {
          if (!value) {
            setManualDay(null);
            return;
          }
          const num = Number(value);
          if (Number.isNaN(num) || num < 1 || num > 31) {
            return;
          }
          setManualDay(value);
          if (value.length === 2 && monthInputRef.current) {
            monthInputRef.current.focus();
            monthInputRef.current.select();
          }
        } else {
          if (!value) {
            setManualMonth(null);
            return;
          }
          const num = Number(value);
          if (Number.isNaN(num) || num < 1 || num > 12) {
            return;
          }
          setManualMonth(value);
          if (value.length === 2 && yearInputRef.current) {
            yearInputRef.current.focus();
            yearInputRef.current.select();
          }
        }
      }
    };

  const ensurePlaceholders = () => {
    if (manualDay === null && manualMonth === null && manualYear === null) {
      setManualDay("");
      setManualMonth("");
      setManualYear("");
    }
  };

  const resetIfEmptyDraft = () => {
    if (manualDay === "" && manualMonth === "" && manualYear === "") {
      setManualDay(null);
      setManualMonth(null);
      setManualYear(null);
      setIsEditing(false);
      setHasError(false);
      return true;
    }
    return false;
  };

  return (
    <div className="relative group cursor-text">
      <div
        className={cn(
          "flex items-center gap-4 font-mono tracking-tighter transition-all duration-500 text-foreground",
          size === "default" && "text-5xl md:text-9xl",
          size === "compact" && "text-xl md:text-3xl",
          isEditing && "scale-105",
        )}
      >
        <input
          ref={dayInputRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          aria-label="Day"
          placeholder="DD"
          className="[font-variation-settings:'MONO'_1] w-[2ch] bg-transparent border-none outline-none text-current text-center cursor-text"
          value={manualDay ?? displayDate.day}
          onChange={handleManualPartChange("day")}
          onFocus={() => {
            setIsEditing(true);
            setHasError(false);
            ensurePlaceholders();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onCommit({ submit: true });
            }
            if (e.key === "Escape") {
              e.preventDefault();
              setManualDay(null);
              setManualMonth(null);
              setManualYear(null);
              setHasError(false);
              setIsEditing(false);
            }
            if (e.key === "ArrowRight" && monthInputRef.current) {
              e.preventDefault();
              monthInputRef.current.focus();
              monthInputRef.current.select();
            }
          }}
          onBlur={(e) => {
            const related = e.relatedTarget as HTMLElement | null;
            if (
              !related ||
              (related !== monthInputRef.current &&
                related !== yearInputRef.current)
            ) {
              if (resetIfEmptyDraft()) {
                return;
              }
              if (manualDay || manualMonth || manualYear) {
                onCommit();
              }
              setIsEditing(false);
            }
          }}
        />
        <span className="opacity-20">/</span>
        <input
          ref={monthInputRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          aria-label="Month"
          placeholder="MM"
          className="[font-variation-settings:'MONO'_1] w-[2ch] bg-transparent border-none outline-none text-current text-center cursor-text"
          value={manualMonth ?? displayDate.month}
          onChange={handleManualPartChange("month")}
          onFocus={() => {
            setIsEditing(true);
            setHasError(false);
            ensurePlaceholders();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onCommit({ submit: true });
            }
            if (e.key === "Escape") {
              e.preventDefault();
              setManualDay(null);
              setManualMonth(null);
              setManualYear(null);
              setHasError(false);
              setIsEditing(false);
            }
            if (e.key === "ArrowLeft" && dayInputRef.current) {
              e.preventDefault();
              dayInputRef.current.focus();
              dayInputRef.current.select();
            }
            if (e.key === "ArrowRight" && yearInputRef.current) {
              e.preventDefault();
              yearInputRef.current.focus();
              yearInputRef.current.select();
            }
          }}
          onBlur={(e) => {
            const related = e.relatedTarget as HTMLElement | null;
            if (
              !related ||
              (related !== dayInputRef.current &&
                related !== yearInputRef.current)
            ) {
              if (resetIfEmptyDraft()) {
                return;
              }
              if (manualDay || manualMonth || manualYear) {
                onCommit();
              }
              setIsEditing(false);
            }
          }}
        />
        <span className="opacity-20">/</span>
        <input
          ref={yearInputRef}
          type="text"
          inputMode="numeric"
          maxLength={4}
          aria-label="Year"
          placeholder="YYYY"
          className="[font-variation-settings:'MONO'_1] w-[4ch] bg-transparent border-none outline-none text-current text-center cursor-text"
          value={manualYear ?? String(displayDate.year)}
          onChange={handleManualPartChange("year")}
          onFocus={() => {
            setIsEditing(true);
            setHasError(false);
            ensurePlaceholders();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onCommit({ submit: true });
            }
            if (e.key === "Escape") {
              e.preventDefault();
              setManualDay(null);
              setManualMonth(null);
              setManualYear(null);
              setHasError(false);
              setIsEditing(false);
            }
            if (e.key === "ArrowLeft" && monthInputRef.current) {
              e.preventDefault();
              monthInputRef.current.focus();
              monthInputRef.current.select();
            }
          }}
          onBlur={(e) => {
            const related = e.relatedTarget as HTMLElement | null;
            if (
              !related ||
              (related !== dayInputRef.current &&
                related !== monthInputRef.current)
            ) {
              if (resetIfEmptyDraft()) {
                return;
              }
              if (manualDay || manualMonth || manualYear) {
                onCommit();
              }
              setIsEditing(false);
            }
          }}
        />
      </div>

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
