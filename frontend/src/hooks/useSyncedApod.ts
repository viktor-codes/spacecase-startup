import { useCallback, useEffect, useState } from "react";

import {
  fetchApod,
  getApodImageUrl,
  type ApodResponse,
} from "@/lib/api/apodClient";

export type UseSyncedApodOptions = {
  initialDate?: string;
};

export function useSyncedApod({ initialDate }: UseSyncedApodOptions) {
  const [selectedDate, setSelectedDate] = useState(initialDate ?? "");
  const [apod, setApod] = useState<ApodResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncHighlight, setSyncHighlight] = useState(false);

  const apodImageUrl = getApodImageUrl(apod);

  const handleSync = useCallback(
    async (explicitDate?: string) => {
      const dateToUse = explicitDate ?? selectedDate;
      if (!dateToUse) {
        setError("Please select a date to sync your NASA image.");
        return;
      }

      setLoading(true);
      setError(null);
      setApod(null);

      try {
        const data = await fetchApod(dateToUse);

        if (data.media_type !== "image" || !data.url) {
          setError(
            "No image available for this date in NASA APOD. Please try another date.",
          );
          return;
        }

        setApod(data);
        setSyncHighlight(true);
        setTimeout(() => setSyncHighlight(false), 900);
      } catch (e) {
        setError("Failed to fetch NASA APOD data. Please try again later.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [selectedDate],
  );

  useEffect(() => {
    if (!initialDate) return;
    void handleSync(initialDate);
    // Only re-sync when the URL-provided date changes, not when handleSync updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDate]);

  return {
    selectedDate,
    setSelectedDate,
    apod,
    loading,
    error,
    syncHighlight,
    apodImageUrl,
    handleSync,
  };
}
