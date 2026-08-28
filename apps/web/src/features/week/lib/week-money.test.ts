import type {
  ClientWithMissionsData,
  MissionData,
  TimeEntryData,
} from "@opusline/api-client";
import { expect, it } from "vitest";

import { eur } from "@/test/fixtures";

import {
  DEMO_CLIENTS,
  DEMO_MISSIONS,
  DEMO_TIME_ENTRIES,
} from "./week-fixtures";
import { summarizeWeekBillable } from "./week-money";

const [NORDLYS] = DEMO_CLIENTS;
const [BILLED_DAY] = DEMO_TIME_ENTRIES;

function mission(overrides: Partial<MissionData>): MissionData {
  return { ...DEMO_MISSIONS.orvella, ...overrides };
}

function clients(missions: MissionData[]): ClientWithMissionsData[] {
  return [{ ...NORDLYS, missions }];
}

function entry(overrides: Partial<TimeEntryData> = {}): TimeEntryData {
  return { ...BILLED_DAY, ...overrides };
}

it("values a day-billed entry at the mission's daily rate", () => {
  const summary = summarizeWeekBillable(clients([mission({})]), [entry()]);

  expect(summary.amountCents).toBe(55_000);
  expect(summary.valuedEntryCount).toBe(1);
});

it("values a half day at half the daily rate", () => {
  const summary = summarizeWeekBillable(clients([mission({})]), [
    entry({
      valuedDayFraction: 0.5,
      value: eur(27_500),
    }),
  ]);

  expect(summary.amountCents).toBe(27_500);
});

it("values an hourly entry by its minutes", () => {
  const summary = summarizeWeekBillable(
    clients([
      mission({ billingMode: 1, rate: { amount: 8_500, currency: "EUR" } }),
    ]),
    [
      entry({
        valuedDayFraction: null,
        valuedMinutes: 90,
        value: eur(12_750),
      }),
    ],
  );

  expect(summary.amountCents).toBe(12_750);
});

it("adds up every entry of the week", () => {
  const summary = summarizeWeekBillable(clients([mission({})]), [
    entry({ id: 1, valuedDayFraction: 1 }),
    entry({
      id: 2,
      valuedDayFraction: 0.5,
      value: eur(27_500),
    }),
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

it("counts an entry the API put no figure on as unrated", () => {
  const summary = summarizeWeekBillable(clients([mission({ rate: null })]), [
    entry({ value: null }),
  ]);

  expect(summary.amountCents).toBe(0);
  expect(summary.valuedEntryCount).toBe(0);
  expect(summary.unratedEntryCount).toBe(1);
});

it("still counts the API's figure when the mission is not in the loaded clients", () => {
  const summary = summarizeWeekBillable(clients([mission({})]), [
    entry({ missionId: 999 }),
  ]);

  expect(summary.amountCents).toBe(55_000);
  expect(summary.valuedEntryCount).toBe(1);
});

it("counts forfait time as forfait even before its price is set", () => {
  const summary = summarizeWeekBillable(
    clients([mission({ billingMode: 2, rate: null })]),
    [entry({ value: null })],
  );

  expect(summary.fixedPriceEntryCount).toBe(1);
  expect(summary.unratedEntryCount).toBe(0);
});

it("reports zero for a week with no entries", () => {
  const summary = summarizeWeekBillable(clients([mission({})]), []);

  expect(summary).toEqual({
    amountCents: 0,
    valuedEntryCount: 0,
    nonBillableEntryCount: 0,
    fixedPriceEntryCount: 0,
    unratedEntryCount: 0,
  });
});
