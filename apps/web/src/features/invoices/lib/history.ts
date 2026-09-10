import type { InvoiceDetailData } from "@opusline/api-client";

/** InvoiceEventKind.Sent — the one event that dates the document leaving. */
const SENT = 1;

/**
 * The day the invoice went out.
 *
 * It has no field of its own: the API writes it as the Sent event, because
 * nothing fiscal buckets on it and a second column would only be one more thing
 * to keep in step. An invoice recorded as already sent carries it on its issue
 * date, which is the same answer the API falls back to.
 */
export function sentOnFrom(detail: InvoiceDetailData): string {
  return (
    detail.history.find((event) => event.kind === SENT)?.occurredOn ??
    detail.invoice.issuedOn
  );
}
