import type {
  DocumentLanguage,
  InvoicingMode,
  InvoicingSettingsData,
  LegalReferenceData,
  Locale,
  OperationCategory,
  UpdateInvoicingSettingsData,
} from "@opusline/api-client";

import { formatPercentFromBp, parseRateBp } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

export type PaymentTerm = { days: number; endOfMonth: boolean };

/** The terms the screen offers, up to the legal maximums of art. L441-10 C. com. */
export const PAYMENT_TERMS: readonly PaymentTerm[] = [
  { days: 0, endOfMonth: false },
  { days: 15, endOfMonth: false },
  { days: 30, endOfMonth: false },
  { days: 45, endOfMonth: false },
  { days: 60, endOfMonth: false },
  { days: 0, endOfMonth: true },
  { days: 30, endOfMonth: true },
  { days: 45, endOfMonth: true },
];

export const QUOTE_VALIDITY_DAYS = [15, 30, 60, 90] as const;

export function paymentTermKey(term: PaymentTerm): string {
  return `${term.days}${term.endOfMonth ? "fm" : ""}`;
}

export function parsePaymentTermKey(key: string): PaymentTerm {
  return {
    days: Number.parseInt(key, 10) || 0,
    endOfMonth: key.endsWith("fm"),
  };
}

function isLegalMaximum(term: PaymentTerm): boolean {
  return term.days === (term.endOfMonth ? 45 : 60);
}

export function paymentTermLabel(term: PaymentTerm): string {
  const label = term.endOfMonth
    ? term.days === 0
      ? m.invoicing_term_end_of_month()
      : m.invoicing_term_days_end_of_month({ days: String(term.days) })
    : term.days === 0
      ? m.invoicing_term_on_receipt()
      : m.invoicing_days({ count: term.days });

  return isLegalMaximum(term)
    ? m.invoicing_term_legal_maximum({ term: label })
    : label;
}

/** A stored term the presets do not hold (an older, longer one) stays selectable. */
export function paymentTermOptions(current: PaymentTerm): PaymentTerm[] {
  const key = paymentTermKey(current);

  return PAYMENT_TERMS.some((term) => paymentTermKey(term) === key)
    ? [...PAYMENT_TERMS]
    : [...PAYMENT_TERMS, current];
}

export function quoteValidityOptions(current: number): number[] {
  return (QUOTE_VALIDITY_DAYS as readonly number[]).includes(current)
    ? [...QUOTE_VALIDITY_DAYS]
    : [...QUOTE_VALIDITY_DAYS, current].sort((left, right) => left - right);
}

export const OPERATION_CATEGORY_LABELS: Record<
  OperationCategory,
  () => string
> = {
  0: m.invoicing_category_services,
  1: m.invoicing_category_goods,
  2: m.invoicing_category_mixed,
};

export type InvoicingSettingsDraft = {
  mode: InvoicingMode;
  paymentTerm: string;
  quoteValidityDays: number;
  /** Empty states no rate on the invoice: the statutory one applies. */
  latePenaltyRate: string;
  operationCategory: OperationCategory;
  showIbanOnInvoices: boolean;
  showEmailOnDocuments: boolean;
  vatOnDebits: boolean;
  customMentions: string;
  documentLanguage: DocumentLanguage;
};

export function formatRate(locale: Locale, basisPoints: number): string {
  return formatPercentFromBp(locale, basisPoints, 0, 2);
}

export function toInvoicingDraft(
  locale: Locale,
  settings: InvoicingSettingsData,
): InvoicingSettingsDraft {
  return {
    mode: settings.mode,
    paymentTerm: paymentTermKey({
      days: settings.defaultPaymentTermsDays,
      endOfMonth: settings.defaultPaymentTermsEndOfMonth,
    }),
    quoteValidityDays: settings.quoteValidityDays,
    latePenaltyRate:
      settings.latePenaltyRateBp === null
        ? ""
        : formatRate(locale, settings.latePenaltyRateBp),
    operationCategory: settings.operationCategory,
    showIbanOnInvoices: settings.showIbanOnInvoices,
    showEmailOnDocuments: settings.showEmailOnDocuments,
    vatOnDebits: settings.vatOnDebits,
    customMentions: settings.customMentions ?? "",
    documentLanguage: settings.documentLanguage,
  };
}

export function penaltyRateBp(locale: Locale, draft: string): number | null {
  return draft.trim() === "" ? null : parseRateBp(locale, draft);
}

/** Blank is valid (the statutory rate applies); anything else must read as a rate. */
export function isPenaltyRateInvalid(locale: Locale, draft: string): boolean {
  return draft.trim() !== "" && parseRateBp(locale, draft) === null;
}

/** Check `isPenaltyRateInvalid` first: an unreadable rate would be sent as no rate. */
export function toInvoicingPayload(
  locale: Locale,
  draft: InvoicingSettingsDraft,
  settings: InvoicingSettingsData,
): UpdateInvoicingSettingsData {
  const term = parsePaymentTermKey(draft.paymentTerm);
  const mentions = draft.customMentions.trim();

  return {
    mode: draft.mode,
    defaultPaymentTermsDays: term.days,
    defaultPaymentTermsEndOfMonth: term.endOfMonth,
    quoteValidityDays: draft.quoteValidityDays,
    latePenaltyRateBp: penaltyRateBp(locale, draft.latePenaltyRate),
    operationCategory: draft.operationCategory,
    showIbanOnInvoices: draft.showIbanOnInvoices,
    showEmailOnDocuments: draft.showEmailOnDocuments,
    vatOnDebits: settings.vatLiable && draft.vatOnDebits,
    customMentions: mentions === "" ? null : mentions,
    documentLanguage: draft.documentLanguage,
  };
}

export function hasUnsavedChanges(
  locale: Locale,
  saved: InvoicingSettingsData,
  draft: InvoicingSettingsDraft,
): boolean {
  if (isPenaltyRateInvalid(locale, draft.latePenaltyRate)) {
    return true;
  }

  return (
    JSON.stringify(toInvoicingPayload(locale, draft, saved)) !==
    JSON.stringify(
      toInvoicingPayload(locale, toInvoicingDraft(locale, saved), saved),
    )
  );
}

/** `2026-H2` → the day its ECB reference rate is taken, 1 July 2026. */
export function semesterStart(semester: string): string {
  const [year, half] = semester.split("-");

  return `${year}-${half === "H2" ? "07" : "01"}-01`;
}

export function legalReferenceTitle(reference: LegalReferenceData): string {
  const [year = "", half] = reference.semester.split("-");

  return half === "H2"
    ? m.invoicing_legal_title_second({ year })
    : m.invoicing_legal_title_first({ year });
}
