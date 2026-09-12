import { describe, expect, it } from "vitest";

import {
  expenseAmountsFromTtc,
  VAT_CHOICES,
  vatChoiceOf,
  vatChoiceTerms,
} from "./vat";

describe("the chips and the API pairs", () => {
  it("maps every chip to its treatment and rate and back", () => {
    for (const choice of VAT_CHOICES) {
      expect(vatChoiceOf(vatChoiceTerms(choice))).toBe(choice);
    }
  });

  it("has no chip for a rate the sheet does not offer", () => {
    expect(vatChoiceOf({ vatTreatment: 0, vatRateBp: 210 })).toBeNull();
  });
});

describe("expenseAmountsFromTtc", () => {
  it.each([
    [1_439, "fr20", 1_199],
    [2_900, "fr20", 2_417],
    [8_900, "fr10", 8_091],
    [1_200, "fr55", 1_137],
    [1, "fr20", 1],
    [3, "fr20", 3],
    [9, "fr20", 8],
  ] as const)(
    "derives the HT the API will store: %i at %s → %i",
    (ttc, choice, ht) => {
      const amounts = expenseAmountsFromTtc(
        ttc,
        vatChoiceTerms(choice),
        10_000,
      );

      expect(amounts.htCents).toBe(ht);
      expect(amounts.vatCents).toBe(ttc - ht);
      expect(amounts.recoverableCents).toBe(ttc - ht);
    },
  );

  it("self-assesses the rate on a reverse-charged purchase", () => {
    expect(
      expenseAmountsFromTtc(4_800, vatChoiceTerms("nonEu"), 10_000),
    ).toEqual({
      htCents: 4_800,
      vatCents: 960,
      ttcCents: 4_800,
      recoverableCents: 960,
    });
  });

  it("carries no TVA on an exempt purchase", () => {
    expect(
      expenseAmountsFromTtc(31_200, vatChoiceTerms("exempt"), 10_000).vatCents,
    ).toBe(0);
  });

  it("recovers only the pro share", () => {
    expect(
      expenseAmountsFromTtc(2_900, vatChoiceTerms("fr20"), 7_000)
        .recoverableCents,
    ).toBe(338);
  });

  it("keeps a rate no chip covers", () => {
    expect(
      expenseAmountsFromTtc(10_000, { vatTreatment: 0, vatRateBp: 210 }, 10_000)
        .htCents,
    ).toBe(9_794);
  });
});
