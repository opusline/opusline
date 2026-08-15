import type { CraData } from "@opusline/api-client";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";

import { m } from "@/paraglide/messages.js";

import { daysLabel, differenceLabel, offDaysWorkedLabel } from "../lib/labels";

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
  const format = useMoneyFormat();

  return (
    <StatTileRow className="grid-cols-2 lg:grid-cols-4">
      <StatTile
        label={m.cra_stat_reported()}
        tone="strong"
        value={daysLabel(format.locale, cra.totalDays)}
      />
      <StatTile
        label={m.cra_stat_amount()}
        value={
          cra.estimatedAmount === null
            ? "—"
            : formatWholeAmount(format, cra.estimatedAmount.amount)
        }
      />
      <StatTile
        label={m.cra_stat_difference()}
        tone={cra.differenceDays === 0 ? "quiet" : "brand"}
        value={differenceLabel(format.locale, cra.differenceDays)}
      />
      <StatTile
        label={m.cra_stat_off_days()}
        tone={offDaysWorked === 0 ? "quiet" : "brand"}
        value={offDaysWorkedLabel(offDaysWorked)}
      />
    </StatTileRow>
  );
}
