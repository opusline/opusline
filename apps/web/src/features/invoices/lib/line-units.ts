import type { LineUnit } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

export const LINE_UNITS: readonly LineUnit[] = [0, 1, 2, 3];

export const LINE_UNIT_LABELS: Record<LineUnit, () => string> = {
  0: m.line_unit_day,
  1: m.line_unit_hour,
  2: m.line_unit_flat,
  3: m.line_unit_unit,
};

/** The rates the screens offer; a stored rate outside them stays selectable. */
export const VAT_RATES_BP = [2000, 1000, 550, 0] as const;

export function vatRateOptions(current: number): number[] {
  return (VAT_RATES_BP as readonly number[]).includes(current)
    ? [...VAT_RATES_BP]
    : [...VAT_RATES_BP, current].sort((left, right) => right - left);
}
