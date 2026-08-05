import type { BillingMode, EntryRounding } from "@opusline/api-client";

export const BILLING_MODE_LABELS: Record<BillingMode, string> = {
  0: "Au jour (TJM)",
  1: "À l'heure",
  2: "Forfait",
};

export const BILLING_MODE_RATE_PLACEHOLDERS: Record<BillingMode, string> = {
  0: "550",
  1: "85",
  2: "4 800",
};

export const BILLING_MODE_UNITS_SHORT: Record<BillingMode, string> = {
  0: "€ / j",
  1: "€ / h",
  2: "€",
};

export const BILLING_MODE_UNITS: Record<BillingMode, string> = {
  0: "€ / jour",
  1: "€ / heure",
  2: "€ HT au total",
};

const DAILY_ROUNDING_LABELS: Record<EntryRounding, string> = {
  0: "0,5 j",
  1: "0,25 j",
  2: "minutes",
};

const HOURLY_ROUNDING_LABELS: Record<EntryRounding, string> = {
  0: "30 min",
  1: "15 min",
  2: "minutes",
};

export function entryRoundingLabel(
  rounding: EntryRounding,
  billingMode: BillingMode,
): string {
  return billingMode === 1
    ? HOURLY_ROUNDING_LABELS[rounding]
    : DAILY_ROUNDING_LABELS[rounding];
}

export function entryRoundingHint(billingMode: BillingMode): string {
  if (billingMode === 1) {
    return (
      "Chaque temps saisi est arrondi au pas choisi avant d'être valorisé en heures. " +
      "Avec 15 min, 1 h 07 pointée compte 1 h 15 ; avec 30 min, elle compte 1 h 30. " +
      "En minutes, le temps est valorisé exactement, sans arrondi."
    );
  }

  return (
    "Chaque temps saisi est arrondi au pas choisi avant d'être valorisé en jours. " +
    "Avec 0,5 j, 3 h pointées comptent une demi-journée et 5 h comptent une journée ; " +
    "avec 0,25 j, la précision passe au quart de journée. " +
    "En minutes, le temps est valorisé exactement, sans arrondi."
  );
}

export function entryRoundingOrder(billingMode: BillingMode): EntryRounding[] {
  return billingMode === 1 ? [1, 0, 2] : [0, 1, 2];
}

export function formatRateDraft(raw: string): string {
  const cleaned = raw.replace(/[^0-9.,]/g, "").replace(/\./g, ",");
  const [integerPart = "", ...decimalParts] = cleaned.split(",");
  const digits = integerPart.replace(/\D/g, "").slice(0, 9);
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");

  if (!cleaned.includes(",")) {
    return grouped;
  }

  return `${grouped},${decimalParts.join("").slice(0, 2)}`;
}

export function parseRateToCents(draft: string): number | null {
  const normalized = draft.replace(/[\s\u202f]/g, "").replace(",", ".");

  if (normalized === "") {
    return null;
  }

  const amount = Number.parseFloat(normalized);

  if (Number.isNaN(amount) || amount <= 0) {
    return null;
  }

  return Math.round(amount * 100);
}
