import type { TimerData, TimerState } from "@opusline/api-client";

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

export function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);

  return [hours, minutes, safe % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

const startedAtTime = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatStartedAt(instant: string): string {
  return startedAtTime.format(new Date(instant));
}
