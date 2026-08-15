import type { Locale } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";
import {
  addCalendarDays,
  cachedDateFormatter,
  capitalizeFirst,
  fromCalendarDate,
  isoDayOfWeek,
  localDate,
  toCalendarDate,
} from "./dates";

/**
 * ISO-8601 week arithmetic, `Y-m-d` in and `Y-m-d` out. `Date` is only ever an
 * internal intermediate, always built through `fromCalendarDate` so a calendar
 * day never drifts across a timezone.
 */

const ISO_WEEK_PATTERN = /^(\d{4})-W(\d{2})$/;

/* A week outside this is a malformed URL, not a week anyone tracked time in. */
const EARLIEST_YEAR = 1970;
const LATEST_YEAR = 2999;

const WEEKDAY_SHORT: Intl.DateTimeFormatOptions = { weekday: "short" };

// Abbreviated: the range sits next to a 24px title and must not wrap.
const DAY_MONTH_YEAR: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

const WEEKDAY_DAY_MONTH: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  weekday: "long",
};

const SHORT_WEEKDAY_DATE: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  weekday: "short",
  year: "numeric",
};

/** The two numbers behind a `2026-W31`, or a throw — never a silent fallback. */
function parseIsoWeek(week: string): { year: number; week: number } {
  const match = ISO_WEEK_PATTERN.exec(week);

  if (match === null) {
    throw new Error(`Not an ISO week: ${week}`);
  }

  return { week: Number(match[2]), year: Number(match[1]) };
}

function addDays(date: Date, days: number): Date {
  return fromCalendarDate(addCalendarDays(toCalendarDate(date), days));
}

/** The Thursday of a date's ISO week — it alone decides the week's year. */
function isoThursday(date: Date): Date {
  return addDays(date, 4 - isoDayOfWeek(date));
}

function formatIsoWeek(year: number, week: number): string {
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function isoWeekOf(date: string): string {
  const thursday = isoThursday(fromCalendarDate(date));
  const firstOfYear = localDate(thursday.getFullYear(), 1, 1);
  const dayIndex = Math.round(
    (thursday.getTime() - firstOfYear.getTime()) / 86_400_000,
  );

  return formatIsoWeek(thursday.getFullYear(), Math.floor(dayIndex / 7) + 1);
}

/** December 28 always falls in the last ISO week, whatever the year's shape. */
function isoWeeksInYear(year: number): number {
  return parseIsoWeek(isoWeekOf(`${year}-12-28`)).week;
}

export function isIsoWeek(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const match = ISO_WEEK_PATTERN.exec(value);

  if (match === null) {
    return false;
  }

  const year = Number(match[1]);

  if (year < EARLIEST_YEAR || year > LATEST_YEAR) {
    return false;
  }

  const week = Number(match[2]);

  return week >= 1 && week <= isoWeeksInYear(year);
}

/** The Monday of the week, as `Y-m-d`. */
export function isoWeekStart(week: string): string {
  const parsed = parseIsoWeek(week);

  // January 4 is in week 1 by definition, so it anchors the whole year.
  const january4 = localDate(parsed.year, 1, 4);
  const firstMonday = addDays(january4, 1 - isoDayOfWeek(january4));

  return toCalendarDate(addDays(firstMonday, (parsed.week - 1) * 7));
}

/** The seven `Y-m-d` of the week, Monday first. */
export function isoWeekDates(week: string): string[] {
  const monday = fromCalendarDate(isoWeekStart(week));

  return Array.from({ length: 7 }, (_, index) =>
    toCalendarDate(addDays(monday, index)),
  );
}

/** The Monday and Sunday bounding a week, as the API's `from`/`to`. */
export function isoWeekRange(week: string): { from: string; to: string } {
  const dates = isoWeekDates(week);

  return { from: dates[0], to: dates[6] };
}

export function shiftIsoWeek(week: string, delta: number): string {
  return isoWeekOf(
    toCalendarDate(addDays(fromCalendarDate(isoWeekStart(week)), delta * 7)),
  );
}

export function isoWeekTitle(week: string): string {
  return m.week_title({ number: parseIsoWeek(week).week });
}

/**
 * "27 juillet – 2 août 2026". `formatRange` collapses whatever the two ends
 * share, so the same call covers weeks inside a month, across two months and
 * across a year change.
 */
export function isoWeekRangeLabel(locale: Locale, week: string): string {
  const dates = isoWeekDates(week);

  return cachedDateFormatter(locale, DAY_MONTH_YEAR).formatRange(
    fromCalendarDate(dates[0]),
    fromCalendarDate(dates[6]),
  );
}

/** "lun" — the `.eyebrow` style supplies the uppercase. */
export function weekdayShortLabel(locale: Locale, date: string): string {
  return cachedDateFormatter(locale, WEEKDAY_SHORT)
    .format(fromCalendarDate(date))
    .replace(/\.$/, "");
}

/** "lundi 27 juillet", for cell labels read out by a screen reader. */
export function weekdayDateLabel(locale: Locale, date: string): string {
  return cachedDateFormatter(locale, WEEKDAY_DAY_MONTH).format(
    fromCalendarDate(date),
  );
}

/**
 * "Jeu 30 juil. 2026" — the app's own rendering of a date, next to a native
 * date input whose format follows the browser's locale rather than ours.
 */
export function shortDateLabel(locale: Locale, date: string): string {
  const formatted = cachedDateFormatter(locale, SHORT_WEEKDAY_DATE)
    .format(fromCalendarDate(date))
    // Only the weekday's abbreviation period; the month keeps its own.
    .replace(".", "");

  return capitalizeFirst(formatted);
}
