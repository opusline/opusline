import type { BillingMode } from "@opusline/api-client";

import { currencySymbol, type MoneyFormat } from "@/lib/billing";

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

const UNIT_SUFFIXES_SHORT: Record<BillingMode, string> = {
  0: " / j",
  1: " / h",
  2: "",
};

const UNIT_SUFFIXES: Record<BillingMode, string> = {
  0: " / jour",
  1: " / heure",
  2: " HT au total",
};

export function billingModeUnitShort(
  format: MoneyFormat,
  mode: BillingMode,
): string {
  return currencySymbol(format) + UNIT_SUFFIXES_SHORT[mode];
}

export function billingModeUnit(
  format: MoneyFormat,
  mode: BillingMode,
): string {
  return currencySymbol(format) + UNIT_SUFFIXES[mode];
}
