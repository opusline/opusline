import type {
  DateFormat,
  InvoiceData,
  InvoiceListItemData,
  Locale,
} from "@opusline/api-client";

import {
  calendarDateNumericLabel,
  calendarDaysBetween,
  capitalizedMonthLabel,
} from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

/** "Juin 2026" — the period an invoice covers, capitalised as a label. */
function periodLabel(locale: Locale, invoice: InvoiceData): string | null {
  return invoice.periodStart === null
    ? null
    : capitalizedMonthLabel(locale, invoice.periodStart);
}

function daysToPay(invoice: InvoiceData): number | null {
  return invoice.paidOn === null
    ? null
    : calendarDaysBetween(invoice.issuedOn, invoice.paidOn);
}

// Counted against the account's today, the same date the API derived isLate
// from — the browser's calendar can disagree with the badge for hours a day.
function daysLate(invoice: InvoiceData, accountToday: string): number {
  return calendarDaysBetween(invoice.dueOn, accountToday);
}

/**
 * It answers the question the status badge raises: paid — how fast? late — by how
 * much? Otherwise, when is it due.
 */
function invoiceState(
  dateFormat: DateFormat,
  invoice: InvoiceData,
  accountToday: string,
): string {
  const paidIn = daysToPay(invoice);

  if (paidIn !== null) {
    return m.invoices_state_paid_in({ days: paidIn });
  }

  if (invoice.isLate) {
    return m.invoices_state_days_late({
      days: daysLate(invoice, accountToday),
    });
  }

  if (invoice.status === 0) {
    return m.invoices_state_draft();
  }

  return m.invoices_state_due({
    date: calendarDateNumericLabel(dateFormat, invoice.dueOn),
  });
}

/** The row's second line: which period, and where the invoice stands. */
export function invoiceRowDetail(
  locale: Locale,
  dateFormat: DateFormat,
  invoice: InvoiceData,
  accountToday: string,
): string {
  const period = periodLabel(locale, invoice);
  const state = invoiceState(dateFormat, invoice, accountToday);

  return period === null ? state : `${period} · ${state}`;
}

/**
 * The same line for a list that spans missions: which one comes first, because
 * on a client's fiche that is what tells two invoices of the same month apart.
 */
export function invoiceRowDetailWithMission(
  locale: Locale,
  dateFormat: DateFormat,
  item: InvoiceListItemData,
  accountToday: string,
): string {
  const mission = item.mission?.name ?? m.invoices_no_mission();

  return `${mission} · ${invoiceRowDetail(locale, dateFormat, item.invoice, accountToday)}`;
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
