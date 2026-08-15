import type { DateFormat, Locale } from "@opusline/api-client";

const dateFormatters = new Map<string, Intl.DateTimeFormat>();

/** Mirror of billing's cachedFormatter — one Intl instance per locale+options. */
export function cachedDateFormatter(
  locale: Locale,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = dateFormatters.get(key);

  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat(locale, options);
    dateFormatters.set(key, formatter);
  }

  return formatter;
}

const MONTH_YEAR: Intl.DateTimeFormatOptions = {
  month: "long",
  year: "numeric",
};

const FULL_DATE: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

// Invoice screens date everything numerically: an amount and a date sit on the
// same dense row, and "30 juin 2026" pushes the row wider than the column.
// Deliberately NOT locale-driven: the digit order is the user's explicit
// DateFormat choice (day-first or ISO), and fr-FR anchors dd/MM/yyyy whatever
// language the interface speaks.
const numericDate = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function monthYearLabel(locale: Locale, instant: string): string {
  return cachedDateFormatter(locale, MONTH_YEAR).format(new Date(instant));
}

export function fullDateLabel(locale: Locale, instant: string): string {
  return cachedDateFormatter(locale, FULL_DATE).format(new Date(instant));
}

/**
 * `Y-m-d` payloads carry no timezone, so `new Date()` reads them as UTC
 * midnight — which renders as the day before anywhere west of Greenwich.
 * Building the date from its parts keeps it on the calendar day the API meant.
 */
const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * `new Date(y, m, d)` maps years 0–99 onto 1900–1999, so the year is always set
 * explicitly — otherwise `0026-01-04` silently becomes 1926.
 */
export function localDate(year: number, month: number, day: number): Date {
  const built = new Date(year, month - 1, day);
  built.setFullYear(year);

  return built;
}

export function fromCalendarDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);

  return localDate(year, month, day);
}

/** `Y-m-d` in, `Y-m-d` out — the only place day arithmetic happens. */
export function addCalendarDays(date: string, days: number): string {
  const shifted = fromCalendarDate(date);
  shifted.setDate(shifted.getDate() + days);

  return toCalendarDate(shifted);
}

/** A real `Y-m-d`, not just a well-shaped one: rejects 2026-02-31. */
export function isCalendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !CALENDAR_DATE.test(value)) {
    return false;
  }

  return toCalendarDate(fromCalendarDate(value)) === value;
}

/** The mirror of {@link fromCalendarDate}: a local `Date` back to `Y-m-d`. */
export function toCalendarDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

export function calendarMonthYearLabel(locale: Locale, date: string): string {
  return cachedDateFormatter(locale, MONTH_YEAR).format(fromCalendarDate(date));
}

/** "Août 2026" — a month used as a heading rather than inside a sentence. */
export function capitalizedMonthLabel(locale: Locale, date: string): string {
  const label = calendarMonthYearLabel(locale, date);

  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * The user's chosen numeric layout: 0 → "31/08/2026", 1 → "2026-08-31" (the
 * calendar-date payload IS the ISO layout, so it passes through verbatim).
 * The digit order is this explicit preference, never a locale artifact.
 */
export function calendarDateNumericLabel(
  dateFormat: DateFormat,
  date: string,
): string {
  return dateFormat === 1 ? date : numericDate.format(fromCalendarDate(date));
}

/** Whole days between two `Y-m-d`, ignoring clocks and timezones. */
export function calendarDaysBetween(from: string, to: string): number {
  const DAY_MS = 24 * 60 * 60 * 1000;

  return Math.round(
    (fromCalendarDate(to).getTime() - fromCalendarDate(from).getTime()) /
      DAY_MS,
  );
}

/** Monday = 1 … Sunday = 7, unlike `Date#getDay` where Sunday is 0. */
export function isoDayOfWeek(date: Date): number {
  return date.getDay() === 0 ? 7 : date.getDay();
}

export function calendarDateLabel(locale: Locale, date: string): string {
  return cachedDateFormatter(locale, FULL_DATE).format(fromCalendarDate(date));
}

/**
 * Tracking surfaces date against the browser's calendar — where the user
 * physically is. Anything the API's fiscal rules judge (payments, reminders,
 * dates shown beside `isLate`) uses accountTodayCalendarDate instead.
 */
export function browserTodayCalendarDate(): string {
  return toCalendarDate(new Date());
}

const accountTodayFormatters = new Map<string, Intl.DateTimeFormat>();

/**
 * Today in the account's timezone — the date the API's fiscal rules judge
 * against. Payment and reminder dates must use this, not the browser's
 * calendar: a browser east of the account would otherwise offer a date the
 * API refuses as "in the future" for part of every day.
 */
export function accountTodayCalendarDate(timezone: string): string {
  let formatter = accountTodayFormatters.get(timezone);

  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    accountTodayFormatters.set(timezone, formatter);
  }

  const parts = new Map(
    formatter.formatToParts(new Date()).map((part) => [part.type, part.value]),
  );

  return `${parts.get("year")}-${parts.get("month")}-${parts.get("day")}`;
}

/**
 * "01/06/2026 – 30/06/2026" for a span, the single date when both ends match, and
 * null when there is no period to show.
 */
export function calendarRangeLabel(
  dateFormat: DateFormat,
  from: string | null,
  to: string | null,
): string | null {
  if (from === null) {
    return to === null ? null : calendarDateNumericLabel(dateFormat, to);
  }

  if (to === null || from === to) {
    return calendarDateNumericLabel(dateFormat, from);
  }

  return `${calendarDateNumericLabel(dateFormat, from)} – ${calendarDateNumericLabel(dateFormat, to)}`;
}
