import type { EInvoicingError, LifecycleStatus } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

/** An untranslated token per cycle-de-vie status, for data attributes and tests. */
const STATUS_TOKENS: Record<LifecycleStatus, string> = {
  200: "deposited",
  201: "issued",
  202: "received",
  204: "taken_in_charge",
  205: "approved",
  206: "partially_approved",
  207: "disputed",
  210: "refused",
  211: "payment_sent",
  212: "collected",
  213: "rejected",
};

const STATUS_MESSAGES: Record<LifecycleStatus, () => string> = {
  200: m.einvoice_status_deposited,
  201: m.einvoice_status_issued,
  202: m.einvoice_status_received,
  204: m.einvoice_status_taken_in_charge,
  205: m.einvoice_status_approved,
  206: m.einvoice_status_partially_approved,
  207: m.einvoice_status_disputed,
  210: m.einvoice_status_refused,
  211: m.einvoice_status_payment_sent,
  212: m.einvoice_status_collected,
  213: m.einvoice_status_rejected,
};

const ERROR_MESSAGES: Record<EInvoicingError, () => string> = {
  0: m.einvoicing_error_unavailable,
  1: m.einvoicing_error_credentials_rejected,
  2: m.einvoicing_error_company_unverified,
  3: m.einvoicing_error_not_connected,
  4: m.einvoicing_error_rejected,
  5: m.einvoicing_error_not_found,
};

export function eInvoiceStatusToken(status: LifecycleStatus): string {
  return STATUS_TOKENS[status];
}

export function eInvoiceStatusLabel(status: LifecycleStatus): string {
  return STATUS_MESSAGES[status]();
}

export function eInvoicingErrorLabel(error: EInvoicingError): string {
  return ERROR_MESSAGES[error]();
}
