import type {
  InvoiceForecastBucket,
  InvoiceOverdueData,
  InvoiceTodoData,
  InvoiceTotalData,
} from "@opusline/api-client";

import {
  calendarDateNumericLabel,
  calendarMonthYearLabel,
  fromCalendarDate,
} from "@/lib/dates";
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
  0: "Déjà échu",
  1: "0 – 30 j",
  2: "31 – 60 j",
};

/** "Août 2026", capitalised — a card title, not a sentence fragment. */
export function summaryMonthLabel(month: string): string {
  const label = calendarMonthYearLabel(`${month}-01`);

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function periodsLabel(monthUnbilled: InvoiceTotalData): string {
  if (monthUnbilled.count === 0) {
    return "rien en attente de facture";
  }

  return monthUnbilled.count === 1
    ? "1 période en attente de facture"
    : `${monthUnbilled.count} périodes en attente de facture`;
}

/**
 * How much work a row would bill, in the mission's own unit. The API sends whichever
 * of the two applies; a row that reports neither is a mission that prices nothing,
 * which never reaches this list.
 */
export function todoQuantityLabel(todo: InvoiceTodoData): string | null {
  if (todo.valuedDays !== null) {
    return formatBilledDays(todo.valuedDays);
  }

  return todo.valuedMinutes === null
    ? null
    : formatBilledHours(todo.valuedMinutes);
}

/** "3 j sur OGF front" — what would be billed, and on what. */
export function unbilledWorkTitle(todo: InvoiceTodoData): string {
  const quantity = todoQuantityLabel(todo);
  const mission = todo.missionName ?? todo.clientName;

  return quantity === null ? mission : `${quantity} sur ${mission}`;
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
export function unbilledWorkDetail(todo: InvoiceTodoData): string | null {
  if (todo.firstEntryOn === null || todo.lastEntryOn === null) {
    return null;
  }

  const first = fromCalendarDate(todo.firstEntryOn);
  const last = fromCalendarDate(todo.lastEntryOn);
  const lastLabel = dayAndMonth.format(last);

  if (todo.firstEntryOn === todo.lastEntryOn) {
    return `Entrées du ${lastLabel}`;
  }

  const firstLabel =
    first.getMonth() === last.getMonth()
      ? String(first.getDate()).padStart(2, "0")
      : dayAndMonth.format(first);

  return `Entrées du ${firstLabel} au ${lastLabel}`;
}

/** "Échue le 30/06/2026 · 41 j de retard". */
export function overdueDetail(todo: InvoiceTodoData): string | null {
  if (todo.dueOn === null || todo.daysLate === null) {
    return null;
  }

  return `Échue le ${calendarDateNumericLabel(todo.dueOn)} · ${todo.daysLate} j de retard`;
}
