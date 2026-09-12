import { expect, it } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import { readFieldCount, receiptSuggestionChanges } from "./receipt-suggestion";

it("turns what the receipt says into draft changes, each tagged", () => {
  const { changes, sources } = receiptSuggestionChanges(
    DEFAULT_MONEY_FORMAT,
    {
      textFound: true,
      supplier: { value: "Lunaprint", confidence: 2 },
      spentOn: { value: "2026-08-19", confidence: 2 },
      amountTtc: { value: { amount: 42_900, currency: "EUR" }, confidence: 2 },
      vat: { treatment: 0, rateBp: 2_000, confidence: 2 },
      description: { value: "Écran 27 pouces", confidence: 1 },
      category: 0,
    },
    true,
  );

  expect(changes).toEqual({
    supplier: "Lunaprint",
    spentOn: "2026-08-19",
    ttc: "429",
    vatTerms: { vatTreatment: 0, vatRateBp: 2_000 },
    vatChoice: "fr20",
    description: "Écran 27 pouces",
    category: 0,
  });
  expect(sources).toEqual({
    supplier: "read",
    spentOn: "read",
    ttc: "read",
    vatChoice: "read",
    description: "read",
    category: "suggested",
  });
  expect(readFieldCount(sources)).toBe(5);
});

it("says nothing about a field the receipt missed", () => {
  const { changes, sources } = receiptSuggestionChanges(
    DEFAULT_MONEY_FORMAT,
    {
      textFound: true,
      amountTtc: { value: { amount: 1_000, currency: "EUR" }, confidence: 0 },
    },
    true,
  );

  expect(changes).toEqual({ ttc: "10" });
  expect(sources).toEqual({ ttc: "read" });
});

it("keeps a rate no chip covers as the row's own terms", () => {
  const { changes } = receiptSuggestionChanges(
    DEFAULT_MONEY_FORMAT,
    { textFound: true, vat: { treatment: 0, rateBp: 210, confidence: 1 } },
    true,
  );

  expect(changes.vatChoice).toBeNull();
  expect(changes.vatTerms).toEqual({ vatTreatment: 0, vatRateBp: 210 });
});

it("drops the TVA under the franchise, where no field shows it", () => {
  const { changes, sources } = receiptSuggestionChanges(
    DEFAULT_MONEY_FORMAT,
    { textFound: true, vat: { treatment: 0, rateBp: 2_000, confidence: 2 } },
    false,
  );

  expect(changes).toEqual({});
  expect(readFieldCount(sources)).toBe(0);
});
