import {
  addCalendarDays,
  calendarDaysBetween,
  capitalizedMonthLabel,
  fromCalendarDate,
  isoDayOfWeek,
  localDate,
  toCalendarDate,
} from "./dates";

/**
 * Calendar-month arithmetic, `Y-m` in and `Y-m-d` out. The sibling of `weeks.ts`, and
 * held to the same rule: `Date` is only ever an internal intermediate, always built
 * through `localDate` so a month boundary never drifts across a timezone.
 *
 * `Y-m` is the API's own vocabulary for a month — `CraData.month`, the `?month=` filter
 * and the invoice summaries all speak it.
 */

const MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

/** The two numbers behind a `2026-07`, or a throw — never a silent fallback. */
function parseMonth(month: string): { year: number; month: number } {
  const match = MONTH_PATTERN.exec(month);

  if (match === null) {
    throw new Error(`Not a month: ${month}`);
  }

  return { month: Number(match[2]), year: Number(match[1]) };
}

/** The first day of the month, as `Y-m-d`. */
export function monthStart(month: string): string {
  const parsed = parseMonth(month);

  return toCalendarDate(localDate(parsed.year, parsed.month, 1));
}

/** The last day of the month, as `Y-m-d`. */
export function monthEnd(month: string): string {
  const parsed = parseMonth(month);

  // Day 0 of the following month is the last day of this one, which sidesteps
  // leap years and the 30/31 split entirely.
  return toCalendarDate(localDate(parsed.year, parsed.month + 1, 0));
}

/** Every `Y-m-d` in the month, in order. */
export function monthDates(month: string): string[] {
  const first = monthStart(month);
  const length = fromCalendarDate(monthEnd(month)).getDate();

  return Array.from({ length }, (_, index) => addCalendarDays(first, index));
}

/**
 * The dates a calendar grid draws: whole weeks, Monday first, padded at both ends so
 * the month starts under the right weekday. Five rows for most months, six when a long
 * month opens on a weekend.
 */
export function monthGridDates(month: string): string[] {
  const first = fromCalendarDate(monthStart(month));
  const last = fromCalendarDate(monthEnd(month));

  const start = addCalendarDays(toCalendarDate(first), 1 - isoDayOfWeek(first));
  const end = addCalendarDays(toCalendarDate(last), 7 - isoDayOfWeek(last));
  const length = calendarDaysBetween(start, end) + 1;

  return Array.from({ length }, (_, index) => addCalendarDays(start, index));
}

/** "Juillet 2026" — a page title, so it carries its capital. */
export function monthTitle(month: string): string {
  return capitalizedMonthLabel(monthStart(month));
}
