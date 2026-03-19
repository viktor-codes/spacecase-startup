"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDate } from "@internationalized/date";

export const APOD_MIN_DATE = "1995-06-16";

type UseApodDateArgs = {
  value?: string;
  onChange?: (date: string) => void;
};

export const useApodDate = ({ value, onChange }: UseApodDateArgs) => {
  // Всё считаем в UTC (00:00 UTC), чтобы дата не "прыгала" из-за локальной таймзоны.
  // Важная идея упрощения:
  // - `committedTimestamp` используется для callbacks / submit (реальная дата)
  // - `previewTimestamp` используется только для визуального обновления digits во время перетаскивания
  const minDate = useMemo(() => {
    const [y, m, d] = APOD_MIN_DATE.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  }, []);

  const maxDate = useMemo(() => {
    const now = new Date();
    return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  }, []);

  const parseValueToTimestamp = (valueToParse: string) => {
    const [y, m, d] = valueToParse.split("-").map(Number);
    if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
      return Date.UTC(y, m - 1, d);
    }
    return null;
  };

  const initialTimestamp = useMemo(() => {
    if (!value) return maxDate;
    const parsed = parseValueToTimestamp(value);
    if (parsed === null) return maxDate;
    // clamp нужен только при инициализации/вводе, чтобы гарантировать валидность.
    return Math.min(Math.max(parsed, minDate), maxDate);
  }, [value, minDate, maxDate]);

  const [committedTimestamp, setCommittedTimestamp] = useState(initialTimestamp);
  const [previewTimestamp, setPreviewTimestamp] = useState(initialTimestamp);

  useEffect(() => {
    setCommittedTimestamp(initialTimestamp);
    setPreviewTimestamp(initialTimestamp);
  }, [initialTimestamp]);

  const tsToCalendarDate = (ts: number) => {
    const d = new Date(ts);
    return new CalendarDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  };

  const minCalendarDate = useMemo(() => tsToCalendarDate(minDate), [minDate]);
  const maxCalendarDate = useMemo(() => tsToCalendarDate(maxDate), [maxDate]);
  const previewCalendarValue = useMemo(
    () => tsToCalendarDate(previewTimestamp),
    [previewTimestamp],
  );

  const dateString = useMemo(() => {
    const d = new Date(committedTimestamp);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [committedTimestamp]);

  // Уведомляем родителя только о "реально выбранной" (committed) дате.
  useEffect(() => {
    onChange?.(dateString);
  }, [dateString, onChange]);

  const commitPreview = (next?: number) => {
    const committedNext = typeof next === "number" ? next : previewTimestamp;
    setCommittedTimestamp(committedNext);
    setPreviewTimestamp(committedNext);
  };

  const handleSliderChange = (nextValue: number) => {
    // Radix slider ограничен min/max, поэтому clamp не требуется.
    // Здесь нет реквестов и нет side-effects, только визуальный preview.
    setPreviewTimestamp(nextValue);
  };

  const handleDigitsChange = (value: { year: number; month: number; day: number }) => {
    const ts = Date.UTC(value.year, value.month - 1, value.day);
    if (ts < minDate || ts > maxDate) return;
    // При ручном вводе это считается "реальным выбором".
    setCommittedTimestamp(ts);
    setPreviewTimestamp(ts);
  };

  return {
    minDate,
    maxDate,
    previewTimestamp,
    minCalendarDate,
    maxCalendarDate,
    previewCalendarValue,
    dateString,
    handleSliderChange,
    commitSliderValue: commitPreview,
    handleDigitsChange,
  };
};

