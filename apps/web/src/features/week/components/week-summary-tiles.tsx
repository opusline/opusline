import type {
  DeadlineItemData,
  Locale,
  MonthWorkloadData,
} from "@opusline/api-client";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { REVENUE_PLACEHOLDER } from "@/lib/client-revenue";
import {
  deadlineDueLabel,
  deadlineItemAmountCents,
  deadlineItemTitle,
  deadlineProgress,
} from "@/lib/deadlines";
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

/**
 * The design's third tile: what falls due next, and how far through its period
 * today sits. Clickable through to the Échéances screen — the whole tile is the
 * target, not a link buried in it.
 */
function nextDeadlineTileOf(
  format: ReturnType<typeof useMoneyFormat>,
  dateFormat: ReturnType<typeof useDateFormat>,
  today: string,
  nextDeadline: NextDeadline,
) {
  if (nextDeadline === null) {
    return null;
  }

  if (nextDeadline === "unavailable") {
    return (
      <StatTile
        className="lg:col-span-2"
        label={m.week_deadline_title()}
        size="lg"
        sub={m.week_deadline_unavailable()}
        tone="quiet"
        value={REVENUE_PLACEHOLDER}
      />
    );
  }

  if (nextDeadline === "none") {
    return (
      <StatTile
        className="lg:col-span-2"
        label={m.week_deadline_title()}
        render={<Link to="/deadlines" />}
        size="lg"
        sub={m.week_deadline_none_sub()}
        tone="quiet"
        value={m.week_deadline_none()}
      />
    );
  }

  const amountCents = deadlineItemAmountCents(nextDeadline);

  return (
    <StatTile
      className="lg:col-span-2"
      label={m.week_deadline_title()}
      lead={deadlineItemTitle(nextDeadline)}
      meter={
        nextDeadline.fiscal === null
          ? undefined
          : deadlineProgress(nextDeadline.fiscal, today)
      }
      render={<Link to="/deadlines" />}
      size="lg"
      sub={deadlineDueLabel(dateFormat, nextDeadline, today)}
      tone="brand"
      value={
        amountCents === null
          ? REVENUE_PLACEHOLDER
          : formatWholeAmount(format, amountCents)
      }
    />
  );
}

/**
 * What falls due next — an invoice, a relance or a fiscal deadline: null while
 * it loads, "unavailable" when the request failed, "none" for an account with
 * an empty board. One value rather than a pair, so "loaded and also failed"
 * cannot be expressed in the first place.
 */
export type NextDeadline = DeadlineItemData | "none" | "unavailable" | null;

type WeekSummaryTilesProps = {
  summary: WeekBillableSummary;
  /**
   * The civil month today sits in: null while it loads, "unavailable" when the
   * request failed. One value rather than a pair, so "loaded and also failed"
   * cannot be expressed in the first place.
   */
  monthWorkload: MonthWorkloadData | "unavailable" | null;
  nextDeadline: NextDeadline;
  /** The account's own calendar date, so the tile's countdown matches the API's. */
  today: string;
};

/**
 * The design's row: what the week is worth, how full the month is, and what
 * falls due next — the last one twice as wide as the other two, and only for
 * an account the French fiscal calendar applies to.
 */
export function WeekSummaryTiles({
  summary,
  monthWorkload,
  nextDeadline,
  today,
}: WeekSummaryTilesProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const hasBillableTime = summary.valuedEntryCount > 0;
  const monthTile = monthTileOf(format.locale, monthWorkload);
  const deadlineTile = nextDeadlineTileOf(
    format,
    dateFormat,
    today,
    nextDeadline,
  );

  return (
    <StatTileRow
      // The deadline tile is two columns wide, so the count follows what is
      // actually there: an opened column no tile fills paints as a grey slab.
      className={cn(
        "grid-cols-1",
        monthTile !== null && "sm:grid-cols-2",
        deadlineTile !== null &&
          (monthTile === null ? "lg:grid-cols-3" : "lg:grid-cols-4"),
      )}
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
      {deadlineTile}
    </StatTileRow>
  );
}
