import type {
  InvoiceData,
  InvoiceEventKind,
  InvoiceStatus,
} from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

const INVOICE_STATUS_MESSAGES: Record<InvoiceStatus, () => string> = {
  0: m.invoice_status_draft,
  1: m.invoice_status_sent,
  2: m.invoice_status_paid,
  3: m.invoice_status_cancelled,
};

/** What a test or a stylesheet can match on: the label moves with the locale. */
export const INVOICE_STATUS_TOKENS: Record<InvoiceStatus, string> = {
  0: "draft",
  1: "sent",
  2: "paid",
  3: "cancelled",
};

export function invoiceStatusLabel(status: InvoiceStatus): string {
  return INVOICE_STATUS_MESSAGES[status]();
}

type BadgeTone = "brand" | "neutral" | "success" | "warn";

/**
 * Tones follow the design's badge spec: brand is reserved for "active, unpaid",
 * success for money that has landed, neutral for a draft that is not a document yet.
 */
const STATUS_TONES: Record<InvoiceStatus, BadgeTone> = {
  0: "neutral",
  1: "brand",
  2: "success",
  3: "neutral",
};

/**
 * Late is not a fourth status — the API derives it from the due date and reports it
 * as `isLate` on a sent invoice. It gets its own badge because it is the one state
 * that asks something of you.
 */
export function invoiceStatusBadge(invoice: InvoiceData): {
  variant: BadgeTone;
  label: string;
} {
  if (invoice.isLate) {
    return { variant: "warn", label: m.invoice_status_late() };
  }

  if (isPartlyPaid(invoice)) {
    return { variant: "brand", label: m.invoice_status_partial() };
  }

  return {
    variant: STATUS_TONES[invoice.status],
    label: invoiceStatusLabel(invoice.status),
  };
}

/** Sent, with some of the money in: not a status of its own on the API, derived from the payments. */
export function isPartlyPaid(invoice: InvoiceData): boolean {
  return invoice.status === 1 && invoice.amountPaid.amount > 0;
}

/** The status token with the partly-paid case told apart, for `data-status`. */
export function invoiceStatusToken(invoice: InvoiceData): string {
  return isPartlyPaid(invoice)
    ? "partial"
    : INVOICE_STATUS_TOKENS[invoice.status];
}

const INVOICE_EVENT_MESSAGES: Record<InvoiceEventKind, () => string> = {
  0: m.invoice_event_created,
  1: m.invoice_event_sent,
  2: m.invoice_event_reminded,
  3: m.invoice_event_paid,
  4: m.invoice_event_corrected,
  5: m.invoice_event_emailed,
  6: m.invoice_event_payment_recorded,
  7: m.invoice_event_credit_note,
};

export const INVOICE_EVENT_TOKENS: Record<InvoiceEventKind, string> = {
  0: "created",
  1: "sent",
  2: "reminded",
  3: "paid",
  4: "corrected",
  5: "emailed",
  6: "payment",
  7: "credit-note",
};

export function invoiceEventLabel(kind: InvoiceEventKind): string {
  return INVOICE_EVENT_MESSAGES[kind]();
}
