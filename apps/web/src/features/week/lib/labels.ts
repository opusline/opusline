import type { BillingMode, Locale } from "@opusline/api-client";

import { type DurationInvalidReason, isHourly } from "@/lib/durations";
import { weekdayDateLabel } from "@/lib/weeks";
import { m } from "@/paraglide/messages.js";

export function durationUnitHint(billingMode: BillingMode): string {
  return isHourly(billingMode)
    ? m.week_duration_unit_hint_hourly()
    : m.week_duration_unit_hint_daily();
}

/** Exhaustive on purpose: a new parse reason must not silently read as a typo. */
export function durationErrorHint(reason: DurationInvalidReason): string {
  switch (reason) {
    case "range":
      return m.week_duration_range_hint();
    case "format":
      return m.week_duration_format_hint();
  }
}

export function cellAriaLabel(input: {
  locale: Locale;
  missionName: string;
  date: string | null;
  billedLabel: string;
  note: string | null;
  isEmpty: boolean;
  isUninvoiced: boolean;
}): string {
  if (input.date === null) {
    return m.week_weekend_collapsed();
  }

  const day = weekdayDateLabel(input.locale, input.date);

  if (input.isEmpty) {
    return m.week_cell_empty_label({ mission: input.missionName, day });
  }

  const note = input.note === null ? "" : `, ${input.note}`;
  const invoicing = input.isUninvoiced ? `, ${m.week_uninvoiced_marker()}` : "";

  return m.week_cell_label({
    mission: input.missionName,
    day,
    value: `${input.billedLabel}${note}${invoicing}`,
  });
}

export function liveCellLabel(isRunning: boolean, clock: string): string {
  return `${isRunning ? m.week_live_running() : m.week_live_paused()} · ${clock}`;
}

export function weekendToggleLabel(weekendShown: boolean): string {
  return weekendShown ? m.week_weekend_hide() : m.week_weekend_show();
}
