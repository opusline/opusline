import type {
  DateFormat,
  InvoiceForecastBucket,
  InvoiceOverdueData,
  InvoiceTodoBudgetData,
  InvoiceTodoOverdueData,
  InvoiceTodoWorkData,
  InvoiceTotalData,
  Locale,
} from "@opusline/api-client";
import { formatWholeAmount, type MoneyFormat } from "@/lib/billing";
import {
  cachedDateFormatter,
  calendarDateNumericLabel,
  fromCalendarDate,
} from "@/lib/dates";
import { billedQuantityLabel, formatWorkedDays } from "@/lib/durations";
import { budgetShareFigure } from "@/lib/fixed-price-budget";
import { m } from "@/paraglide/messages.js";

export function openInvoicesLabel(toCollect: InvoiceTotalData): string {
  return toCollect.count === 0
    ? m.invoices_none_pending()
    : m.invoices_open_count({ count: toCollect.count });
}

/** "3 échues · jusqu'à 147 j" — the count, then the one that has waited longest. */
export function overdueLabel(overdue: InvoiceOverdueData): string {
  return overdue.count === 0
    ? m.invoices_no_overdue()
    : m.invoices_overdue_up_to({
        count: overdue.count,
        days: overdue.maxDaysLate,
      });
}

const INVOICE_FORECAST_BUCKET_MESSAGES: Record<
  InvoiceForecastBucket,
  () => string
> = {
  1: m.invoices_forecast_bucket_first,
  2: m.invoices_forecast_bucket_second,
};

export function invoiceForecastBucketLabel(
  bucket: InvoiceForecastBucket,
): string {
  return INVOICE_FORECAST_BUCKET_MESSAGES[bucket]();
}

export function periodsLabel(monthUnbilled: InvoiceTotalData): string {
  return monthUnbilled.count === 0
    ? m.invoices_periods_none()
    : m.invoices_periods_count({ count: monthUnbilled.count });
}

/** "3 j sur Orvella front" — what would be billed, and on what. */
export function unbilledWorkTitle(
  locale: Locale,
  work: InvoiceTodoWorkData,
): string {
  const quantity = billedQuantityLabel(locale, work);

  return quantity === null
    ? work.missionName
    : m.invoices_unbilled_work_title({
        quantity,
        missionName: work.missionName,
      });
}

const DAY_AND_MONTH: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "long",
};

/**
 * "Entrées du 03 au 07 août" — the span the invoice would cover. A single day says
 * so rather than repeating itself, and a span that crosses months names both:
 * "du 31 au 13 août" reads as a typo.
 */
export function unbilledWorkDetail(
  locale: Locale,
  work: InvoiceTodoWorkData,
): string {
  const dayAndMonth = cachedDateFormatter(locale, DAY_AND_MONTH);
  const first = fromCalendarDate(work.firstEntryOn);
  const last = fromCalendarDate(work.lastEntryOn);
  const lastLabel = dayAndMonth.format(last);

  if (work.firstEntryOn === work.lastEntryOn) {
    return m.invoices_entries_on({ date: lastLabel });
  }

  // The bare-day contraction ("du 03 au 07 août") is a day-first idiom;
  // other locales spell both ends out.
  const firstLabel =
    locale === "fr-FR" && first.getMonth() === last.getMonth()
      ? String(first.getDate()).padStart(2, "0")
      : dayAndMonth.format(first);

  return m.invoices_entries_range({ first: firstLabel, last: lastLabel });
}

/** "Échue le 30/06/2026 · 41 j de retard". */
export function overdueDetail(
  dateFormat: DateFormat,
  overdue: InvoiceTodoOverdueData,
): string {
  return m.invoices_overdue_detail({
    date: calendarDateNumericLabel(dateFormat, overdue.dueOn),
    days: overdue.daysLate,
  });
}

/** "HartPrint refonte boutique · forfait consommé à 86 %" */
export function budgetRowTitle(
  locale: Locale,
  budget: InvoiceTodoBudgetData,
): string {
  const { consumption } = budget.budget;

  return m.invoices_todo_budget_title({
    mission: budget.missionName,
    share:
      consumption === null
        ? "—"
        : budgetShareFigure(locale, consumption.consumedShareBp),
  });
}

/**
 * What the forfait row states under its title: the runway left before the price is
 * eaten, or once it is, what the overrun costs.
 */
export function budgetRowDetail(
  format: MoneyFormat,
  budget: InvoiceTodoBudgetData,
): string {
  const { consumption } = budget.budget;

  if (consumption !== null && consumption.state === 2) {
    return m.invoices_todo_budget_exceeded_detail({
      consumed: formatWholeAmount(format, consumption.consumed.amount),
      forfait: formatWholeAmount(format, budget.budget.forfait.amount),
      over: formatWorkedDays(format.locale, -consumption.remainingDays),
    });
  }

  return m.invoices_todo_budget_detail({
    remaining:
      consumption === null
        ? "—"
        : formatWorkedDays(format.locale, consumption.remainingDays),
  });
}
