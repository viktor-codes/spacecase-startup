"use client";

import { useLayoutEffect, useState } from "react";

const QUERY = "(min-width: 1024px)";

/**
 * Tailwind `lg` breakpoint. `null` until mounted (avoids SSR/client mismatch).
 */
export function useMinWidthLg(): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => {
      setMatches(mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return matches;
}
