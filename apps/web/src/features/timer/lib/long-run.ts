import { formatWorkedTime, parseDuration } from "@/lib/durations";

const QUICK_MINUTES = [60, 120, 240];

/**
 * A full working day is the threshold because it is the longest anyone plausibly
 * works in one sitting, and it is the only "length of a day" the app knows.
 */
export function isLongRun(
  elapsedSeconds: number,
  workdayMinutes: number,
): boolean {
  return elapsedSeconds / 60 > workdayMinutes;
}

export function longRunHours(elapsedSeconds: number): string {
  return `${Math.floor(elapsedSeconds / 3600)} h`;
}

export function quickDurations(workdayMinutes: number): number[] {
  return [...new Set([...QUICK_MINUTES, workdayMinutes])]
    .filter((minutes) => minutes > 0)
    .sort((left, right) => left - right);
}

export function quickDurationLabel(minutes: number): string {
  return formatWorkedTime(minutes);
}

/**
 * Reads as hours ("3:30", "3h30", "3") even on a day-billed mission, where a
 * bare number would otherwise mean days — the field asks how long was actually
 * worked, not how much of a day it counts for.
 */
export function parseWorkedDuration(
  draft: string,
  workdayMinutes: number,
): number | null {
  const parsed = parseDuration(draft, { billingMode: 1, workdayMinutes });

  return parsed.kind === "minutes" ? parsed.minutes : null;
}
