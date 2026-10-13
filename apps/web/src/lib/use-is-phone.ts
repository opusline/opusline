import { useSyncExternalStore } from "react";

/** Tailwind's `sm` breakpoint, below which the week reads as a list per day. */
const PHONE_QUERY = "(max-width: 639.98px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(PHONE_QUERY);

  media.addEventListener("change", onChange);

  return () => media.removeEventListener("change", onChange);
}

const readIsPhone = () => window.matchMedia(PHONE_QUERY).matches;

export function useIsPhone(): boolean {
  return useSyncExternalStore(subscribe, readIsPhone, () => false);
}
