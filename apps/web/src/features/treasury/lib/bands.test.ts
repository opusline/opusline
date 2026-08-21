import { expect, it } from "vitest";

import { treasuryData } from "@/test/fixtures";

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
          buffer: null,
          total: { amount: 0, currency: "EUR" },
        },
      }),
    ),
  ).toEqual([]);
});
