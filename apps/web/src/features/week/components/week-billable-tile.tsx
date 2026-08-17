import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import type { WeekBillableSummary } from "../lib/week-money";

function detailOf(summary: WeekBillableSummary): string {
  const parts = [
    summary.valuedEntryCount > 0
      ? m.week_billable_detail({ count: summary.valuedEntryCount })
      : m.week_billable_empty(),
  ];

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

  if (summary.unratedEntryCount > 0) {
    parts.push(m.week_billable_unrated({ count: summary.unratedEntryCount }));
  }

  return parts.join(" · ");
}

type WeekBillableTileProps = {
  summary: WeekBillableSummary;
};

/**
 * The design's row holds three tiles — this one, "Mois en cours" (#66) and
 * "Prochaine échéance" (#75). Until those land the row is one column: the row's
 * hairline background paints empty columns as a grey slab.
 */
export function WeekBillableTile({ summary }: WeekBillableTileProps) {
  const format = useMoneyFormat();
  const hasBillableTime = summary.valuedEntryCount > 0;

  return (
    <StatTileRow className="grid-cols-1">
      <StatTile
        label={m.week_billable_title()}
        size="lg"
        sub={detailOf(summary)}
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
