import type { ExpenseData } from "@opusline/api-client";

export type AmountUnit = "ht" | "ttc";

export function isAmountUnit(value: unknown): value is AmountUnit {
  return value === "ht" || value === "ttc";
}

export function expenseAmountCents(
  expense: ExpenseData,
  unit: AmountUnit,
): number {
  return unit === "ht" ? expense.amountHt.amount : expense.amountTtc.amount;
}
