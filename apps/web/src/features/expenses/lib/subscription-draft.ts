import type {
  ExpenseCategory,
  SubscriptionData,
  SubscriptionInputData,
  SubscriptionPeriodicity,
} from "@opusline/api-client";

import { formatAmount, type MoneyFormat } from "@/lib/billing";

import {
  dayOfMonthOrNull,
  draftProShareBp,
  draftVatTerms,
  positiveCentsOrNull,
} from "./expense-draft";
import {
  type VatChoice,
  type VatTerms,
  vatChoiceOf,
  vatChoiceTerms,
} from "./vat";

/** What the subscription sheet edits, every field as typed. */
export type SubscriptionDraft = {
  supplier: string;
  category: ExpenseCategory;
  description: string;
  /** The HT amount as typed, in the user's locale. */
  ht: string;
  /** The pro share as typed, 0–100. */
  proShare: string;
  vatChoice: VatChoice | null;
  vatTerms: VatTerms;
  periodicity: SubscriptionPeriodicity;
  /** 1–31, as typed. */
  debitDay: string;
  /** 1–12, the annual debit's month. */
  debitMonth: number;
  /** `Y-m-d`. */
  startedOn: string;
  customerSpaceUrl: string;
  autoCreateExpenses: boolean;
  provisionMonthly: boolean;
};

export function emptySubscriptionDraft(today: string): SubscriptionDraft {
  return {
    supplier: "",
    category: 1,
    description: "",
    ht: "",
    proShare: "100",
    vatChoice: "fr20",
    vatTerms: vatChoiceTerms("fr20"),
    periodicity: 0,
    debitDay: String(Number(today.slice(8, 10))),
    debitMonth: Number(today.slice(5, 7)),
    startedOn: today,
    customerSpaceUrl: "",
    autoCreateExpenses: true,
    provisionMonthly: true,
  };
}

export function subscriptionToDraft(
  format: MoneyFormat,
  subscription: SubscriptionData,
): SubscriptionDraft {
  const vatTerms = {
    vatTreatment: subscription.vatTreatment,
    vatRateBp: subscription.vatRateBp,
  };

  return {
    supplier: subscription.supplier,
    category: subscription.category,
    description: subscription.description ?? "",
    ht: formatAmount(format, subscription.amountHt.amount),
    proShare: String(subscription.proShareBp / 100),
    vatChoice: vatChoiceOf(vatTerms),
    vatTerms,
    periodicity: subscription.periodicity,
    debitDay: String(subscription.debitDay),
    debitMonth:
      subscription.debitMonth ?? Number(subscription.startedOn.slice(5, 7)),
    startedOn: subscription.startedOn,
    customerSpaceUrl: subscription.customerSpaceUrl ?? "",
    autoCreateExpenses: subscription.autoCreateExpenses,
    provisionMonthly: subscription.provisionMonthly,
  };
}

export function draftHtCents(
  format: MoneyFormat,
  draft: Pick<SubscriptionDraft, "ht">,
): number | null {
  return positiveCentsOrNull(format, draft.ht);
}

export function draftDebitDay(draft: SubscriptionDraft): number | null {
  return dayOfMonthOrNull(draft.debitDay);
}

/**
 * The payload the API takes, or null while the draft is not one yet. Under
 * the franchise en base there is no TVA to choose: Domestic at 0. The
 * provision only means something for an annual debit.
 */
export function draftToSubscriptionPayload(
  format: MoneyFormat,
  draft: SubscriptionDraft,
  isVatLiable: boolean,
): SubscriptionInputData | null {
  const htCents = draftHtCents(format, draft);
  const proShareBp = draftProShareBp(format, draft);
  const debitDay = draftDebitDay(draft);
  const supplier = draft.supplier.trim();

  if (
    htCents === null ||
    proShareBp === null ||
    debitDay === null ||
    supplier === ""
  ) {
    return null;
  }

  const description = draft.description.trim();
  const customerSpaceUrl = draft.customerSpaceUrl.trim();
  const isAnnual = draft.periodicity === 2;

  return {
    supplier,
    category: draft.category,
    description: description === "" ? null : description,
    amountHt: { amount: htCents, currency: format.currency },
    ...(isVatLiable ? draftVatTerms(draft) : { vatTreatment: 0, vatRateBp: 0 }),
    proShareBp,
    periodicity: draft.periodicity,
    debitDay,
    debitMonth: isAnnual ? draft.debitMonth : null,
    startedOn: draft.startedOn,
    customerSpaceUrl: customerSpaceUrl === "" ? null : customerSpaceUrl,
    autoCreateExpenses: draft.autoCreateExpenses,
    provisionMonthly: isAnnual && draft.provisionMonthly,
  };
}

/** The stored row as the input the API takes, for a write that flips one flag. */
export function subscriptionToPayload(
  subscription: SubscriptionData,
  changes: Pick<SubscriptionInputData, "provisionMonthly">,
): SubscriptionInputData {
  return {
    supplier: subscription.supplier,
    category: subscription.category,
    description: subscription.description,
    amountHt: subscription.amountHt,
    vatTreatment: subscription.vatTreatment,
    vatRateBp: subscription.vatRateBp,
    proShareBp: subscription.proShareBp,
    periodicity: subscription.periodicity,
    debitDay: subscription.debitDay,
    debitMonth: subscription.debitMonth,
    startedOn: subscription.startedOn,
    customerSpaceUrl: subscription.customerSpaceUrl,
    autoCreateExpenses: subscription.autoCreateExpenses,
    provisionMonthly: subscription.provisionMonthly,
    ...changes,
  };
}
