"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDate } from "@internationalized/date";

export const APOD_MIN_DATE = "1995-06-16";

type UseApodDateArgs = {
  value?: string;
  onChange?: (date: string) => void;
};

function parseValueToTimestamp(valueToParse: string): number | null {
  const [y, m, d] = valueToParse.split("-").map(Number);
  if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
    return Date.UTC(y, m - 1, d);
  }
  return null;
}

function tsToCalendarDate(ts: number) {
  const d = new Date(ts);
  return new CalendarDate(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
  );
}

function stateFromProp(
  value: string | undefined,
  minDate: number,
  maxDate: number,
): { committed: number | null; preview: number } {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return { committed: null, preview: minDate };
  }
  const parsed = parseValueToTimestamp(trimmed);
  if (parsed === null) {
    return { committed: null, preview: minDate };
  }
  const clamped = Math.min(Math.max(parsed, minDate), maxDate);
  return { committed: clamped, preview: clamped };
}

export const useApodDate = ({ value, onChange }: UseApodDateArgs) => {
  const minDate = useMemo(() => {
    const [y, m, d] = APOD_MIN_DATE.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  }, []);

  const maxDate = useMemo(() => {
    const now = new Date();
    return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  }, []);

  const [committedTimestamp, setCommittedTimestamp] = useState<number | null>(
    () => stateFromProp(value, minDate, maxDate).committed,
  );
  const [previewTimestamp, setPreviewTimestamp] = useState(
    () => stateFromProp(value, minDate, maxDate).preview,
  );
  const [calendarValue, setCalendarValue] = useState<CalendarDate | null>(() => {
    const s = stateFromProp(value, minDate, maxDate);
    return s.committed !== null ? tsToCalendarDate(s.committed) : null;
  });

  const prevValueRef = useRef(value);

  useEffect(() => {
    const next = stateFromProp(value, minDate, maxDate);
    setCommittedTimestamp(next.committed);
    setPreviewTimestamp(next.preview);

    if (next.committed !== null) {
      setCalendarValue(tsToCalendarDate(next.committed));
    } else if (prevValueRef.current?.trim() && !value?.trim()) {
      // Parent cleared a previously set ISO date (external reset).
      setCalendarValue(null);
    }

    prevValueRef.current = value;
  }, [value, minDate, maxDate]);

  const minCalendarDate = useMemo(() => tsToCalendarDate(minDate), [minDate]);
  const maxCalendarDate = useMemo(() => tsToCalendarDate(maxDate), [maxDate]);

  const dateString = useMemo(() => {
    if (committedTimestamp === null) {
      return "";
    }
    const d = new Date(committedTimestamp);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [committedTimestamp]);

  useEffect(() => {
    // During digit editing, the DateField may produce temporary out-of-range dates.
    // We keep those locally for UX, but avoid propagating "" to the parent,
    // otherwise the parent clears `value` and the field resets mid-edit.
    if (committedTimestamp !== null) {
      onChange?.(dateString);
      return;
    }

    // Explicit clear: calendarValue is null (user cleared the field).
    if (calendarValue === null) {
      onChange?.("");
    }
  }, [dateString, onChange, committedTimestamp, calendarValue]);

  const commitPreview = (next?: number) => {
    const committedNext = typeof next === "number" ? next : previewTimestamp;
    setCommittedTimestamp(committedNext);
    setPreviewTimestamp(committedNext);
    setCalendarValue(tsToCalendarDate(committedNext));
  };

  const handleSliderChange = (nextValue: number) => {
    setPreviewTimestamp(nextValue);
  };

  const handleDigitsChange = (next: {
    year: number;
    month: number;
    day: number;
  }) => {
    setCalendarValue(new CalendarDate(next.year, next.month, next.day));
    const ts = Date.UTC(next.year, next.month - 1, next.day);
    if (ts >= minDate && ts <= maxDate) {
      setCommittedTimestamp(ts);
      setPreviewTimestamp(ts);
    } else {
      setCommittedTimestamp(null);
    }
  };

  const handleDigitsClear = () => {
    setCalendarValue(null);
    setCommittedTimestamp(null);
    setPreviewTimestamp(minDate);
  };

  return {
    minDate,
    maxDate,
    previewTimestamp,
    minCalendarDate,
    maxCalendarDate,
    previewCalendarValue: calendarValue,
    dateString,
    handleSliderChange,
    commitSliderValue: commitPreview,
    handleDigitsChange,
    handleDigitsClear,
  };
};
