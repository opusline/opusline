import { expect, it } from "vitest";

import { DEFAULT_MONEY_FORMAT, formatWholeAmount } from "@/lib/billing";

import { creditVatDeclaration, vatDeclaration } from "./fixtures";
import {
  ca3CopyLines,
  ca3Rows,
  declarationCopyValue,
  declarationDeadlineTone,
} from "./labels";

const money = (cents: number) => formatWholeAmount(DEFAULT_MONEY_FORMAT, cents);

it.each([
  [210_980, "2110"],
  [49, "0"],
])("rounds %i cents to whole euros for the clipboard", (cents, copied) => {
  expect(declarationCopyValue(cents)).toBe(copied);
});

it.each([
  [18, "quiet"],
  [5, "attention"],
  [0, "attention"],
  [-1, "overdue"],
] as const)("reads a deadline %i days away as %s", (daysLeft, tone) => {
  expect(declarationDeadlineTone({ dueOn: "2026-08-31", daysLeft })).toBe(tone);
});

it("only lists box 25 when the month ends in credit", () => {
  expect(
    ca3Rows(vatDeclaration(), "fr-FR", money).map((row) => row.box),
  ).not.toContain("25");
  expect(
    ca3Rows(creditVatDeclaration(), "fr-FR", money).map((row) => row.box),
  ).toContain("25");
});

it("copies the dual line as two entries under the same box", () => {
  const rows = ca3Rows(vatDeclaration(), "fr-FR", money);

  expect(ca3CopyLines(rows).filter((line) => line.startsWith("08\t"))).toEqual([
    "08\t10549",
    "08\t2110",
  ]);
});
