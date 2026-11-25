"use client";

import { useSyncExternalStore } from "react";

/** Live CSS media-query match. Returns `serverValue` during SSR / first paint. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Phones (below Tailwind's `sm` breakpoint). */
export const MOBILE_QUERY = "(max-width: 639px)";
