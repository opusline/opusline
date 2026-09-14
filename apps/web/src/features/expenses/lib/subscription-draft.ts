import type {
  ExpenseCategory,
  RecurringDebitData,
  SubscriptionData,
  SubscriptionInputData,
  SubscriptionPeriodicity,
} from "@opusline/api-client";

import { formatAmount, type MoneyFormat } from "@/lib/billing";
import { monthEnd } from "@/lib/months";
import { m } from "@/paraglide/messages.js";

import {
  dayOfMonthOrNull,
  draftProShareBp,
  draftVatTerms,
  positiveCentsOrNull,
} from "./expense-draft";
import {
  expenseAmountsFromTtc,
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

/**
 * A recurring debit the compte pro shows, opened as a new subscription. The
 * debit is TTC and the sheet is priced HT, so the draft opens at the HT a 20 %
 * purchase would carry: the regime chips put it right if not.
 */
export function recurringDebitToDraft(
  format: MoneyFormat,
  debit: RecurringDebitData,
  today: string,
): SubscriptionDraft {
  const [firstMonth] = debit.months;

  return {
    ...emptySubscriptionDraft(today),
    supplier: debit.label,
    description: m.subscriptions_detected_description(),
    ht: formatAmount(
      format,
      expenseAmountsFromTtc(debit.amount.amount, vatChoiceTerms("fr20"), 10_000)
        .htCents,
    ),
    debitDay: String(debit.debitDay),
    startedOn:
      firstMonth === undefined
        ? today
        : debitDateIn(firstMonth, debit.debitDay),
  };
}

/** A day 31 debit lands on the last day of a shorter month, as the bank books it. */
function debitDateIn(month: string, debitDay: number): string {
  const lastDay = monthEnd(month);
  const debitDate = `${month}-${String(debitDay).padStart(2, "0")}`;

  return debitDate < lastDay ? debitDate : lastDay;
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
