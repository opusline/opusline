import { expect, it } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import {
  annualSubscription,
  reverseChargedSubscription,
  subscription,
} from "./subscription-fixtures";
import {
  debitDayLabel,
  occurrencesPerYear,
  subscriptionRegimeLabel,
  subscriptionStatus,
} from "./subscriptions";

it.each([
  [0, 12],
  [1, 4],
  [2, 1],
] as const)("debits %i times a year", (periodicity, count) => {
  expect(occurrencesPerYear(periodicity)).toBe(count);
});

it.each([
  [subscription(), "le 1"],
  [annualSubscription(), "le 15 janv."],
])("names the debit day, with the month for an annual one", (row, label) => {
  expect(debitDayLabel("fr-FR", row)).toBe(label);
});

it.each([
  [subscription(), "active"],
  [subscription({ isPaused: true }), "paused"],
  [subscription({ isPaused: true, cancelledOn: "2026-06-05" }), "cancelled"],
] as const)(
  "reads the status off the pause and the cancellation",
  (row, status) => {
    expect(subscriptionStatus(row)).toBe(status);
  },
);

it.each([
  [subscription(), /^20\s%$/],
  [reverseChargedSubscription(), /^autoliq\. 20\s% · 70\s% de 4,83\s€$/],
  [annualSubscription(), /^hors TVA$/],
])(
  "says the regime and the pro share of the TVA when partial",
  (row, label) => {
    expect(subscriptionRegimeLabel("fr-FR", DEFAULT_MONEY_FORMAT, row)).toMatch(
      label,
    );
  },
);
