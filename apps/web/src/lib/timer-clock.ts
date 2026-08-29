import { createContext, use } from "react";

/**
 * The 1 Hz face of the running timer, kept out of the timer feature's main
 * context on purpose: the tick re-renders only the few leaves that show a
 * moving figure (the header chip's clock, the live week cell, the open
 * popovers), never every consumer of the timer context.
 *
 * It lives in lib rather than the timer feature because the week grid's live
 * pill reads it too, and features do not import each other; the timer
 * feature's TimerProvider is what actually drives it.
 */
export type TimerClock = {
  elapsedSeconds: number;
};

export const STOPPED_TIMER_CLOCK: TimerClock = {
  elapsedSeconds: 0,
};

/**
 * Defaulted rather than throwing so a story or unit test can render a clock
 * consumer bare; the app always mounts the provider via TimerProvider.
 */
export const TimerClockContext = createContext<TimerClock>(STOPPED_TIMER_CLOCK);

export function useTimerClock(): TimerClock {
  return use(TimerClockContext);
}

export function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);

  return [hours, minutes, safe % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}
