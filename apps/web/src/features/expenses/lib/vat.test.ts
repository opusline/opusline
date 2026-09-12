import { describe, expect, it } from "vitest";

import {
  expenseAmountsFromHt,
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

describe("expenseAmountsFromHt", () => {
  it.each([
    [2_400, { vatTreatment: 0, vatRateBp: 2_000 }, 10_000, [480, 2_880, 480]],
    [2_417, { vatTreatment: 1, vatRateBp: 2_000 }, 7_000, [483, 2_417, 338]],
    [31_200, { vatTreatment: 3, vatRateBp: 0 }, 10_000, [0, 31_200, 0]],
  ] as const)(
    "mirrors the API's amounts from %i HT",
    (ht, terms, shareBp, [vat, ttc, recoverable]) => {
      expect(expenseAmountsFromHt(ht, terms, shareBp)).toEqual({
        htCents: ht,
        vatCents: vat,
        ttcCents: ttc,
        recoverableCents: recoverable,
      });
    },
  );
});
