import type { CraData } from "@opusline/api-client";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";

import { formatEuros } from "@/lib/billing";

import {
  daysLabel,
  differenceLabel,
  offDaysWorkedLabel,
  STAT_AMOUNT,
  STAT_DIFFERENCE,
  STAT_OFF_DAYS,
  STAT_REPORTED,
} from "../lib/labels";

/**
 * The four figures the month comes down to: what it reports, what it is worth, and the
 * two things that would make a client query it — a drift from the tracked time, and
 * days nobody expected to be worked.
 *
 * The amount is the API's; the frontend never multiplies days by a rate.
 */
export function CraStatTiles({
  cra,
  offDaysWorked,
}: {
  cra: CraData;
  offDaysWorked: number;
}) {
  return (
    <StatTileRow className="grid-cols-2 lg:grid-cols-4">
      <StatTile
        label={STAT_REPORTED}
        tone="strong"
        value={daysLabel(cra.totalDays)}
      />
      <StatTile
        label={STAT_AMOUNT}
        value={
          cra.estimatedAmount === null
            ? "—"
            : formatEuros(cra.estimatedAmount.amount)
        }
      />
      <StatTile
        label={STAT_DIFFERENCE}
        tone={cra.differenceDays === 0 ? "quiet" : "brand"}
        value={differenceLabel(cra.differenceDays)}
      />
      <StatTile
        label={STAT_OFF_DAYS}
        tone={offDaysWorked === 0 ? "quiet" : "brand"}
        value={offDaysWorkedLabel(offDaysWorked)}
      />
    </StatTileRow>
  );
}
