import type { ExpenseData, ExpensesMonthData } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

export type ExpenseFilter =
  | "all"
  | "blocked"
  | "reverseCharged"
  | "deferred"
  | "platform";

const FILTER_MESSAGES: Record<ExpenseFilter, () => string> = {
  all: m.expense_filter_all,
  blocked: m.expense_filter_blocked,
  reverseCharged: m.expense_filter_reverse_charged,
  deferred: m.expense_filter_deferred,
  platform: m.expense_filter_platform,
};

export function expenseFilterLabel(filter: ExpenseFilter): string {
  return FILTER_MESSAGES[filter]();
}

/** Whether the plateforme agréée delivered the expense's invoice. */
export function isPlatformExpense(expense: ExpenseData): boolean {
  return expense.eInvoice !== null;
}

/**
 * The chips a month offers: the TVA ones only mean something under réel
 * normal, and the platform one only once an invoice came through it.
 */
export function expenseFilters(
  month: Pick<ExpensesMonthData, "vat" | "expenses">,
): readonly ExpenseFilter[] {
  const base: ExpenseFilter[] =
    month.vat === null
      ? ["all", "blocked"]
      : ["all", "blocked", "reverseCharged", "deferred"];

  return month.expenses.some(isPlatformExpense) ? [...base, "platform"] : base;
}

export function matchesExpenseFilter(
  expense: ExpenseData,
  filter: ExpenseFilter,
  month: Pick<ExpensesMonthData, "vat">,
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "blocked":
      return month.vat === null
        ? expense.receipt === null
        : expense.vatStatus === 3;
    case "reverseCharged":
      return expense.vatStatus === 4;
    case "deferred":
      return expense.vatStatus === 2;
    case "platform":
      return isPlatformExpense(expense);
  }
}

/**
 * Whether « Reporter » / « Réintégrer » applies. Reverse-charged and exempt
 * rows have no deduction to move, a deducted one sits on a filed CA3 (the API
 * answers 409), and the franchise deducts nothing.
 */
export function hasMovableVat(
  expense: ExpenseData,
  month: Pick<ExpensesMonthData, "vat">,
): boolean {
  return (
    month.vat !== null &&
    expense.vatStatus !== 1 &&
    expense.vatStatus !== 4 &&
    expense.vatStatus !== 5
  );
}
