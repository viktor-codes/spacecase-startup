"use client";

import { useEffect, useMemo, useState } from "react";

export const APOD_MIN_DATE = "1995-06-16";

type UseApodDateArgs = {
  value?: string;
  onChange?: (date: string) => void;
};

export const useApodDate = ({ value, onChange }: UseApodDateArgs) => {
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

  const [timestamp, setTimestamp] = useState(initialTimestamp);
  const [sliderValue, setSliderValue] = useState(initialTimestamp);

  useEffect(() => {
    setTimestamp(initialTimestamp);
    setSliderValue(initialTimestamp);
  }, [initialTimestamp]);

  const dateString = useMemo(() => {
    const d = new Date(timestamp);
    return d.toISOString().split("T")[0];
  }, [timestamp]);

  useEffect(() => {
    if (onChange) {
      onChange(dateString);
    }
  }, [dateString, onChange]);

  const displayDate = useMemo(() => {
    const d = new Date(timestamp);
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: String(d.getMonth() + 1).padStart(2, "0"),
      year: d.getFullYear(),
    };
  }, [timestamp]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    const clamped = Math.min(Math.max(next, minDate), maxDate);
    setSliderValue(clamped);
  };

  const commitSliderValue = () => {
    setTimestamp(sliderValue);
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

