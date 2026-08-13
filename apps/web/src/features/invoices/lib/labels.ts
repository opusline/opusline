import type { InvoiceData } from "@opusline/api-client";

import {
  calendarDateNumericLabel,
  calendarDaysBetween,
  calendarMonthYearLabel,
  todayCalendarDate,
} from "@/lib/dates";

/** "Juin 2026" — the period an invoice covers, capitalised as a label. */
function periodLabel(invoice: InvoiceData): string | null {
  if (invoice.periodStart === null) {
    return null;
  }

  const month = calendarMonthYearLabel(invoice.periodStart);

  return month.charAt(0).toUpperCase() + month.slice(1);
}

export function daysToPay(invoice: InvoiceData): number | null {
  return invoice.paidOn === null
    ? null
    : calendarDaysBetween(invoice.issuedOn, invoice.paidOn);
}

export function daysLate(invoice: InvoiceData): number {
  return calendarDaysBetween(invoice.dueOn, todayCalendarDate());
}

/**
 * The row's second line. It answers the question the status badge raises: paid —
 * how fast? late — by how much? Otherwise, when is it due.
 */
export function invoiceRowDetail(invoice: InvoiceData): string {
  const period = periodLabel(invoice);
  const paidIn = daysToPay(invoice);

  const state =
    paidIn !== null
      ? `payée en ${paidIn} j`
      : invoice.isLate
        ? `${daysLate(invoice)} j de retard`
        : invoice.status === 0
          ? "brouillon"
          : `échéance ${calendarDateNumericLabel(invoice.dueOn)}`;

  return period === null ? state : `${period} · ${state}`;
}

/**
 * How long this client actually takes to pay, averaged over the invoices that have
 * been paid. Null until at least one has — an average of nothing is not zero days.
 */
export function averageDaysToPay(invoices: InvoiceData[]): number | null {
  const delays = invoices
    .map(daysToPay)
    .filter((days): days is number => days !== null);

  if (delays.length === 0) {
    return null;
  }

  return Math.round(
    delays.reduce((total, days) => total + days, 0) / delays.length,
  );
}

export function invoiceCountLabel(count: number): string {
  return count === 1 ? "1 facture" : `${count} factures`;
}
