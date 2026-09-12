import { describe, expect, it } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import {
  draftToPayload,
  emptyExpenseDraft,
  expenseToDraft,
} from "./expense-draft";
import { deferredExpense, expense } from "./fixtures";

const ready = {
  ...emptyExpenseDraft("2026-08-13"),
  supplier: "Lunaprint",
  ttc: "10",
};

describe("draftToPayload", () => {
  it("is nothing until the supplier and a positive amount are there", () => {
    const draft = emptyExpenseDraft("2026-08-13");

    expect(draftToPayload(DEFAULT_MONEY_FORMAT, draft, true)).toBeNull();
    expect(
      draftToPayload(
        DEFAULT_MONEY_FORMAT,
        { ...draft, supplier: "Lunaprint" },
        true,
      ),
    ).toBeNull();
    expect(
      draftToPayload(DEFAULT_MONEY_FORMAT, { ...ready, ttc: "0" }, true),
    ).toBeNull();
  });

  it("carries the chip's terms, the share in basis points and the cents", () => {
    expect(
      draftToPayload(
        DEFAULT_MONEY_FORMAT,
        {
          ...emptyExpenseDraft("2026-08-13"),
          supplier: " Callisto Télécom ",
          ttc: "1 234,56",
          proShare: "70",
          vatChoice: "eu",
          description: "  ",
        },
        true,
      ),
    ).toEqual({
      supplier: "Callisto Télécom",
      spentOn: "2026-08-13",
      category: 0,
      amountTtc: { amount: 123_456, currency: "EUR" },
      vatTreatment: 1,
      vatRateBp: 2_000,
      proShareBp: 7_000,
      description: null,
      recurringDebitDay: null,
    });
  });

  it("keeps the stored rate of a row no chip covers", () => {
    const draft = expenseToDraft(
      DEFAULT_MONEY_FORMAT,
      expense({ vatRateBp: 210 }),
    );

    expect(draft.vatChoice).toBeNull();
    expect(draftToPayload(DEFAULT_MONEY_FORMAT, draft, true)).toMatchObject({
      vatRateBp: 210,
    });
    expect(
      draftToPayload(
        DEFAULT_MONEY_FORMAT,
        { ...draft, vatChoice: "fr10" },
        true,
      ),
    ).toMatchObject({ vatRateBp: 1_000 });
  });

  it("waits for a readable share and clamps it to a hundred", () => {
    expect(
      draftToPayload(DEFAULT_MONEY_FORMAT, { ...ready, proShare: "7O" }, true),
    ).toBeNull();
    expect(
      draftToPayload(DEFAULT_MONEY_FORMAT, { ...ready, proShare: "140" }, true)
        ?.proShareBp,
    ).toBe(10_000);
  });

  it("needs a day of the month once the expense recurs", () => {
    expect(
      draftToPayload(
        DEFAULT_MONEY_FORMAT,
        { ...ready, isRecurring: true, recurringDay: "12" },
        true,
      )?.recurringDebitDay,
    ).toBe(12);
    expect(
      draftToPayload(
        DEFAULT_MONEY_FORMAT,
        { ...ready, isRecurring: true, recurringDay: "40" },
        true,
      ),
    ).toBeNull();
    expect(
      draftToPayload(
        DEFAULT_MONEY_FORMAT,
        { ...ready, isRecurring: true, recurringDay: "" },
        true,
      ),
    ).toBeNull();
    expect(
      draftToPayload(
        DEFAULT_MONEY_FORMAT,
        { ...ready, recurringDay: "12" },
        true,
      )?.recurringDebitDay,
    ).toBeNull();
  });

  it("sends no TVA at all under the franchise", () => {
    expect(
      draftToPayload(
        DEFAULT_MONEY_FORMAT,
        { ...ready, vatChoice: "eu" },
        false,
      ),
    ).toMatchObject({ vatTreatment: 0, vatRateBp: 0 });
  });
});

describe("expenseToDraft", () => {
  it("lands the row on its chip with the share as a percentage", () => {
    expect(
      expenseToDraft(DEFAULT_MONEY_FORMAT, deferredExpense()),
    ).toMatchObject({
      supplier: "Callisto Télécom",
      ttc: "29",
      proShare: "70",
      vatChoice: "fr20",
      description: "Forfait mobile",
      receipt: null,
    });
  });
});
