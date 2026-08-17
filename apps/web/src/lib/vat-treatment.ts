import type { VatTreatment } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

export const VAT_TREATMENTS: VatTreatment[] = [0, 1, 2];

const LABELS: Record<VatTreatment, () => string> = {
  0: m.vat_treatment_standard_label,
  1: m.vat_treatment_eu_reverse_charge_label,
  2: m.vat_treatment_outside_eu_label,
};

const HINTS: Record<VatTreatment, () => string> = {
  0: m.vat_treatment_standard_hint,
  1: m.vat_treatment_eu_reverse_charge_hint,
  2: m.vat_treatment_outside_eu_hint,
};

/**
 * The legal mention an invoice must carry to justify charging no VAT. Null for
 * the standard treatment, which justifies nothing — it charges the usual rate.
 *
 * The wording stays French in both catalogs: it cites French tax law, and a
 * translated article reference is not the mention the law asks for.
 */
const MENTIONS: Record<VatTreatment, (() => string) | null> = {
  0: null,
  1: m.vat_mention_eu_reverse_charge,
  2: m.vat_mention_outside_eu,
};

export function vatTreatmentLabel(treatment: VatTreatment): string {
  return LABELS[treatment]();
}

export function vatTreatmentHint(treatment: VatTreatment): string {
  return HINTS[treatment]();
}

export function vatMention(treatment: VatTreatment): string | null {
  return MENTIONS[treatment]?.() ?? null;
}
