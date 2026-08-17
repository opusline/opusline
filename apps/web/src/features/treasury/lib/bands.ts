import type { TreasuryData } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

export type TreasuryBand = {
  key: "vat" | "urssaf" | "buffer" | "pending" | "transferable";
  label: string;
  sub: string | null;
  amountCents: number;
  /** Share of the balance, in basis points, for the proportional bar. */
  shareBp: number;
  colorClass: string;
};

const BAND_COLORS: Record<TreasuryBand["key"], string> = {
  vat: "bg-palette-amber",
  urssaf: "bg-palette-terracotta",
  buffer: "bg-palette-stone",
  pending: "bg-palette-slate",
  transferable: "bg-primary",
};

/**
 * Splits the balance into what each claim on it takes. Zero-valued claims are
 * dropped so the bar shows what actually applies rather than a row of nothing
 * — a franchise en base has no VAT band at all.
 */
export function treasuryBands(treasury: TreasuryData): TreasuryBand[] {
  const parts: Array<{
    key: TreasuryBand["key"];
    label: string;
    sub: string | null;
    amountCents: number;
  }> = [
    {
      key: "vat",
      label: m.treasury_band_vat(),
      sub: null,
      amountCents: treasury.provisions.vat?.amount.amount ?? 0,
    },
    {
      key: "urssaf",
      label: m.treasury_band_urssaf(),
      sub: null,
      amountCents: treasury.provisions.urssaf?.amount.amount ?? 0,
    },
    {
      key: "buffer",
      label: m.treasury_band_buffer(),
      sub: m.treasury_band_buffer_sub(),
      amountCents: treasury.provisions.buffer?.amount ?? 0,
    },
    {
      key: "pending",
      label: m.treasury_band_pending(),
      sub: m.treasury_band_pending_sub(),
      amountCents: treasury.pendingTransfers.amount,
    },
    {
      key: "transferable",
      label: m.treasury_band_transferable(),
      sub: m.treasury_band_transferable_sub(),
      amountCents: treasury.transferable.amount,
    },
  ];

  const applicable = parts.filter((part) => part.amountCents > 0);
  const total = applicable.reduce((sum, part) => sum + part.amountCents, 0);

  return applicable.map((part) => ({
    ...part,
    shareBp: total === 0 ? 0 : Math.round((part.amountCents / total) * 10_000),
    colorClass: BAND_COLORS[part.key],
  }));
}
