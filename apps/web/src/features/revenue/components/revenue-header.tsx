import { Button } from "@opusline/ui/components/button";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useLocale } from "@/components/money-format-provider";
import {
  isAtOrAfterCurrent,
  type PeriodKind,
  periodKind,
  periodTitle,
  resizePeriod,
  shiftPeriod,
} from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

import {
  basisText,
  periodKindLabel,
  type RevenueBasisKey,
  revenueSubtitle,
} from "../lib/labels";

const PERIOD_KINDS: PeriodKind[] = ["month", "quarter", "year"];
const BASES: RevenueBasisKey[] = ["invoiced", "collected"];

type RevenueHeaderProps = {
  /** The requested period — the URL's view, ahead of the data mid-fetch. */
  period: string;
  basis: RevenueBasisKey;
  fellBack: boolean;
  accountToday: string;
  onPeriodChange: (period: string) => void;
  onBasisChange: (basis: RevenueBasisKey) => void;
};

export function RevenueHeader({
  period,
  basis,
  fellBack,
  accountToday,
  onPeriodChange,
  onBasisChange,
}: RevenueHeaderProps) {
  const locale = useLocale();
  const kind = periodKind(period);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="whitespace-nowrap font-heading font-semibold text-2xl text-foreground-hi leading-tight">
          {m.nav_revenue()}{" "}
          <span aria-hidden className="font-normal text-muted-foreground-5">
            ·
          </span>{" "}
          <span className="whitespace-nowrap font-normal text-foreground-3 text-xl">
            {periodTitle(locale, period)}
          </span>
        </h1>
        <p className="mt-1 text-muted-foreground-3 text-sm text-pretty">
          {revenueSubtitle(basis, fellBack)}
        </p>
      </div>

      <div className="flex flex-none flex-wrap items-center gap-2.5">
        <div className="flex gap-1">
          <Button
            aria-label={m.revenue_prev_period()}
            onClick={() => onPeriodChange(shiftPeriod(period, -1))}
            size="icon-lg"
            title={m.revenue_prev_period()}
            variant="outline"
          >
            <ChevronLeftIcon aria-hidden />
          </Button>
          <Button
            aria-label={m.revenue_next_period()}
            disabled={isAtOrAfterCurrent(period, accountToday)}
            onClick={() => onPeriodChange(shiftPeriod(period, 1))}
            size="icon-lg"
            title={m.revenue_next_period()}
            variant="outline"
          >
            <ChevronRightIcon aria-hidden />
          </Button>
        </div>

        <SegmentedControl
          aria-label={m.revenue_period_kind_aria()}
          value={[kind]}
          onValueChange={(value) => {
            const next = value[0];

            if (typeof next === "string" && next !== kind) {
              onPeriodChange(
                resizePeriod(period, next as PeriodKind, accountToday),
              );
            }
          }}
        >
          {PERIOD_KINDS.map((option) => (
            <SegmentedControlItem key={option} value={option}>
              {periodKindLabel(option)}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>

        <SegmentedControl
          aria-label={m.revenue_basis_aria()}
          value={[basis]}
          onValueChange={(value) => {
            const next = value[0];

            if (typeof next === "string" && next !== basis) {
              onBasisChange(next as RevenueBasisKey);
            }
          }}
        >
          {BASES.map((option) => (
            <SegmentedControlItem key={option} value={option}>
              {basisText(option).label()}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </div>
    </div>
  );
}
