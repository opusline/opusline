import { expect, it } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import {
  draftToSubscriptionPayload,
  emptySubscriptionDraft,
  subscriptionToDraft,
  subscriptionToPayload,
} from "./subscription-draft";
import { annualSubscription, subscription } from "./subscription-fixtures";

it("starts on today's day, monthly, auto-created and provisioned", () => {
  const draft = emptySubscriptionDraft("2026-09-12");

  expect(draft.debitDay).toBe("12");
  expect(draft.debitMonth).toBe(9);
  expect(draft.periodicity).toBe(0);
  expect(draft.autoCreateExpenses).toBe(true);
  expect(
    draftToSubscriptionPayload(DEFAULT_MONEY_FORMAT, draft, true),
  ).toBeNull();
});

it("sends the typed subscription as the API takes it", () => {
  const draft = {
    ...emptySubscriptionDraft("2026-09-12"),
    supplier: " Nordlys Cloud ",
    ht: "24,00",
    proShare: "70",
    description: "",
    customerSpaceUrl: "https://espace.nordlys.example",
  };

  expect(draftToSubscriptionPayload(DEFAULT_MONEY_FORMAT, draft, true)).toEqual(
    {
      supplier: "Nordlys Cloud",
      category: 1,
      description: null,
      amountHt: { amount: 2_400, currency: "EUR" },
      vatTreatment: 0,
      vatRateBp: 2_000,
      proShareBp: 7_000,
      periodicity: 0,
      debitDay: 12,
      debitMonth: null,
      startedOn: "2026-09-12",
      customerSpaceUrl: "https://espace.nordlys.example",
      autoCreateExpenses: true,
      provisionMonthly: false,
    },
  );
});

it("keeps the month and the provision only for an annual debit", () => {
  const draft = {
    ...emptySubscriptionDraft("2026-09-12"),
    supplier: "Orvella Assurances",
    ht: "312",
    periodicity: 2 as const,
    debitDay: "15",
    debitMonth: 1,
    provisionMonthly: true,
  };

  expect(
    draftToSubscriptionPayload(DEFAULT_MONEY_FORMAT, draft, true),
  ).toMatchObject({
    periodicity: 2,
    debitDay: 15,
    debitMonth: 1,
    provisionMonthly: true,
  });
});

it("sends Domestic at 0 under the franchise", () => {
  const draft = {
    ...emptySubscriptionDraft("2026-09-12"),
    supplier: "X",
    ht: "10",
  };

  expect(
    draftToSubscriptionPayload(DEFAULT_MONEY_FORMAT, draft, false),
  ).toMatchObject({
    vatTreatment: 0,
    vatRateBp: 0,
  });
});

it("refuses a day outside the month", () => {
  const draft = {
    ...emptySubscriptionDraft("2026-09-12"),
    supplier: "X",
    ht: "10",
    debitDay: "32",
  };

  expect(
    draftToSubscriptionPayload(DEFAULT_MONEY_FORMAT, draft, true),
  ).toBeNull();
});

it("reads a stored row back into the sheet", () => {
  const draft = subscriptionToDraft(DEFAULT_MONEY_FORMAT, annualSubscription());

  expect(draft).toMatchObject({
    supplier: "Orvella Assurances",
    ht: "312",
    proShare: "100",
    vatChoice: "exempt",
    periodicity: 2,
    debitDay: "15",
    debitMonth: 1,
    provisionMonthly: true,
  });
});

it("rebuilds the input from a row to flip one flag", () => {
  expect(
    subscriptionToPayload(subscription(), { provisionMonthly: true }),
  ).toMatchObject({
    supplier: "Nordlys Cloud",
    amountHt: { amount: 2_400, currency: "EUR" },
    debitDay: 1,
    provisionMonthly: true,
  });
});
