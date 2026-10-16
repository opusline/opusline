import type { QuoteDetailData, SaveQuoteDraftData } from "@opusline/api-client";

import { formatAmount, type MoneyFormat } from "@/lib/billing";

import {
  draftPayload,
  formatQuantity,
  type InvoiceDraft,
  lineKey,
} from "./invoice-draft";
import { paymentTermKey } from "./invoicing-settings";

/** A saved quote draft back into the editor; null once it was validated. */
export function quoteDraftFromDetail(
  format: MoneyFormat,
  detail: QuoteDetailData,
): InvoiceDraft | null {
  if (detail.quote.status !== 0) {
    return null;
  }

  return quoteDraftCopy(format, detail);
}

/** A copy to send again: same client, lines and options. */
export function duplicateQuoteDraft(
  format: MoneyFormat,
  detail: QuoteDetailData,
): InvoiceDraft {
  return quoteDraftCopy(format, detail);
}

function quoteDraftCopy(
  format: MoneyFormat,
  { quote, content }: QuoteDetailData,
): InvoiceDraft {
  return {
    clientId: quote.clientId,
    missionId: quote.missionId,
    title: quote.title ?? "",
    description: content.description ?? "",
    periodStart: "",
    periodEnd: "",
    lines: content.lines.map((line) => ({
      key: lineKey(),
      label: line.label,
      detail: line.detail ?? "",
      quantity: formatQuantity(format.locale, line.quantityMilli),
      unit: line.unit,
      unitPrice: formatAmount(format, line.unitPrice.amount),
      vatRateBp: line.vatRateBp,
    })),
    paymentTerm: paymentTermKey({
      days: content.paymentTermsDays,
      endOfMonth: content.paymentTermsEndOfMonth,
    }),
    latePenaltyRate: "",
    customMentions: content.customMentions ?? "",
    showIban: false,
    showEmail: content.showEmail,
    language: quote.language,
    timeEntryIds: [],
    timeLineKey: null,
    validityDays: quote.validityDays,
    depositRateBp: quote.depositRateBp,
  };
}

/**
 * The draft as the quotes API takes it, or null until a client is chosen.
 * The invoice payload already carries the lines and the shared options; a
 * quote adds its validity and deposit, and has no period, no IBAN and no
 * tracked time.
 */
export function quoteDraftPayload(
  format: MoneyFormat,
  draft: InvoiceDraft,
): SaveQuoteDraftData | null {
  const invoice = draftPayload(format, draft);

  if (invoice === null) {
    return null;
  }

  return {
    clientId: invoice.clientId,
    missionId: invoice.missionId,
    title: invoice.title,
    description: invoice.description,
    lines: invoice.lines,
    paymentTermsDays: invoice.paymentTermsDays,
    paymentTermsEndOfMonth: invoice.paymentTermsEndOfMonth,
    customMentions: invoice.customMentions,
    showEmail: invoice.showEmail,
    language: invoice.language,
    validityDays: draft.validityDays,
    depositRateBp: draft.depositRateBp,
  };
}
