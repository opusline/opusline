import type { ReceiptSuggestionData } from "@opusline/api-client";

import { formatAmount, type MoneyFormat } from "@/lib/billing";

import type { ExpenseDraft } from "./expense-draft";
import { vatChoiceOf } from "./vat";

export type FieldSource = "read" | "suggested";

/** Which draft fields the receipt filled, and how sure the reader was. */
export type DraftSources = Partial<Record<keyof ExpenseDraft, FieldSource>>;

export type ReceiptChanges = {
  changes: Partial<ExpenseDraft>;
  sources: DraftSources;
};

/**
 * What the receipt reader found, as a draft overlay. The category is only
 * ever a guess, so it is tagged as one to check rather than as read; under
 * the franchise en base the TVA has no field to land on and is left out.
 */
export function receiptSuggestionChanges(
  format: MoneyFormat,
  suggestion: ReceiptSuggestionData,
  isVatLiable: boolean,
): ReceiptChanges {
  const changes: Partial<ExpenseDraft> = {};
  const sources: DraftSources = {};

  if (suggestion.supplier != null) {
    changes.supplier = suggestion.supplier.value;
    sources.supplier = "read";
  }

  if (suggestion.spentOn != null) {
    changes.spentOn = suggestion.spentOn.value;
    sources.spentOn = "read";
  }

  if (suggestion.amountTtc != null) {
    changes.ttc = formatAmount(format, suggestion.amountTtc.value.amount);
    sources.ttc = "read";
  }

  if (suggestion.vat != null && isVatLiable) {
    const vatTerms = {
      vatTreatment: suggestion.vat.treatment,
      vatRateBp: suggestion.vat.rateBp,
    };

    changes.vatTerms = vatTerms;
    changes.vatChoice = vatChoiceOf(vatTerms);
    sources.vatChoice = "read";
  }

  if (suggestion.description != null) {
    changes.description = suggestion.description.value;
    sources.description = "read";
  }

  if (suggestion.category != null) {
    changes.category = suggestion.category;
    sources.category = "suggested";
  }

  return { changes, sources };
}

export function readFieldCount(sources: DraftSources): number {
  return Object.values(sources).filter((source) => source === "read").length;
}
