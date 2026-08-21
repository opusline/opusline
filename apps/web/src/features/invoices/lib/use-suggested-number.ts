import { useEffect, useState } from "react";

/**
 * The reference field, seeded from the next free number once it arrives.
 *
 * The suggestion is fetched when the dialog opens, so it lands after the first
 * render and must never overwrite what the user has already typed.
 */
export function useSuggestedNumber(
  suggestedNumber: string | null,
): [string, (number: string) => void] {
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (suggestedNumber !== null) {
      setNumber((current) => (current === "" ? suggestedNumber : current));
    }
  }, [suggestedNumber]);

  return [number, setNumber];
}
