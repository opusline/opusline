import type { TreasuryData } from "@opusline/api-client";

import { eur, personalTransfer, treasuryData } from "@/test/fixtures";

/** A salary taken since the last relevé: deducted on top of the known balance. */
export function pendingTransferTreasuryData(): TreasuryData {
  return treasuryData({
    pendingTransfers: eur(120_000),
    transferable: eur(731_300),
    transfers: [
      personalTransfer({
        id: 3,
        transferredOn: "2026-08-13",
        amount: eur(120_000),
        note: "Avance",
        reflectedInBalance: false,
      }),
      personalTransfer(),
    ],
  });
}

/** Nothing typed, nothing imported: no balance to reason about at all. */
export function emptyTreasuryData(): TreasuryData {
  return treasuryData({
    balance: null,
    coveredThrough: null,
    transferable: null,
    transfers: [],
    provisions: {
      vat: null,
      urssaf: null,
      cfe: null,
      buffer: eur(150_000),
      total: eur(150_000),
    },
  });
}

/** A thin account: the provisions outgrow what is on it. */
export function shortTreasuryData(): TreasuryData {
  return treasuryData({
    balance: { amount: eur(42_000), source: 0, asOf: "2026-08-12" },
    transferable: { amount: -588_700, currency: "EUR" },
  });
}

/** Under the franchise en base: no TVA column at all. */
export function noVatTreasuryData(): TreasuryData {
  const base = treasuryData();

  return treasuryData({
    provisions: { ...base.provisions, vat: null, total: eur(421_700) },
    transferable: eur(1_060_300),
  });
}
