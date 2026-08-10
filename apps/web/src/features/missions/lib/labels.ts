import type { BillingMode } from "@opusline/api-client";

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
