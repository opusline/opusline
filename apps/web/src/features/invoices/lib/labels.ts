import type { InvoiceData } from "@opusline/api-client";

import {
  calendarDateNumericLabel,
  calendarDaysBetween,
  capitalizedMonthLabel,
  todayCalendarDate,
} from "@/lib/dates";

/** "Juin 2026" — the period an invoice covers, capitalised as a label. */
function periodLabel(invoice: InvoiceData): string | null {
  return invoice.periodStart === null
    ? null
    : capitalizedMonthLabel(invoice.periodStart);
}

function daysToPay(invoice: InvoiceData): number | null {
  return invoice.paidOn === null
    ? null
    : calendarDaysBetween(invoice.issuedOn, invoice.paidOn);
}

function daysLate(invoice: InvoiceData): number {
  return calendarDaysBetween(invoice.dueOn, todayCalendarDate());
}

/**
 * It answers the question the status badge raises: paid — how fast? late — by how
 * much? Otherwise, when is it due.
 */
function invoiceState(invoice: InvoiceData): string {
  const paidIn = daysToPay(invoice);

  if (paidIn !== null) {
    return `payée en ${paidIn} j`;
  }

  if (invoice.isLate) {
    return `${daysLate(invoice)} j de retard`;
  }

  if (invoice.status === 0) {
    return "brouillon";
  }

  return `échéance ${calendarDateNumericLabel(invoice.dueOn)}`;
}

/** The row's second line: which period, and where the invoice stands. */
export function invoiceRowDetail(invoice: InvoiceData): string {
  const period = periodLabel(invoice);
  const state = invoiceState(invoice);

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
