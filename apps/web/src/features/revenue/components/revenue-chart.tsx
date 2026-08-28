import type { Locale, RevenueMonthData } from "@opusline/api-client";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { cn } from "@opusline/ui/lib/utils";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { cachedDateFormatter, fromCalendarDate } from "@/lib/dates";
import { monthTitle } from "@/lib/months";
import { isFuturePeriod } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

import { basisText, type RevenueBasisKey, thousandsLabel } from "../lib/labels";

const MONTH_SHORT: Intl.DateTimeFormatOptions = { month: "short" };

type RevenueChartProps = {
  months: RevenueMonthData[];
  basis: RevenueBasisKey;
  accountToday: string;
  onSelectMonth: (month: string) => void;
};

/**
 * The monthly bars, hand-rolled: heights come from the API's `shareBp` so the
 * frontend never compares amounts. Months inside the shown period carry the
 * orange wash — with a baseline stripe when the month is empty, so the window
 * stays visible on a quiet stretch.
 */
export function RevenueChart({
  months,
  basis,
  accountToday,
  onSelectMonth,
}: RevenueChartProps) {
  const format = useMoneyFormat();
  const locale = useLocale();

  return (
    <section className="flex flex-col rounded-md border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className={eyebrowVariants()}>{basisText(basis).chartTitle()}</h2>
        <span className="text-muted-foreground-3 text-xs">
          {m.revenue_chart_note()}
        </span>
      </div>

      <div className="mt-4 flex min-h-44 flex-1 items-end gap-1.5 sm:gap-2.5">
        {months.map((bar) => {
          // A month under ~50 € rounds to "0"; a floating zero over an
          // invisible bar reads like an empty month, so it says nothing.
          const label = thousandsLabel(locale, bar.total.amount);

          return (
            <button
              aria-label={`${monthTitle(locale, bar.month)} · ${formatWholeAmount(format, bar.total.amount)}`}
              className={cn(
                "flex h-full min-w-0 flex-1 cursor-pointer flex-col justify-end rounded-sm px-0.5 pt-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-default",
                bar.inPeriod && "bg-primary/6",
              )}
              // The quarter and year windows reach into months that have not
              // happened; the header's next arrow refuses them, so do the bars.
              disabled={isFuturePeriod(bar.month, accountToday)}
              key={bar.month}
              onClick={() => onSelectMonth(bar.month)}
              type="button"
            >
              <span
                className="relative w-full"
                style={{ height: `${bar.shareBp / 100}%` }}
              >
                {bar.total.amount > 0 && label !== "0" && (
                  <span
                    className={cn(
                      "-top-4.5 absolute inset-x-0 truncate text-center font-mono text-xs tabular-nums",
                      bar.inPeriod
                        ? "text-foreground-2"
                        : "text-muted-foreground-3",
                    )}
                  >
                    {label}
                  </span>
                )}
                <span
                  className={cn(
                    "block h-full w-full rounded-t-sm",
                    bar.inPeriod ? "bg-primary" : "bg-border-4",
                  )}
                />
              </span>
              {bar.inPeriod && bar.total.amount === 0 && (
                <span className="h-0.5 w-full rounded-full bg-primary/45" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex gap-1.5 sm:gap-2.5">
        {months.map((bar) => (
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-center font-mono text-xs uppercase",
              bar.inPeriod ? "text-foreground-2" : "text-muted-foreground-4",
            )}
            key={bar.month}
          >
            {monthCaption(locale, bar.month)}
          </span>
        ))}
      </div>
    </section>
  );
}

/** "JUIL" — the uppercase comes from CSS, the dot is dropped like weekday labels. */
function monthCaption(locale: Locale, month: string): string {
  return cachedDateFormatter(locale, MONTH_SHORT)
    .format(fromCalendarDate(`${month}-01`))
    .replace(/\.$/, "");
}
