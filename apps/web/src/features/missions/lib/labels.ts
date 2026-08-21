import type { BillingMode } from "@opusline/api-client";

import { currencySymbol, type MoneyFormat } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

const BILLING_MODE_MESSAGES: Record<BillingMode, () => string> = {
  0: m.missions_billing_mode_daily,
  1: m.missions_billing_mode_hourly,
  2: m.missions_billing_mode_fixed,
};

export function billingModeLabel(mode: BillingMode): string {
  return BILLING_MODE_MESSAGES[mode]();
}

const RATE_PLACEHOLDER_MESSAGES: Record<BillingMode, () => string> = {
  0: () => "550",
  1: () => "85",
  2: m.missions_rate_placeholder_fixed,
};

export function billingModeRatePlaceholder(mode: BillingMode): string {
  return RATE_PLACEHOLDER_MESSAGES[mode]();
}

const AMOUNT_LABEL_MESSAGES: Record<BillingMode, () => string> = {
  0: m.missions_rate_ht,
  1: m.missions_rate_ht,
  2: m.missions_forfait_amount_label,
};

/** What the amount field is called: a rate on time, a price on a forfait. */
export function billingModeAmountLabel(mode: BillingMode): string {
  return AMOUNT_LABEL_MESSAGES[mode]();
}

const UNIT_MESSAGES: Record<BillingMode, () => string> = {
  0: m.missions_unit_daily,
  1: m.missions_unit_hourly,
  2: m.missions_unit_fixed_total,
};

export function billingModeUnit(
  format: MoneyFormat,
  mode: BillingMode,
): string {
  return currencySymbol(format) + UNIT_MESSAGES[mode]();
}

const AMOUNT_UNIT_MESSAGES: Record<BillingMode, () => string> = {
  0: m.missions_unit_short_daily,
  1: m.missions_unit_short_hourly,
  2: m.missions_unit_fixed_total,
};

/**
 * What sits beside a mission's amount when it is read rather than typed: the short
 * unit for a rate, the long "HT au total" for a price that is the whole contract.
 */
export function billingModeAmountUnit(
  format: MoneyFormat,
  mode: BillingMode,
): string {
  return currencySymbol(format) + AMOUNT_UNIT_MESSAGES[mode]();
}
