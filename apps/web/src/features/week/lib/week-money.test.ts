import type {
  ClientWithMissionsData,
  TimeEntryData,
} from "@opusline/api-client";
import { expect, it } from "vitest";

import { summarizeWeekBillable } from "./week-money";

function mission(
  overrides: Partial<ClientWithMissionsData["missions"][number]>,
) {
  return {
    id: 1,
    slug: "orvella-front",
    clientId: 1,
    name: "Orvella front",
    endClientName: null,
    billingMode: 0 as const,
    rate: { amount: 55_000, currency: "EUR" as const },
    rounding: null,
    status: 0 as const,
    craRequired: false,
    color: null,
    notes: null,
    startDate: null,
    endDate: null,
    ...overrides,
  };
}

function clients(
  missions: ClientWithMissionsData["missions"],
): ClientWithMissionsData[] {
  return [
    {
      id: 1,
      slug: "orvella",
      name: "Orvella",
      type: 0,
      notes: null,
      siret: null,
      vatNumber: null,
      billingAddressLine1: null,
      billingAddressLine2: null,
      billingPostalCode: null,
      billingCity: null,
      billingCountry: null,
      billingContactName: null,
      billingEmail: null,
      color: 0,
      paymentTermsDays: 45,
      archivedAt: null,
      createdAt: "2026-01-01T00:00:00+00:00",
      missions,
    },
  ];
}

function entry(overrides: Partial<TimeEntryData> = {}): TimeEntryData {
  return {
    id: 1,
    missionId: 1,
    date: "2026-08-10",
    durationMinutes: 480,
    rounding: null,
    valuedMinutes: null,
    valuedDayFraction: 1,
    billable: true,
    note: null,
    ...overrides,
  };
}

it("values a day-billed entry at the mission's daily rate", () => {
  const summary = summarizeWeekBillable(clients([mission({})]), [entry()]);

  expect(summary.amountCents).toBe(55_000);
  expect(summary.valuedEntryCount).toBe(1);
});

it("values a half day at half the daily rate", () => {
  const summary = summarizeWeekBillable(clients([mission({})]), [
    entry({ valuedDayFraction: 0.5 }),
  ]);

  expect(summary.amountCents).toBe(27_500);
});

it("values an hourly entry by its minutes", () => {
  const summary = summarizeWeekBillable(
    clients([
      mission({ billingMode: 1, rate: { amount: 8_500, currency: "EUR" } }),
    ]),
    [entry({ valuedDayFraction: null, valuedMinutes: 90 })],
  );

  expect(summary.amountCents).toBe(12_750);
});

it("adds up every entry of the week", () => {
  const summary = summarizeWeekBillable(clients([mission({})]), [
    entry({ id: 1, valuedDayFraction: 1 }),
    entry({ id: 2, valuedDayFraction: 0.5 }),
  ]);

  expect(summary.amountCents).toBe(82_500);
  expect(summary.valuedEntryCount).toBe(2);
});

it("leaves an entry marked non billable out of the figure", () => {
  const summary = summarizeWeekBillable(clients([mission({})]), [
    entry({ billable: false }),
  ]);

  expect(summary.amountCents).toBe(0);
  expect(summary.nonBillableEntryCount).toBe(1);
  expect(summary.valuedEntryCount).toBe(0);
});

it("counts forfait time separately instead of inventing revenue for it", () => {
  const summary = summarizeWeekBillable(
    clients([
      mission({ billingMode: 2, rate: { amount: 900_000, currency: "EUR" } }),
    ]),
    [entry()],
  );

  expect(summary.amountCents).toBe(0);
  expect(summary.fixedPriceEntryCount).toBe(1);
});

it("skips a mission that carries no rate at all", () => {
  const summary = summarizeWeekBillable(clients([mission({ rate: null })]), [
    entry(),
  ]);

  expect(summary.amountCents).toBe(0);
  expect(summary.valuedEntryCount).toBe(0);
});

it("ignores an entry whose mission is not in the loaded clients", () => {
  const summary = summarizeWeekBillable(clients([mission({})]), [
    entry({ missionId: 999 }),
  ]);

  expect(summary.amountCents).toBe(0);
});

it("reports zero for a week with no entries", () => {
  const summary = summarizeWeekBillable(clients([mission({})]), []);

  expect(summary).toEqual({
    amountCents: 0,
    valuedEntryCount: 0,
    nonBillableEntryCount: 0,
    fixedPriceEntryCount: 0,
  });
});
