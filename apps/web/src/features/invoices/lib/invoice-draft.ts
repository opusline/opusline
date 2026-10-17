import type {
  CatalogItemData,
  ClientWithMissionsData,
  DocumentLanguage,
  InvoiceDetailData,
  InvoicingSettingsData,
  LineUnit,
  Locale,
  SaveInvoiceDraftData,
  UnbilledTimeData,
} from "@opusline/api-client";

import {
  cachedFormatter,
  formatAmount,
  type MoneyFormat,
  parseDecimal,
  parseSignedAmountToCents,
} from "@/lib/billing";
import { addCalendarDays, fromCalendarDate, toCalendarDate } from "@/lib/dates";

import {
  DEFAULT_QUOTE_VALIDITY_DAYS,
  formatRate,
  parsePaymentTermKey,
  paymentTermKey,
  penaltyRateBp,
} from "./invoicing-settings";

export type LineDraft = {
  /** Stable across edits, so React keeps each row's inputs while lines move. */
  key: string;
  label: string;
  detail: string;
  quantity: string;
  unit: LineUnit;
  unitPrice: string;
  vatRateBp: number;
};

export type InvoiceDraft = {
  clientId: number | null;
  missionId: number | null;
  title: string;
  description: string;
  periodStart: string;
  periodEnd: string;
  lines: LineDraft[];
  paymentTerm: string;
  /** Empty states no rate on the invoice: the statutory one applies. */
  latePenaltyRate: string;
  customMentions: string;
  showIban: boolean;
  showEmail: boolean;
  language: DocumentLanguage;
  /** The mission's tracked time this draft bills, marked as billed when it is saved. */
  timeEntryIds: number[];
  /** Credit notes of the client's earlier invoices this one deducts, settled when it is issued. */
  creditNoteIds: number[];
  /**
   * The line the time was imported on in this session: removing it releases
   * the time. Which line holds it is not stored, so a reopened draft has none
   * and its time is released explicitly.
   */
  timeLineKey: string | null;
  /** Quote mode only: how long the offer stands, from the day it is validated. */
  validityDays: number;
  /** Quote mode only: the share of the total incl. VAT due on acceptance; null for none. */
  depositRateBp: number | null;
};

let nextLineKey = 0;

export function lineKey(): string {
  nextLineKey += 1;

  return `line-${nextLineKey}`;
}

export function formatQuantity(locale: Locale, quantityMilli: number): string {
  return cachedFormatter(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    useGrouping: false,
  }).format(quantityMilli / 1000);
}

export function newInvoiceDraft(
  locale: Locale,
  settings: InvoicingSettingsData,
): InvoiceDraft {
  return {
    clientId: null,
    missionId: null,
    title: "",
    description: "",
    periodStart: "",
    periodEnd: "",
    lines: [],
    paymentTerm: paymentTermKey({
      days: settings.defaultPaymentTermsDays,
      endOfMonth: settings.defaultPaymentTermsEndOfMonth,
    }),
    latePenaltyRate:
      settings.latePenaltyRateBp === null
        ? ""
        : formatRate(locale, settings.latePenaltyRateBp),
    customMentions: settings.customMentions ?? "",
    showIban: settings.showIbanOnInvoices,
    showEmail: settings.showEmailOnDocuments,
    language: settings.documentLanguage,
    timeEntryIds: [],
    creditNoteIds: [],
    timeLineKey: null,
    validityDays: settings.quoteValidityDays,
    depositRateBp: null,
  };
}

/** A saved draft back into the editor; null when the invoice was not written here. */
export function draftFromDetail(
  format: MoneyFormat,
  detail: InvoiceDetailData,
): InvoiceDraft | null {
  const { invoice, content } = detail;

  if (content === null) {
    return null;
  }

  return {
    clientId: invoice.clientId,
    missionId: invoice.missionId,
    title: content.title ?? "",
    description: content.description ?? "",
    periodStart: invoice.periodStart ?? "",
    periodEnd: invoice.periodEnd ?? "",
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
    latePenaltyRate:
      content.latePenaltyRateBp === null
        ? ""
        : formatRate(format.locale, content.latePenaltyRateBp),
    customMentions: content.customMentions ?? "",
    showIban: content.showIban,
    showEmail: content.showEmail,
    language: content.language,
    timeEntryIds: content.timeEntryIds,
    creditNoteIds: detail.deductedCreditNotes.map(
      (creditNote) => creditNote.id,
    ),
    timeLineKey: null,
    validityDays: DEFAULT_QUOTE_VALIDITY_DAYS,
    depositRateBp: null,
  };
}

/**
 * A copy to issue again: same client, lines and options, but neither the
 * period nor the tracked time, which belong to the invoice copied.
 */
export function duplicateDraft(
  format: MoneyFormat,
  detail: InvoiceDetailData,
): InvoiceDraft | null {
  const copy = draftFromDetail(format, detail);

  return copy === null
    ? null
    : {
        ...copy,
        periodStart: "",
        periodEnd: "",
        timeEntryIds: [],
        creditNoteIds: [],
      };
}

export function freeLine(vatRateBp: number): LineDraft {
  return {
    key: lineKey(),
    label: "",
    detail: "",
    quantity: "1",
    unit: 0,
    unitPrice: "",
    vatRateBp,
  };
}

/** Copied at the stored price: a later catalogue change leaves this document alone. */
export function catalogLine(
  format: MoneyFormat,
  item: CatalogItemData,
): LineDraft {
  return {
    key: lineKey(),
    label: item.label,
    detail: item.detail ?? "",
    quantity: "1",
    unit: item.unit,
    unitPrice: formatAmount(format, item.unitPrice.amount),
    vatRateBp: item.vatRateBp,
  };
}

/**
 * The mission's unbilled time as one line, the period defaulting to the span
 * it covers. A mission billed at a fixed price has no unit price to carry.
 */
export function withTimeImported(
  format: MoneyFormat,
  draft: InvoiceDraft,
  time: UnbilledTimeData,
  line: { vatRateBp: number; detail: string },
): InvoiceDraft {
  const imported: LineDraft = {
    key: lineKey(),
    label: time.missionName,
    detail: line.detail,
    quantity: formatQuantity(format.locale, time.quantityMilli),
    unit: time.unit,
    unitPrice:
      time.unitPrice === null
        ? ""
        : formatAmount(format, time.unitPrice.amount),
    vatRateBp: line.vatRateBp,
  };

  return {
    ...draft,
    lines: [...draft.lines, imported],
    timeEntryIds: [...time.timeEntryIds],
    timeLineKey: imported.key,
    periodStart: draft.periodStart || (time.firstEntryOn ?? ""),
    periodEnd: draft.periodEnd || (time.lastEntryOn ?? ""),
  };
}

export function withoutLine(draft: InvoiceDraft, key: string): InvoiceDraft {
  const releasesTime = draft.timeLineKey === key;

  return {
    ...draft,
    lines: draft.lines.filter((line) => line.key !== key),
    timeEntryIds: releasesTime ? [] : draft.timeEntryIds,
    timeLineKey: releasesTime ? null : draft.timeLineKey,
  };
}

/** Time is imported once, whole: the draft bills all of it or none. */
export function canImportTime(draft: InvoiceDraft): boolean {
  return draft.timeEntryIds.length === 0;
}

export function withTimeReleased(draft: InvoiceDraft): InvoiceDraft {
  return { ...draft, timeEntryIds: [], timeLineKey: null };
}

type LineInput = SaveInvoiceDraftData["lines"][number];

function lineInput(format: MoneyFormat, line: LineDraft): LineInput | null {
  const quantity = parseDecimal(format.locale, line.quantity);
  const cents = parseSignedAmountToCents(format.locale, line.unitPrice);
  const quantityMilli = quantity === null ? 0 : Math.round(quantity * 1000);

  if (line.label.trim() === "" || quantityMilli < 1 || cents === null) {
    return null;
  }

  const detail = line.detail.trim();

  return {
    label: line.label.trim(),
    detail: detail === "" ? null : detail,
    quantityMilli,
    unit: line.unit,
    unitPrice: { amount: cents, currency: format.currency },
    vatRateBp: line.vatRateBp,
  };
}

export function isLineComplete(format: MoneyFormat, line: LineDraft): boolean {
  return lineInput(format, line) !== null;
}

function orNull(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

/**
 * The draft as the API takes it, or null until a client is chosen. Lines not
 * yet complete are left out: the preview draws what is ready, and saving
 * checks `isLineComplete` on every line first.
 */
export function draftPayload(
  format: MoneyFormat,
  draft: InvoiceDraft,
): SaveInvoiceDraftData | null {
  if (draft.clientId === null) {
    return null;
  }

  const term = parsePaymentTermKey(draft.paymentTerm);
  const lines = draft.lines.flatMap((line) => {
    const input = lineInput(format, line);

    return input === null ? [] : [input];
  });

  return {
    clientId: draft.clientId,
    missionId: draft.missionId,
    title: orNull(draft.title),
    description: orNull(draft.description),
    periodStart: orNull(draft.periodStart),
    periodEnd: orNull(draft.periodEnd),
    lines,
    paymentTermsDays: term.days,
    paymentTermsEndOfMonth: term.endOfMonth,
    latePenaltyRateBp: penaltyRateBp(format.locale, draft.latePenaltyRate),
    customMentions: orNull(draft.customMentions),
    showIban: draft.showIban,
    showEmail: draft.showEmail,
    language: draft.language,
    timeEntryIds: draft.timeEntryIds,
    creditNoteIds: draft.creditNoteIds,
  };
}

/** Mirrors the API's PaymentTerm: « fin de mois » runs from the issue month's last day. */
export function dueDate(issuedOn: string, key: string): string {
  const term = parsePaymentTermKey(key);

  if (!term.endOfMonth) {
    return addCalendarDays(issuedOn, term.days);
  }

  const issued = fromCalendarDate(issuedOn);
  const monthEnd = new Date(issued.getFullYear(), issued.getMonth() + 1, 0);

  return addCalendarDays(toCalendarDate(monthEnd), term.days);
}

/**
 * The client's own term, when it differs from the account default, wins;
 * otherwise the account default applies, whatever the previous client's was.
 */
export function withClient(
  draft: InvoiceDraft,
  client: ClientWithMissionsData,
  settings: InvoicingSettingsData,
): InvoiceDraft {
  const clientTerm =
    client.paymentTermsDays === settings.defaultPaymentTermsDays
      ? paymentTermKey({
          days: settings.defaultPaymentTermsDays,
          endOfMonth: settings.defaultPaymentTermsEndOfMonth,
        })
      : paymentTermKey({ days: client.paymentTermsDays, endOfMonth: false });
  const keepsMission = client.missions.some(
    (mission) => mission.id === draft.missionId,
  );

  return {
    ...withMission(draft, keepsMission ? draft.missionId : null),
    clientId: client.id,
    paymentTerm: clientTerm,
    // Credit notes are deducted from the same client only.
    creditNoteIds: client.id === draft.clientId ? draft.creditNoteIds : [],
  };
}

/** Imported time belongs to one mission: leaving it gives the time back, line included. */
export function withMission(
  draft: InvoiceDraft,
  missionId: number | null,
): InvoiceDraft {
  if (missionId === draft.missionId) {
    return draft;
  }

  const released =
    draft.timeLineKey === null
      ? withTimeReleased(draft)
      : withoutLine(draft, draft.timeLineKey);

  return { ...released, missionId };
}
