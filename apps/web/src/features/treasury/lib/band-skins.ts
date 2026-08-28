import { m } from "@/paraglide/messages.js";
import type { TreasuryBandKey } from "./bands";

/**
 * How each slice of the balance is drawn. One table rather than a class map
 * beside a label map beside a tone ternary, so adding a band is one entry.
 *
 * TVA and the CFE are hatched the two ways and the matelas is hollow, so the
 * slices read apart without relying on colour, and only what is actually the
 * user's carries the brand tone.
 */
export const TREASURY_BAND_SKINS: Record<
  TreasuryBandKey,
  {
    label: () => string;
    swatch: string;
    label_tone: string;
    value_tone: string;
  }
> = {
  vat: {
    label: m.treasury_band_vat,
    swatch: "bg-hatch",
    label_tone: "text-muted-foreground",
    value_tone: "text-foreground-2",
  },
  urssaf: {
    label: m.treasury_band_urssaf,
    swatch: "bg-border-4",
    label_tone: "text-muted-foreground",
    value_tone: "text-foreground-2",
  },
  cfe: {
    label: m.treasury_band_cfe,
    swatch: "bg-hatch-reverse",
    label_tone: "text-muted-foreground",
    value_tone: "text-foreground-2",
  },
  buffer: {
    label: m.treasury_band_buffer,
    swatch: "border border-border-3 bg-secondary-2",
    label_tone: "text-muted-foreground",
    value_tone: "text-foreground-2",
  },
  transferable: {
    label: m.treasury_band_transferable,
    swatch: "bg-primary",
    label_tone: "text-primary-text",
    value_tone: "text-primary-text",
  },
};
