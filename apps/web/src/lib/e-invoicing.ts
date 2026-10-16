import type { EInvoicingError } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

const ERROR_MESSAGES: Record<EInvoicingError, () => string> = {
  0: m.einvoicing_error_unavailable,
  1: m.einvoicing_error_credentials_rejected,
  2: m.einvoicing_error_company_unverified,
  3: m.einvoicing_error_not_connected,
  4: m.einvoicing_error_rejected,
  5: m.einvoicing_error_not_found,
};

/** Why the platform refused the last sync, as the API reports it. */
export function eInvoicingErrorLabel(error: EInvoicingError): string {
  return ERROR_MESSAGES[error]();
}

/**
 * The same on the Integrations tab itself, where a pointer to that tab is
 * noise and an unverified company already has its own notice.
 */
export function eInvoicingErrorLabelInSettings(
  error: EInvoicingError,
): string | null {
  switch (error) {
    case 1:
      return m.einvoicing_error_credentials_rejected_here();
    case 2:
      return null;
    default:
      return eInvoicingErrorLabel(error);
  }
}
