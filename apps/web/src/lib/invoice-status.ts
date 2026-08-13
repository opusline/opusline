import type {
  InvoiceData,
  InvoiceEventKind,
  InvoiceStatus,
} from "@opusline/api-client";

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  0: "Brouillon",
  1: "Envoyée",
  2: "Payée",
};

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
    return { variant: "warn", label: "En retard" };
  }

  return {
    variant: STATUS_TONES[invoice.status],
    label: INVOICE_STATUS_LABELS[invoice.status],
  };
}

export const INVOICE_EVENT_LABELS: Record<InvoiceEventKind, string> = {
  0: "Facture créée",
  1: "Envoyée",
  2: "Relance notée",
  3: "Encaissement",
  4: "Montant corrigé",
};
