import type { BillingMode, EntryRounding } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

const DAILY_ROUNDING_MESSAGES: Record<EntryRounding, () => string> = {
  0: m.rounding_half_day,
  1: m.rounding_quarter_day,
  2: m.rounding_minutes,
};

const HOURLY_ROUNDING_MESSAGES: Record<EntryRounding, () => string> = {
  0: m.rounding_thirty_min,
  1: m.rounding_fifteen_min,
  2: m.rounding_minutes,
};

export function entryRoundingLabel(
  rounding: EntryRounding,
  billingMode: BillingMode,
): string {
  return billingMode === 1
    ? HOURLY_ROUNDING_MESSAGES[rounding]()
    : DAILY_ROUNDING_MESSAGES[rounding]();
}

export function entryRoundingHint(billingMode: BillingMode): string {
  return billingMode === 1 ? m.rounding_hint_hourly() : m.rounding_hint_daily();
}

export function entryRoundingOrder(billingMode: BillingMode): EntryRounding[] {
  return billingMode === 1 ? [1, 0, 2] : [0, 1, 2];
}
