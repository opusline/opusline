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

const UNIT_SHORT_MESSAGES: Record<BillingMode, () => string> = {
  0: m.missions_unit_short_daily,
  1: m.missions_unit_short_hourly,
  2: () => "",
};

const UNIT_MESSAGES: Record<BillingMode, () => string> = {
  0: m.missions_unit_daily,
  1: m.missions_unit_hourly,
  2: m.missions_unit_fixed_total,
};

export function billingModeUnitShort(
  format: MoneyFormat,
  mode: BillingMode,
): string {
  return currencySymbol(format) + UNIT_SHORT_MESSAGES[mode]();
}

export function billingModeUnit(
  format: MoneyFormat,
  mode: BillingMode,
): string {
  return currencySymbol(format) + UNIT_MESSAGES[mode]();
}
