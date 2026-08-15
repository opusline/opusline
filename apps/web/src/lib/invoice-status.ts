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

  return {
    variant: STATUS_TONES[invoice.status],
    label: invoiceStatusLabel(invoice.status),
  };
}

const INVOICE_EVENT_MESSAGES: Record<InvoiceEventKind, () => string> = {
  0: m.invoice_event_created,
  1: m.invoice_event_sent,
  2: m.invoice_event_reminded,
  3: m.invoice_event_paid,
  4: m.invoice_event_corrected,
};

export function invoiceEventLabel(kind: InvoiceEventKind): string {
  return INVOICE_EVENT_MESSAGES[kind]();
}
