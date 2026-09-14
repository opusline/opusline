import type { BankProvisionData } from "@opusline/api-client";
import { expect, it } from "vitest";

import { eur, treasuryData } from "@/test/fixtures";

import { treasuryBands } from "./bands";
import {
  emptyTreasuryData,
  noVatTreasuryData,
  shortTreasuryData,
} from "./fixtures";

it("splits the balance into three provisions and what is left", () => {
  const bands = treasuryBands(treasuryData());

  expect(bands.map((band) => band.key)).toEqual([
    "vat",
    "urssaf",
    "buffer",
    "transferable",
  ]);
  expect(bands.reduce((sum, band) => sum + band.ratio, 0)).toBeCloseTo(1);
});

it("draws a band for every kind of provision the DTO carries", () => {
  const owed = (amountCents: number): BankProvisionData => ({
    amount: eur(amountCents),
    carried: eur(0),
    rateBp: null,
    deductible: null,
    periodEnd: "2026-08-31",
  });
  const data = treasuryData({
    provisions: {
      vat: owed(209_000),
      urssaf: owed(271_700),
      cfe: owed(52_000),
      subscriptions: owed(18_000),
      buffer: eur(150_000),
      total: eur(700_700),
    },
    transferable: eur(781_300),
  });
  // Read off the payload rather than listed: a sixth kind of provision the API
  // starts sending is a band the bar must draw, not an unlabelled gap in it.
  const kinds = Object.keys(data.provisions).filter((key) => key !== "total");
  const bands = treasuryBands(data);

  expect(bands.map((band) => band.key)).toEqual([...kinds, "transferable"]);
  expect(bands.reduce((sum, band) => sum + band.ratio, 0)).toBeCloseTo(1);
});

it("drops the transferable band when the provisions outgrow the account", () => {
  const bands = treasuryBands(shortTreasuryData());

  expect(bands.map((band) => band.key)).not.toContain("transferable");
  expect(bands.reduce((sum, band) => sum + band.ratio, 0)).toBeCloseTo(1);
});

it("draws nothing without a balance to split", () => {
  expect(treasuryBands(emptyTreasuryData())).toEqual([]);
});

it("leaves out a provision the account does not owe", () => {
  expect(
    treasuryBands(noVatTreasuryData()).map((band) => band.key),
  ).not.toContain("vat");
});

it("draws no bar when everything on the account is zero", () => {
  expect(
    treasuryBands(
      treasuryData({
        transferable: { amount: 0, currency: "EUR" },
        provisions: {
          vat: null,
          urssaf: null,
          cfe: null,
          subscriptions: null,
          buffer: null,
          total: { amount: 0, currency: "EUR" },
        },
      }),
    ),
  ).toEqual([]);
});
