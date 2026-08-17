import type { TreasuryData } from "@opusline/api-client";
import { expect, it } from "vitest";

import { treasuryBands } from "./bands";

function money(amount: number) {
  return { amount, currency: "EUR" as const };
}

function treasury(overrides: Partial<TreasuryData> = {}): TreasuryData {
  return {
    balance: {
      amount: money(500_000),
      source: 0,
      asOf: "2026-08-10",
    },
    provisions: {
      vat: null,
      urssaf: null,
      buffer: null,
      total: money(0),
    },
    transferable: money(500_000),
    shortfall: null,
    pendingTransfers: money(0),
    transfers: [],
    ...overrides,
  };
}

it("shows only the transferable band when nothing is provisioned", () => {
  const bands = treasuryBands(treasury());

  expect(bands.map((band) => band.key)).toEqual(["transferable"]);
  expect(bands[0]?.shareBp).toBe(10_000);
});

it("drops a claim that takes nothing rather than showing an empty band", () => {
  // A franchise en base has no VAT to provision at all.
  const bands = treasuryBands(
    treasury({
      provisions: {
        vat: null,
        urssaf: { amount: money(100_000), rateBp: 2600 },
        buffer: null,
        total: money(100_000),
      },
      transferable: money(400_000),
    }),
  );

  expect(bands.map((band) => band.key)).toEqual(["urssaf", "transferable"]);
});

it("splits the balance proportionally across every claim on it", () => {
  const bands = treasuryBands(
    treasury({
      provisions: {
        vat: { amount: money(100_000), rateBp: null },
        urssaf: { amount: money(100_000), rateBp: 2600 },
        buffer: money(50_000),
        total: money(250_000),
      },
      transferable: money(250_000),
    }),
  );

  expect(bands.map((band) => band.key)).toEqual([
    "vat",
    "urssaf",
    "buffer",
    "transferable",
  ]);
  expect(bands.reduce((sum, band) => sum + band.shareBp, 0)).toBe(10_000);
});

it("gives money already transferred its own band", () => {
  const bands = treasuryBands(
    treasury({
      pendingTransfers: money(150_000),
      transferable: money(350_000),
    }),
  );

  expect(bands.map((band) => band.key)).toEqual(["pending", "transferable"]);
});

it("keeps its shares at zero when every claim is zero", () => {
  const bands = treasuryBands(treasury({ transferable: money(0) }));

  expect(bands).toEqual([]);
});
