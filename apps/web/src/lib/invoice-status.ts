import type { InvoiceData, InvoiceStatus } from "@opusline/api-client";

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  0: "Brouillon",
  1: "Envoyée",
  2: "Payée",
};

/**
 * Late is not a fourth status — the API derives it from the due date and reports it
 * as `isLate` on a sent invoice. It gets its own badge because it is the one state
 * that asks something of you.
 */
export function invoiceStatusBadge(invoice: InvoiceData): {
  variant: "brand" | "neutral" | "warn";
  label: string;
} {
  if (invoice.isLate) {
    return { variant: "warn", label: "En retard" };
  }

  return {
    variant: invoice.status === 1 ? "brand" : "neutral",
    label: INVOICE_STATUS_LABELS[invoice.status],
  };
}
