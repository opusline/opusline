import type {
  BankProvisionData,
  BankProvisionsData,
  MoneyData,
  TreasuryData,
} from "@opusline/api-client";

import { centsShare } from "@/lib/billing";

/**
 * Every kind of provision the account holds, taken off the DTO rather than
 * listed here: `total` is their sum, not a kind. The bar scales against that
 * total, so a kind the bar does not draw is an unlabelled gap exactly its size —
 * which is what happened when the API added `subscriptions`.
 */
type ProvisionKey = Exclude<keyof BankProvisionsData, "total">;

export type TreasuryBandKey = ProvisionKey | "transferable";

export type TreasuryBand = {
  key: TreasuryBandKey;
  amountCents: number;
  /** Share of the bar, 0–1. */
  ratio: number;
};

/**
 * Left to right: what is owed, then the matelas. A Record and not an array, so
 * a sixth kind of provision fails to compile here — and in `band-skins.ts` and
 * the breakdown's captions — rather than falling silently out of the bar.
 */
const BAR_ORDER: Record<ProvisionKey, number> = {
  vat: 0,
  urssaf: 1,
  cfe: 2,
  subscriptions: 3,
  buffer: 4,
};

function isProvisionKey(key: string): key is ProvisionKey {
  return key in BAR_ORDER;
}

/** The matelas is the account's own bare amount; every other kind wraps one. */
function provisionCents(
  provision: BankProvisionData | MoneyData | null,
): number {
  if (provision === null) {
    return 0;
  }

  return typeof provision.amount === "number"
    ? provision.amount
    : provision.amount.amount;
}

/**
 * The stacked bar under the hero figure: what the account holds, split into the
 * provisions and what is left.
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

  const provisions = Object.entries(data.provisions)
    .flatMap(([key, provision]) =>
      isProvisionKey(key)
        ? [{ key, amountCents: provisionCents(provision) }]
        : [],
    )
    .sort((left, right) => BAR_ORDER[left.key] - BAR_ORDER[right.key]);

  const transferable = Math.max(data.transferable.amount, 0);
  // The API's total rather than a re-sum of the provisions above: the bar's
  // denominator and the figure the screen prints have to be the same number.
  const held = data.provisions.total.amount;
  const total = held + transferable;

  if (total <= 0) {
    return [];
  }

  return [
    ...provisions,
    { key: "transferable" as const, amountCents: transferable },
  ]
    .filter((band) => band.amountCents > 0)
    .map((band) => ({ ...band, ratio: centsShare(band.amountCents, total) }));
}
