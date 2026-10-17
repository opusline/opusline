import type {
  CreditNoteKind,
  CreditNoteReason,
  CreditNoteSettlement,
  InvoiceDetailData,
  InvoiceLineData,
  IssueCreditNoteData,
  LineUnit,
} from "@opusline/api-client";

import {
  formatAmount,
  type MoneyFormat,
  parseAmountToCents,
  parseDecimal,
} from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { formatQuantity, lineKey } from "./invoice-draft";

export const CREDIT_NOTE_KINDS: readonly CreditNoteKind[] = [0, 1, 2];

export const CREDIT_NOTE_KIND_LABELS: Record<CreditNoteKind, () => string> = {
  0: m.credit_note_kind_full,
  1: m.credit_note_kind_partial,
  2: m.credit_note_kind_balance,
};

export const CREDIT_NOTE_KIND_DETAILS: Record<CreditNoteKind, () => string> = {
  0: m.credit_note_kind_full_detail,
  1: m.credit_note_kind_partial_detail,
  2: m.credit_note_kind_balance_detail,
};

export const CREDIT_NOTE_KIND_TOKENS: Record<CreditNoteKind, string> = {
  0: "full",
  1: "partial",
  2: "balance",
};

export const CREDIT_NOTE_REASONS: readonly CreditNoteReason[] = [0, 1, 2, 3];

export const CREDIT_NOTE_REASON_LABELS: Record<CreditNoteReason, () => string> =
  {
    0: m.credit_note_reason_billing_error,
    1: m.credit_note_reason_service_cancelled,
    2: m.credit_note_reason_commercial_gesture,
    3: m.credit_note_reason_other,
  };

export const CREDIT_NOTE_SETTLEMENT_LABELS: Record<
  CreditNoteSettlement,
  () => string
> = {
  0: m.credit_note_settlement_cancels,
  1: m.credit_note_settlement_reduces,
  2: m.credit_note_settlement_refund,
  3: m.credit_note_settlement_deduct,
};

export const CREDIT_NOTE_SETTLEMENT_TOKENS: Record<
  CreditNoteSettlement,
  string
> = {
  0: "cancels",
  1: "reduces",
  2: "refund",
  3: "deduct",
};

/** What money already paid can become: the two choices the editor offers. */
export const RETURN_SETTLEMENTS: readonly CreditNoteSettlement[] = [2, 3];

export type CreditLineDraft = {
  key: string;
  /** The invoice line it takes back; null for a line typed freely. */
  invoiceLineId: number | null;
  label: string;
  detail: string;
  quantity: string;
  unit: LineUnit;
  unitPrice: string;
  vatRateBp: number;
};

export type CreditNoteDraft = {
  kind: CreditNoteKind;
  reason: CreditNoteReason | null;
  detail: string;
  /** Only asked when money was received: the invoice may then owe some back. */
  settlement: CreditNoteSettlement;
  /** A partial credit note's lines; the full and balance ones derive theirs. */
  lines: CreditLineDraft[];
  /** « Corriger la facture »: a new invoice copied from this one opens after. */
  reissue: boolean;
};

export function newCreditNoteDraft(
  kind: CreditNoteKind,
  reissue: boolean,
): CreditNoteDraft {
  return {
    kind,
    reason: null,
    detail: "",
    settlement: 2,
    lines: [],
    reissue: kind === 0 && reissue,
  };
}

/** Money landed on the invoice: a credit note may then owe some back. */
export function hasReceivedMoney(detail: InvoiceDetailData): boolean {
  return detail.invoice.amountPaid.amount > 0;
}

/** A line of the invoice taken back as it was invoiced, editable from there. */
export function lineFromInvoice(
  format: MoneyFormat,
  line: InvoiceLineData,
): CreditLineDraft {
  return {
    key: lineKey(),
    invoiceLineId: line.id,
    label: line.label,
    detail: line.detail ?? "",
    quantity: formatQuantity(format.locale, line.quantityMilli),
    unit: line.unit,
    unitPrice: formatAmount(format, line.unitPrice.amount),
    vatRateBp: line.vatRateBp,
  };
}

export function freeCreditLine(vatRateBp: number): CreditLineDraft {
  return {
    key: lineKey(),
    invoiceLineId: null,
    label: "",
    detail: "",
    quantity: "1",
    unit: 2,
    unitPrice: "",
    vatRateBp,
  };
}

type LineInput = IssueCreditNoteData["lines"] extends
  | Array<infer Line>
  | undefined
  ? Line
  : never;

function lineInput(
  format: MoneyFormat,
  line: CreditLineDraft,
): LineInput | null {
  const quantity = parseDecimal(format.locale, line.quantity);
  const cents = parseAmountToCents(format.locale, line.unitPrice);
  const quantityMilli = quantity === null ? 0 : Math.round(quantity * 1000);

  if (line.label.trim() === "" || quantityMilli < 1 || cents === null) {
    return null;
  }

  return {
    label: line.label.trim(),
    detail: line.detail.trim() === "" ? null : line.detail.trim(),
    quantityMilli,
    unit: line.unit,
    unitPrice: { amount: cents, currency: format.currency },
    vatRateBp: line.vatRateBp,
    invoiceLineId: line.invoiceLineId,
  };
}

/**
 * The draft as the API takes it, or null while it cannot be sent: no reason
 * yet, or a partial credit note without a complete line.
 */
export function creditNotePayload(
  format: MoneyFormat,
  draft: CreditNoteDraft,
  receivedMoney: boolean,
): IssueCreditNoteData | null {
  if (draft.reason === null) {
    return null;
  }

  const lines =
    draft.kind === 1
      ? draft.lines.flatMap((line) => {
          const input = lineInput(format, line);

          return input === null ? [] : [input];
        })
      : [];

  if (
    draft.kind === 1 &&
    (lines.length === 0 || lines.length !== draft.lines.length)
  ) {
    return null;
  }

  return {
    kind: draft.kind,
    reason: draft.reason,
    detail: draft.detail.trim() === "" ? null : draft.detail.trim(),
    lines,
    // The API keeps it only when the credit note takes off more than is due.
    settlement: receivedMoney ? draft.settlement : null,
  };
}
