import { useEffect, useEffectEvent, useRef } from "react";

/** Deliberate input. Pointer movement and focus are not: reading is not activity. */
const ACTIVITY_EVENTS = [
  "pointerdown",
  "keydown",
  "wheel",
  "touchstart",
] as const;

const CHECK_INTERVAL_MS = 15_000;

/**
 * Calls `onIdle` once the page has gone `idleMs` without deliberate input.
 *
 * It compares timestamps on an interval instead of arming one long timeout,
 * because a suspended laptop and a throttled background tab both stop timers —
 * and the hour spent asleep is exactly the one a lock is there for.
 */
export function useIdleTimeout(
  idleMs: number,
  isEnabled: boolean,
  onIdle: () => void,
): void {
  const lastActivityAt = useRef(Date.now());
  const reportIdle = useEffectEvent(onIdle);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    lastActivityAt.current = Date.now();

    const markActive = () => {
      lastActivityAt.current = Date.now();
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, markActive, { passive: true });
    }

    const check = setInterval(() => {
      if (Date.now() - lastActivityAt.current >= idleMs) {
        reportIdle();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      clearInterval(check);

      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, markActive);
      }
    };
  }, [idleMs, isEnabled]);
}
