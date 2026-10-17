import { useEffect, useState } from "react";

/** A preview is a round trip to the API: typed text waits a beat before it goes. */
const PREVIEW_DELAY_MS = 400;

/** The value once typing has settled, so a preview is not fetched on every key. */
export function useSettled<T>(value: T): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), PREVIEW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [value]);

  return settled;
}
