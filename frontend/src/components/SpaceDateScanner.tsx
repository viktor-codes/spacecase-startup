"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type SpaceDateScannerProps = {
  value?: string;
  onChange?: (date: string) => void;
  onSubmit?: (date: string) => void;
  showPrimaryButton?: boolean;
  loading?: boolean;
  className?: string;
};

const APOD_MIN_DATE = "1995-06-16";

const SpaceDateScanner = ({
  value,
  onChange,
  onSubmit,
  showPrimaryButton = true,
  loading = false,
  className,
}: SpaceDateScannerProps) => {
  // NASA APOD доступен с 16 июня 1995 года
  const minDate = useMemo(() => new Date(APOD_MIN_DATE).getTime(), []);
  const maxDate = useMemo(() => new Date().getTime(), []);

  const initialTimestamp = useMemo(() => {
    if (value) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        const ts = parsed.getTime();
        return Math.min(Math.max(ts, minDate), maxDate);
      }
    }
    return maxDate;
  }, [value, minDate, maxDate]);

  // timestamp — «зафиксированная» выбранная дата (обновляется не на каждый пиксель)
  const [timestamp, setTimestamp] = useState(initialTimestamp);
  // sliderValue — текущее положение ползунка (ездит плавно)
  const [sliderValue, setSliderValue] = useState(initialTimestamp);
  const [isEditing, setIsEditing] = useState(false);
  const [manualDay, setManualDay] = useState<string | null>(null);
  const [manualMonth, setManualMonth] = useState<string | null>(null);
  const [manualYear, setManualYear] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const dayInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimestamp(initialTimestamp);
    setSliderValue(initialTimestamp);
  }, [initialTimestamp]);

  // Превращаем timestamp в читаемую дату YYYY-MM-DD и пробрасываем наверх
  const dateString = useMemo(() => {
    const d = new Date(timestamp);
    return d.toISOString().split("T")[0];
  }, [timestamp]);

  useEffect(() => {
    if (onChange) {
      onChange(dateString);
    }
  }, [dateString, onChange]);

  // Разделяем на сегменты для отображения
  const displayDate = useMemo(() => {
    const d = new Date(timestamp);
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: String(d.getMonth() + 1).padStart(2, "0"),
      year: d.getFullYear(),
    };
  }, [timestamp]);

  // Слайдер двигает только sliderValue (для плавного движения),
  // а timestamp (и видимая дата) обновляются при отпускании ползунка.
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    const clamped = Math.min(Math.max(next, minDate), maxDate);
    setSliderValue(clamped);
  };

  const commitSliderValue = () => {
    setTimestamp(sliderValue);
  };

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
        // Проверяем год только на коммите, чтобы не мешать вводу
      } else {
        const value = raw.slice(0, 2);
        if (part === "day") {
          if (!value) {
            setManualDay(null);
            return;
          }
          const num = Number(value);
          if (Number.isNaN(num) || num < 1 || num > 31) {
            // Не даём ввести заведомо неверный день
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
            // Не даём ввести заведомо неверный месяц
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

    let ts = candidate.getTime();
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
      <div className="relative group cursor-text">
        <div
          className={cn(
            "flex items-center gap-4 text-5xl md:text-9xl font-mono tracking-tighter transition-all duration-500 text-foreground",
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
              // При первом входе в режим редактирования очищаем все поля,
              // чтобы показать плейсхолдеры DD MM YYYY
              if (
                manualDay === null &&
                manualMonth === null &&
                manualYear === null
              ) {
                setManualDay("");
                setManualMonth("");
                setManualYear("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitManualInput({ submit: true });
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
                manualDay === "" &&
                manualMonth === "" &&
                manualYear === ""
              ) {
                setManualDay(null);
                setManualMonth(null);
                setManualYear(null);
                setIsEditing(false);
                setHasError(false);
                return;
              }
              if (
                !related ||
                (related !== monthInputRef.current &&
                  related !== yearInputRef.current)
              ) {
                if (manualDay || manualMonth || manualYear) {
                  commitManualInput();
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
              if (
                manualDay === null &&
                manualMonth === null &&
                manualYear === null
              ) {
                setManualDay("");
                setManualMonth("");
                setManualYear("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitManualInput({ submit: true });
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
                manualDay === "" &&
                manualMonth === "" &&
                manualYear === ""
              ) {
                setManualDay(null);
                setManualMonth(null);
                setManualYear(null);
                setIsEditing(false);
                setHasError(false);
                return;
              }
              if (
                !related ||
                (related !== dayInputRef.current &&
                  related !== yearInputRef.current)
              ) {
                if (manualDay || manualMonth || manualYear) {
                  commitManualInput();
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
              if (
                manualDay === null &&
                manualMonth === null &&
                manualYear === null
              ) {
                setManualDay("");
                setManualMonth("");
                setManualYear("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitManualInput({ submit: true });
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
                manualDay === "" &&
                manualMonth === "" &&
                manualYear === ""
              ) {
                setManualDay(null);
                setManualMonth(null);
                setManualYear(null);
                setIsEditing(false);
                setHasError(false);
                return;
              }
              if (
                !related ||
                (related !== dayInputRef.current &&
                  related !== monthInputRef.current)
              ) {
                if (manualDay || manualMonth || manualYear) {
                  commitManualInput();
                }
                setIsEditing(false);
              }
            }}
          />
        </div>

        <p className="text-center mt-4 text-xs uppercase tracking-[0.3em] font-mono">
          <span
            className={cn(
              "transition-colors",
              hasError ? "text-red-400" : "text-muted-foreground",
            )}
          >
            {hasError
              ? "Invalid date — check the coordinates"
              : isEditing
                ? "Entering coordinates..."
                : "Click digits to type or slide below"}
          </span>
        </p>
      </div>

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
