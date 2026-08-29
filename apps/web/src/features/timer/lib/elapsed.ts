import type { Locale, TimerData, TimerState } from "@opusline/api-client";

import { cachedDateFormatter } from "@/lib/dates";

export function isRunning(state: TimerState): boolean {
  return state === 0;
}

export function displayedElapsedSeconds(
  timer: TimerData,
  receivedAt: number,
  now: number,
): number {
  if (!isRunning(timer.state)) {
    return timer.elapsedSeconds;
  }

  const drift = Math.max(0, Math.floor((now - receivedAt) / 1000));

  return timer.elapsedSeconds + drift;
}

const STARTED_AT_TIME: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

export function formatStartedAt(locale: Locale, instant: string): string {
  return cachedDateFormatter(locale, STARTED_AT_TIME).format(new Date(instant));
}
