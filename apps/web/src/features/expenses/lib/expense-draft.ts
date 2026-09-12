import type {
  ExpenseCategory,
  ExpenseData,
  ExpenseInputData,
} from "@opusline/api-client";

import {
  formatAmount,
  type MoneyFormat,
  parseDecimal,
  parseSignedAmountToCents,
} from "@/lib/billing";

import {
  type VatChoice,
  type VatTerms,
  vatChoiceOf,
  vatChoiceTerms,
} from "./vat";

/** What the sheet edits: every field as the user types it, before it becomes a payload. */
export type ExpenseDraft = {
  supplier: string;
  /** `Y-m-d`. */
  spentOn: string;
  category: ExpenseCategory;
  /** The TTC amount as typed, in the user's locale. */
  ttc: string;
  /** The pro share as typed, 0–100. */
  proShare: string;
  /** The chip picked, or null while the row keeps a rate no chip covers. */
  vatChoice: VatChoice | null;
  /** The stored pair a chipless row keeps until a chip is picked. */
  vatTerms: VatTerms;
  description: string;
  receipt: File | null;
  /** « Récurrent · le N du mois » — create only, opens a monthly subscription. */
  isRecurring: boolean;
  recurringDay: string;
};

function dayOfMonth(date: string): string {
  return String(Number(date.slice(8, 10)));
}

export function emptyExpenseDraft(today: string): ExpenseDraft {
  return {
    supplier: "",
    spentOn: today,
    category: 0,
    ttc: "",
    proShare: "100",
    vatChoice: "fr20",
    vatTerms: vatChoiceTerms("fr20"),
    description: "",
    receipt: null,
    isRecurring: false,
    recurringDay: dayOfMonth(today),
  };
}

export function expenseToDraft(
  format: MoneyFormat,
  expense: ExpenseData,
): ExpenseDraft {
  const vatTerms = {
    vatTreatment: expense.vatTreatment,
    vatRateBp: expense.vatRateBp,
  };

  return {
    supplier: expense.supplier,
    spentOn: expense.spentOn,
    category: expense.category,
    ttc: formatAmount(format, expense.amountTtc.amount),
    proShare: String(expense.proShareBp / 100),
    vatChoice: vatChoiceOf(vatTerms),
    vatTerms,
    description: expense.description ?? "",
    receipt: null,
    isRecurring: false,
    recurringDay: dayOfMonth(expense.spentOn),
  };
}

/** The pair the row will carry: the chip's, or the stored one while no chip is picked. */
export function draftVatTerms(
  draft: Pick<ExpenseDraft, "vatChoice" | "vatTerms">,
): VatTerms {
  return draft.vatChoice === null
    ? draft.vatTerms
    : vatChoiceTerms(draft.vatChoice);
}

/** The typed amount as positive cents, or null while it is not one yet. */
export function positiveCentsOrNull(
  format: MoneyFormat,
  typed: string,
): number | null {
  const cents = parseSignedAmountToCents(format.locale, typed);

  return cents === null || cents <= 0 ? null : cents;
}

export function draftTtcCents(
  format: MoneyFormat,
  draft: ExpenseDraft,
): number | null {
  return positiveCentsOrNull(format, draft.ttc);
}

/** Basis points, or null when the typed share is not a number. */
export function draftProShareBp(
  format: MoneyFormat,
  draft: Pick<ExpenseDraft, "proShare">,
): number | null {
  const share = parseDecimal(format.locale, draft.proShare);

  return share === null
    ? null
    : Math.round(Math.min(100, Math.max(0, share)) * 100);
}

/** 1–31 as typed, or null when it is not a day of a month. */
export function dayOfMonthOrNull(typed: string): number | null {
  const day = Number(typed);

  return Number.isInteger(day) && day >= 1 && day <= 31 ? day : null;
}

/** The day a recurring draft debits on, or null when the switch is on but the day is not one. */
export function draftRecurringDay(draft: ExpenseDraft): number | null {
  return dayOfMonthOrNull(draft.recurringDay);
}

/**
 * The payload the API takes, or null while the draft is not one yet. Under
 * the franchise en base there is no TVA to choose: every row is Domestic at 0.
 */
export function draftToPayload(
  format: MoneyFormat,
  draft: ExpenseDraft,
  isVatLiable: boolean,
): ExpenseInputData | null {
  const ttcCents = draftTtcCents(format, draft);
  const proShareBp = draftProShareBp(format, draft);
  const supplier = draft.supplier.trim();
  const recurringDay = draft.isRecurring ? draftRecurringDay(draft) : null;

  if (
    ttcCents === null ||
    proShareBp === null ||
    supplier === "" ||
    (draft.isRecurring && recurringDay === null)
  ) {
    return null;
  }

  const description = draft.description.trim();

  return {
    supplier,
    spentOn: draft.spentOn,
    category: draft.category,
    amountTtc: { amount: ttcCents, currency: format.currency },
    ...(isVatLiable ? draftVatTerms(draft) : { vatTreatment: 0, vatRateBp: 0 }),
    proShareBp,
    description: description === "" ? null : description,
    recurringDebitDay: recurringDay,
  };
}
