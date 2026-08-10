import { formatWorkedTime } from "@/lib/durations";

/** Quick replacements offered when a forgotten timer has to be corrected. */
const QUICK_MINUTES = [60, 120, 240];

/**
 * A timer running longer than a full working day was almost certainly left on
 * overnight rather than worked straight through. That is the line the design's
 * own quick-fixes stop at, and it is the only "how long is a day" the app
 * knows — the user's own `workdayMinutes`.
 */
export function isLongRun(
  elapsedSeconds: number,
  workdayMinutes: number,
): boolean {
  return elapsedSeconds / 60 > workdayMinutes;
}

/** "13 h" — whole hours, because the point is the order of magnitude. */
export function longRunHours(elapsedSeconds: number): string {
  return `${Math.floor(elapsedSeconds / 3600)} h`;
}

/**
 * The durations offered as one-click replacements: a few short sittings plus a
 * full day, deduplicated in case the workday is itself one of them.
 */
export function quickDurations(workdayMinutes: number): number[] {
  return [...new Set([...QUICK_MINUTES, workdayMinutes])]
    .filter((minutes) => minutes > 0)
    .sort((left, right) => left - right);
}

export function quickDurationLabel(minutes: number): string {
  return formatWorkedTime(minutes);
}
