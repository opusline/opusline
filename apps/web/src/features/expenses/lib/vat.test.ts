import { describe, expect, it } from "vitest";

import parity from "./expense-amounts-parity.json";
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
  // The triples are the API's own, kept in JSON rather than inline so the PHP
  // side can read the same bytes.
  // TODO: point ExpenseAmountsTest.php's dataset at
  // apps/web/src/features/expenses/lib/expense-amounts-parity.json (the file
  // names that test back). Until it does, the two datasets are only kept in
  // step by hand, which is the drift this file exists to stop.
  it.each(parity.domesticFromTtc)(
    "derives the HT the API will store: $case",
    ({ ttcCents, rateBp, htCents }) => {
      const amounts = expenseAmountsFromTtc(
        ttcCents,
        { vatTreatment: 0, vatRateBp: rateBp },
        10_000,
      );

      expect(amounts.htCents).toBe(htCents);
      expect(amounts.vatCents).toBe(ttcCents - htCents);
      expect(amounts.recoverableCents).toBe(ttcCents - htCents);
    },
  );

  it("rounds a half-cent share up, the way ROUND_HALF_UP does", () => {
    expect(
      expenseAmountsFromTtc(9, vatChoiceTerms("fr20"), 10_000).htCents,
    ).toBe(8);
    expect(
      expenseAmountsFromTtc(3, vatChoiceTerms("fr20"), 10_000).htCents,
    ).toBe(3);
  });

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
