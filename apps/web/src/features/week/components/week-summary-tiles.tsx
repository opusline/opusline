import type { Locale, MonthWorkloadData } from "@opusline/api-client";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { REVENUE_PLACEHOLDER } from "@/lib/client-revenue";
import { formatWorkedDays } from "@/lib/durations";
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

function monthTileOf(
  locale: Locale,
  monthWorkload: MonthWorkloadData | "unavailable" | null,
) {
  if (monthWorkload === null) {
    return null;
  }

  if (monthWorkload === "unavailable") {
    return (
      <StatTile
        label={m.week_month_title()}
        size="lg"
        sub={m.week_month_unavailable()}
        tone="quiet"
        value={REVENUE_PLACEHOLDER}
      />
    );
  }

  return (
    <StatTile
      label={m.week_month_title()}
      meter={
        monthWorkload.businessDays === 0
          ? 0
          : monthWorkload.workedDays / monthWorkload.businessDays
      }
      size="lg"
      sub={m.week_month_business_days({ count: monthWorkload.businessDays })}
      tone="strong"
      value={formatWorkedDays(locale, monthWorkload.workedDays)}
    />
  );
}

type WeekSummaryTilesProps = {
  summary: WeekBillableSummary;
  /**
   * The civil month today sits in: null while it loads, "unavailable" when the
   * request failed. One value rather than a pair, so "loaded and also failed"
   * cannot be expressed in the first place.
   */
  monthWorkload: MonthWorkloadData | "unavailable" | null;
};

/**
 * The design's row holds three tiles — these two and "Prochaine échéance" (#75).
 * Until that one lands the row is two columns: the row's hairline background
 * paints empty columns as a grey slab.
 */
export function WeekSummaryTiles({
  summary,
  monthWorkload,
}: WeekSummaryTilesProps) {
  const format = useMoneyFormat();
  const hasBillableTime = summary.valuedEntryCount > 0;
  const monthTile = monthTileOf(format.locale, monthWorkload);

  return (
    <StatTileRow
      className={
        monthTile === null ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
      }
      variant="cards"
    >
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
      {monthTile}
    </StatTileRow>
  );
}
