"use client";

import { useEffect, useMemo, useState } from "react";

export const APOD_MIN_DATE = "1995-06-16";

type UseApodDateArgs = {
  value?: string;
  onChange?: (date: string) => void;
};

export const useApodDate = ({ value, onChange }: UseApodDateArgs) => {
  // Всё считаем в UTC (00:00 UTC), чтобы дата не "прыгала" из-за локальной таймзоны
  const minDate = useMemo(() => {
    const [y, m, d] = APOD_MIN_DATE.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  }, []);

  const maxDate = useMemo(() => {
    const now = new Date();
    return Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
  }, []);

  const initialTimestamp = useMemo(() => {
    if (value) {
      const [y, m, d] = value.split("-").map(Number);
      if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
        const ts = Date.UTC(y, m - 1, d);
        return Math.min(Math.max(ts, minDate), maxDate);
      }
    }
    return maxDate;
  }, [value, minDate, maxDate]);

  const [timestamp, setTimestamp] = useState(initialTimestamp);
  const [sliderValue, setSliderValue] = useState(initialTimestamp);

  useEffect(() => {
    setTimestamp(initialTimestamp);
    setSliderValue(initialTimestamp);
  }, [initialTimestamp]);

  const dateString = useMemo(() => {
    const d = new Date(timestamp);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [timestamp]);

  useEffect(() => {
    if (onChange) {
      onChange(dateString);
    }
  }, [dateString, onChange]);

  const displayDate = useMemo(() => {
    const d = new Date(timestamp);
    return {
      day: String(d.getUTCDate()).padStart(2, "0"),
      month: String(d.getUTCMonth() + 1).padStart(2, "0"),
      year: d.getUTCFullYear(),
    };
  }, [timestamp]);

  const handleSliderChange = (value: number) => {
    const clamped = Math.min(Math.max(value, minDate), maxDate);
    setSliderValue(clamped);
  };

  const commitSliderValue = (value?: number) => {
    const next = typeof value === "number" ? value : sliderValue;
    const clamped = Math.min(Math.max(next, minDate), maxDate);
    setTimestamp(clamped);
    setSliderValue(clamped);
  };

  return {
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
  };
};

