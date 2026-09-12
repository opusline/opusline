import { expect, it } from "vitest";

import { expenseReceiptHref, expensesBadgeQueryOptions } from "./expenses";

it("points at the receipt stream of one expense", () => {
  expect(expenseReceiptHref(41)).toMatch(/\/expenses\/41\/receipt$/);
});

it("never asks for the journal outside french fiscality", () => {
  expect(expensesBadgeQueryOptions(false).enabled).toBe(false);
  expect(expensesBadgeQueryOptions(true).enabled).toBe(true);
});
