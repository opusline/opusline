import type { CraDayData, Locale } from "@opusline/api-client";

import { formatBilledDays } from "@/lib/durations";
import { weekdayDateLabel } from "@/lib/weeks";
import { m } from "@/paraglide/messages.js";

import { FULL_DAY_BP } from "./day-fraction";

/** The repo's eyebrow: a small caps label above a group. */
export const EYEBROW =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

/** "2,5 j" — a day count, in the unit the whole app uses for days. */
export const daysLabel = formatBilledDays;

/** "−0,5 j par rapport au temps suivi" — why the day count is being questioned. */
export function checkDaysDrift(locale: Locale, days: number): string {
  return m.cra_days_drift({ difference: differenceLabel(locale, days) });
}

/** The écart, signed, so a shortfall and a surplus do not read alike. */
export function differenceLabel(locale: Locale, days: number): string {
  if (days === 0) {
    return m.cra_nothing();
  }

  const formatted = daysLabel(locale, Math.abs(days));

  return days > 0 ? `+${formatted}` : `−${formatted}`;
}

/** The tile's value: how many days nobody was expected to work but which carry time. */
export function offDaysWorkedLabel(count: number): string {
  if (count === 0) {
    return m.cra_nothing();
  }

  return m.cra_off_days_count({ count });
}

/**
 * The line under the month: who it is for, on what, and where the grid came from.
 * The client leads because that is who signs it.
 */
export function craSubtitle(
  clientName: string,
  isIntermediary: boolean,
  missionName: string,
  isDirty: boolean,
): string {
  const client = isIntermediary ? `${clientName} (ESN)` : clientName;
  const origin = isDirty ? m.cra_origin_dirty() : m.cra_origin_prefilled();

  return `${client} · ${missionName} · ${origin}`;
}

/** What the calendar's header says the grid currently reports. */
export function reportedAgainstTrackedLabel(
  locale: Locale,
  reported: number,
  tracked: number,
): string {
  if (reported === tracked) {
    return m.cra_reported_matching({ days: daysLabel(locale, reported) });
  }

  return m.cra_reported_against({
    reported: daysLabel(locale, reported),
    tracked: daysLabel(locale, tracked),
  });
}

/**
 * What a screen reader hears on a day cell: the date, then what it reports, then why
 * it is greyed when it is.
 */
export function cellAriaLabel(locale: Locale, day: CraDayData): string {
  // The weekday, not just the date: in a calendar grid it is what tells you which
  // column you have landed in.
  const date = weekdayDateLabel(locale, day.date);
  const worked =
    day.dayFractionBp > 0
      ? daysLabel(locale, day.dayFractionBp / FULL_DAY_BP)
      : m.cra_no_day();

  if (day.isHoliday) {
    return `${date}, ${day.holidayName ?? m.cra_holiday_fallback()}, ${worked}`;
  }

  if (day.isWeekend) {
    return `${date}, ${m.cra_weekend()}, ${worked}`;
  }

  return `${date}, ${worked}`;
}
