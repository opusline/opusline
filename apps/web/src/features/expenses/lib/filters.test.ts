import { expect, it } from "vitest";

import { expenseFilters, hasMovableVat, matchesExpenseFilter } from "./filters";
import {
  blockedExpense,
  deductedExpense,
  deferredExpense,
  exemptExpense,
  expense,
  expensesMonth,
  franchiseExpensesMonth,
  reverseChargedExpense,
} from "./fixtures";

it("offers the TVA filters only under réel normal", () => {
  expect(expenseFilters(expensesMonth())).toEqual([
    "all",
    "blocked",
    "reverseCharged",
    "deferred",
  ]);
  expect(expenseFilters(franchiseExpensesMonth())).toEqual(["all", "blocked"]);
});

it("keeps the rows a filter names", () => {
  const month = expensesMonth();

  expect(matchesExpenseFilter(blockedExpense(), "blocked", month)).toBe(true);
  expect(matchesExpenseFilter(expense(), "blocked", month)).toBe(false);
  expect(
    matchesExpenseFilter(reverseChargedExpense(), "reverseCharged", month),
  ).toBe(true);
  expect(matchesExpenseFilter(deferredExpense(), "deferred", month)).toBe(true);
  expect(matchesExpenseFilter(exemptExpense(), "all", month)).toBe(true);
});

it("reads « sans justificatif » off the receipt under the franchise", () => {
  const month = franchiseExpensesMonth();

  expect(
    matchesExpenseFilter(
      expense({ receipt: null, vatStatus: 5 }),
      "blocked",
      month,
    ),
  ).toBe(true);
  expect(
    matchesExpenseFilter(expense({ vatStatus: 5 }), "blocked", month),
  ).toBe(false);
});

it("lets only a deduction be deferred or reintegrated", () => {
  const month = expensesMonth();

  expect(hasMovableVat(expense(), month)).toBe(true);
  expect(hasMovableVat(deferredExpense(), month)).toBe(true);
  expect(hasMovableVat(reverseChargedExpense(), month)).toBe(false);
  expect(hasMovableVat(exemptExpense(), month)).toBe(false);
  expect(hasMovableVat(expense(), franchiseExpensesMonth())).toBe(false);
  expect(hasMovableVat(deductedExpense(), month)).toBe(false);
});
