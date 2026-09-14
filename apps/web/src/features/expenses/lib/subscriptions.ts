import type {
  Locale,
  SubscriptionData,
  SubscriptionOccurrenceData,
  SubscriptionOccurrenceState,
  SubscriptionPeriodicity,
} from "@opusline/api-client";
import type { Badge } from "@opusline/ui/components/badge";
import type { ComponentProps } from "react";

import {
  formatAmountWithCents,
  formatPercentFromBp,
  type MoneyFormat,
} from "@/lib/billing";
import { cachedDateFormatter, fromCalendarDate } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { expenseRateLabel, monthName } from "./labels";

export const SUBSCRIPTION_PERIODICITIES: readonly SubscriptionPeriodicity[] = [
  0, 1, 2,
];

const PERIODICITY_MESSAGES: Record<SubscriptionPeriodicity, () => string> = {
  0: m.subscription_periodicity_monthly,
  1: m.subscription_periodicity_quarterly,
  2: m.subscription_periodicity_annual,
};

export function subscriptionPeriodicityLabel(
  periodicity: SubscriptionPeriodicity,
): string {
  return PERIODICITY_MESSAGES[periodicity]();
}

// The segmented control has room for « Trim. » where the column says « trimestriel ».
const PERIODICITY_SHORT_MESSAGES: Record<
  SubscriptionPeriodicity,
  () => string
> = {
  0: m.subscription_periodicity_monthly_short,
  1: m.subscription_periodicity_quarterly_short,
  2: m.subscription_periodicity_annual_short,
};

export function subscriptionPeriodicityShortLabel(
  periodicity: SubscriptionPeriodicity,
): string {
  return PERIODICITY_SHORT_MESSAGES[periodicity]();
}

const OCCURRENCES_PER_YEAR: Record<SubscriptionPeriodicity, number> = {
  0: 12,
  1: 4,
  2: 1,
};

export function occurrencesPerYear(
  periodicity: SubscriptionPeriodicity,
): number {
  return OCCURRENCES_PER_YEAR[periodicity];
}

const MONTH_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

/** A `YYYY-MM` key for a month number; the year only fixes the formatter. */
function monthKey(month: number): string {
  return `2026-${String(month).padStart(2, "0")}`;
}

/** « le 20 » for a monthly or quarterly debit, « le 15 janv. » for an annual one. */
export function debitDayLabel(
  locale: Locale,
  subscription: Pick<SubscriptionData, "debitDay" | "debitMonth">,
): string {
  if (subscription.debitMonth === null) {
    return m.subscriptions_debit_day({ day: subscription.debitDay });
  }

  return m.subscriptions_debit_day_month({
    day: subscription.debitDay,
    month: cachedDateFormatter(locale, { month: "short" }).format(
      fromCalendarDate(`${monthKey(subscription.debitMonth)}-01`),
    ),
  });
}

export function monthOptions(
  locale: Locale,
): { value: number; label: string }[] {
  return MONTH_NUMBERS.map((month) => ({
    value: month,
    label: monthName(locale, monthKey(month)),
  }));
}

/** The TVA cell's second line: the rate, then the pro share of it when partial. */
export function subscriptionRegimeLabel(
  locale: Locale,
  format: MoneyFormat,
  subscription: SubscriptionData,
): string {
  const rate = expenseRateLabel(locale, subscription);

  if (subscription.proShareBp === 10_000 || subscription.vat.amount === 0) {
    return rate;
  }

  return m.subscriptions_regime_share({
    rate,
    share: m.common_percent({
      value: formatPercentFromBp(locale, subscription.proShareBp),
    }),
    amount: formatAmountWithCents(format, subscription.vat.amount),
  });
}

export type SubscriptionStatus = "active" | "paused" | "cancelled";

export function subscriptionStatus(
  subscription: Pick<SubscriptionData, "isPaused" | "cancelledOn">,
): SubscriptionStatus {
  if (subscription.cancelledOn !== null) {
    return "cancelled";
  }

  return subscription.isPaused ? "paused" : "active";
}

export type SubscriptionStatusPresentation = {
  label: string;
  variant: NonNullable<ComponentProps<typeof Badge>["variant"]>;
};

// An active subscription shows no pill: the table reads quieter without it.
const STATUS_PRESENTATIONS: Record<
  Exclude<SubscriptionStatus, "active">,
  () => SubscriptionStatusPresentation
> = {
  paused: () => ({
    label: m.subscription_status_paused(),
    variant: "attention",
  }),
  cancelled: () => ({
    label: m.subscription_status_cancelled(),
    variant: "quiet",
  }),
};

export function subscriptionStatusPresentation(
  status: Exclude<SubscriptionStatus, "active">,
): SubscriptionStatusPresentation {
  return STATUS_PRESENTATIONS[status]();
}

const OCCURRENCE_STATE_MESSAGES: Record<
  SubscriptionOccurrenceState,
  () => string
> = {
  0: m.occurrence_state_linked,
  1: m.occurrence_state_missing,
  2: m.occurrence_state_future,
  3: m.occurrence_state_paused,
  4: m.occurrence_state_inactive,
};

export function occurrenceStateLabel(
  state: SubscriptionOccurrenceState,
): string {
  return OCCURRENCE_STATE_MESSAGES[state]();
}

/** The period key is a month, a quarter or a year; the debit day always names a month. */
export function occurrenceMonth(
  occurrence: Pick<SubscriptionOccurrenceData, "debitOn">,
): string {
  return occurrence.debitOn.slice(0, 7);
}
