import type { TreasuryData } from "@opusline/api-client";

export type TreasuryBandKey = "vat" | "urssaf" | "buffer" | "transferable";

export type TreasuryBand = {
  key: TreasuryBandKey;
  amountCents: number;
  /** Share of the bar, 0–1. */
  ratio: number;
};

/**
 * The stacked bar under the hero figure: what the account holds, split into the
 * three provisions and what is left.
 *
 * Shares are taken over the larger of the effective balance and the provisions
 * themselves, so an account whose provisions outgrow it fills the bar with them
 * instead of overflowing — and then has no transferable band to draw, which is
 * the honest picture.
 */
export function treasuryBands(data: TreasuryData): TreasuryBand[] {
  if (data.transferable === null) {
    return [];
  }

  const provisions: [TreasuryBandKey, number][] = [
    ["vat", data.provisions.vat?.amount.amount ?? 0],
    ["urssaf", data.provisions.urssaf?.amount.amount ?? 0],
    ["buffer", data.provisions.buffer?.amount ?? 0],
  ];

  const transferable = Math.max(data.transferable.amount, 0);
  const held = provisions.reduce((sum, [, amount]) => sum + amount, 0);
  const total = held + transferable;

  if (total <= 0) {
    return [];
  }

  return [...provisions, ["transferable", transferable] as const]
    .filter(([, amountCents]) => amountCents > 0)
    .map(([key, amountCents]) => ({
      key,
      amountCents,
      ratio: amountCents / total,
    }));
}
