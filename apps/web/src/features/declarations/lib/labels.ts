import type { Locale, UrssafPeriodicity } from "@opusline/api-client";

import { cachedDateFormatter, fromCalendarDate } from "@/lib/dates";
import { monthStart } from "@/lib/months";
import { periodKind, periodTitle } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

const URSSAF_BADGE_MESSAGES: Record<UrssafPeriodicity, () => string> = {
  0: m.declarations_urssaf_badge_monthly,
  1: m.declarations_urssaf_badge_quarterly,
};

export function urssafBadgeLabel(periodicity: UrssafPeriodicity): string {
  return URSSAF_BADGE_MESSAGES[periodicity]();
}

/**
 * « juillet » for a month — the card titles carry no year, the way the design
 * writes them, which is why neither `monthTitle` nor `capitalizedMonthLabel`
 * fits — and the shared « T2 2026 » for a quarter, where the year disambiguates.
 */
export function declarationPeriodLabel(locale: Locale, period: string): string {
  if (periodKind(period) === "month") {
    return cachedDateFormatter(locale, { month: "long" }).format(
      fromCalendarDate(monthStart(period)),
    );
  }

  return periodTitle(locale, period);
}

/** What the copy button puts on the clipboard: whole euros, no spaces, no cents — what the forms expect. */
export function declarationCopyValue(amountCents: number): string {
  return String(Math.round(amountCents / 100));
}

/**
 * The 3310-CA3 has one « TVA brute » line per rate, so the box depends on the
 * rate the month was billed at. Métropole only — the DOM lines (10, 11) would
 * need the establishment's territory, which the account does not carry.
 */
const CA3_RATE_LINES: Record<number, { box: string; label: () => string }> = {
  2000: { box: "08", label: m.declarations_ca3_line_08 },
  1000: { box: "9B", label: m.declarations_ca3_line_9b },
  550: { box: "09", label: m.declarations_ca3_line_09 },
};

/** Null when the month mixes rates, or sits on a rate with no métropole line. */
export function ca3RateLine(
  rateBp: number | null,
): { box: string; label: string } | null {
  const line = rateBp === null ? undefined : CA3_RATE_LINES[rateBp];

  return line === undefined ? null : { box: line.box, label: line.label() };
}
