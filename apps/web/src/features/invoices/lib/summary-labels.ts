import type {
  DateFormat,
  InvoiceForecastBucket,
  InvoiceOverdueData,
  InvoiceTodoOverdueData,
  InvoiceTodoWorkData,
  InvoiceTotalData,
  Locale,
} from "@opusline/api-client";
import { calendarDateNumericLabel, fromCalendarDate } from "@/lib/dates";
import { formatBilledDays, formatBilledHours } from "@/lib/durations";

export function openInvoicesLabel(toCollect: InvoiceTotalData): string {
  if (toCollect.count === 0) {
    return "rien en attente";
  }

  return toCollect.count === 1
    ? "1 facture ouverte"
    : `${toCollect.count} factures ouvertes`;
}

/** "3 échues · jusqu'à 147 j" — the count, then the one that has waited longest. */
export function overdueLabel(overdue: InvoiceOverdueData): string {
  if (overdue.count === 0) {
    return "aucune échéance dépassée";
  }

  const due = overdue.count === 1 ? "1 échue" : `${overdue.count} échues`;

  return `${due} · jusqu'à ${overdue.maxDaysLate} j`;
}

export const INVOICE_FORECAST_BUCKET_LABELS: Record<
  InvoiceForecastBucket,
  string
> = {
  1: "0 – 30 j",
  2: "31 – 60 j",
};

export function periodsLabel(monthUnbilled: InvoiceTotalData): string {
  if (monthUnbilled.count === 0) {
    return "rien en attente de facture";
  }

  return monthUnbilled.count === 1
    ? "1 période en attente de facture"
    : `${monthUnbilled.count} périodes en attente de facture`;
}

/**
 * How much work a row would bill, in the mission's own unit. Exactly one of the two
 * quantities is set, decided by how the mission bills.
 */
function quantityLabel(
  locale: Locale,
  work: InvoiceTodoWorkData,
): string | null {
  if (work.valuedDays !== null) {
    return formatBilledDays(locale, work.valuedDays);
  }

  return work.valuedMinutes === null
    ? null
    : formatBilledHours(locale, work.valuedMinutes);
}

/** "3 j sur OGF front" — what would be billed, and on what. */
export function unbilledWorkTitle(
  locale: Locale,
  work: InvoiceTodoWorkData,
): string {
  const quantity = quantityLabel(locale, work);

  return quantity === null
    ? work.missionName
    : `${quantity} sur ${work.missionName}`;
}

const dayAndMonth = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
});

/**
 * "Entrées du 03 au 07 août" — the span the invoice would cover. A single day says
 * so rather than repeating itself, and a span that crosses months names both:
 * "du 31 au 13 août" reads as a typo.
 */
export function unbilledWorkDetail(work: InvoiceTodoWorkData): string {
  const first = fromCalendarDate(work.firstEntryOn);
  const last = fromCalendarDate(work.lastEntryOn);
  const lastLabel = dayAndMonth.format(last);

  if (work.firstEntryOn === work.lastEntryOn) {
    return `Entrées du ${lastLabel}`;
  }

  const firstLabel =
    first.getMonth() === last.getMonth()
      ? String(first.getDate()).padStart(2, "0")
      : dayAndMonth.format(first);

  return `Entrées du ${firstLabel} au ${lastLabel}`;
}

/** "Échue le 30/06/2026 · 41 j de retard". */
export function overdueDetail(
  dateFormat: DateFormat,
  overdue: InvoiceTodoOverdueData,
): string {
  return `Échue le ${calendarDateNumericLabel(dateFormat, overdue.dueOn)} · ${overdue.daysLate} j de retard`;
}
