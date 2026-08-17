import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import type { WeekBillableSummary } from "../lib/week-money";

function detailOf(summary: WeekBillableSummary): string {
  const parts = [m.week_billable_detail({ count: summary.valuedEntryCount })];

  if (summary.fixedPriceEntryCount > 0) {
    parts.push(
      m.week_billable_fixed_price({ count: summary.fixedPriceEntryCount }),
    );
  }

  if (summary.nonBillableEntryCount > 0) {
    parts.push(
      m.week_billable_non_billable({ count: summary.nonBillableEntryCount }),
    );
  }

  return parts.join(" · ");
}

type WeekBillableTileProps = {
  summary: WeekBillableSummary;
};

/**
 * The design's row holds three tiles — this one, "Mois en cours" (#66) and
 * "Prochaine échéance" (#75). It keeps the three-column row so the other two
 * drop in beside it without relayout.
 */
export function WeekBillableTile({ summary }: WeekBillableTileProps) {
  const format = useMoneyFormat();
  const hasBillableTime = summary.valuedEntryCount > 0;

  return (
    <StatTileRow className="md:grid-cols-3">
      <StatTile
        label={m.week_billable_title()}
        size="lg"
        sub={hasBillableTime ? detailOf(summary) : m.week_billable_empty()}
        tone={hasBillableTime ? "brand" : "quiet"}
        value={
          <span className="flex items-baseline gap-1.5">
            {formatWholeAmount(format, summary.amountCents)}
            <span className="text-muted-foreground-3 text-xs">
              {m.common_ht()}
            </span>
          </span>
        }
      />
    </StatTileRow>
  );
}
