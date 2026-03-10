"use client";

import { useState, useEffect, useMemo } from "react";
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

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!Number.isNaN(newDate.getTime())) {
      const ts = newDate.getTime();
      const clamped = Math.min(Math.max(ts, minDate), maxDate);
      setTimestamp(clamped);
      setSliderValue(clamped);
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
      <div className="relative group cursor-pointer">
        <div
          className={cn(
            "flex items-center gap-4 text-5xl md:text-9xl font-mono tracking-tighter transition-all duration-500",
            isEditing ? "scale-105 text-accent" : "text-foreground",
          )}
        >
          <span className="[font-variation-settings:'MONO'_1]">
            {displayDate.day}
          </span>
          <span className="opacity-20">/</span>
          <span className="[font-variation-settings:'MONO'_1]">
            {displayDate.month}
          </span>
          <span className="opacity-20">/</span>
          <span className="[font-variation-settings:'MONO'_1]">
            {displayDate.year}
          </span>
        </div>

        {/* Скрытый настоящий инпут поверх цифр для фокуса */}
        <input
          type="date"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleManualInput}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          max={new Date().toISOString().split("T")[0]}
          min="1995-06-16"
        />

        <p className="text-center mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground font-mono">
          {isEditing
            ? "Entering coordinates..."
            : "Click digits to type or slide below"}
        </p>
      </div>

      {/* 2. КОСМИЧЕСКИЙ СЛАЙДЕР — touch-action чтобы не дёргало страницу на тач-устройствах */}
      <div className="relative w-full max-w-2xl px-4 touch-none">
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
