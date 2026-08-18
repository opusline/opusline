import type { MissionForfaitData } from "@opusline/api-client";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatAmountWithCents, formatWholeAmount } from "@/lib/billing";
import {
  FULL_SHARE_BP,
  isOverBudget,
  WARN_SHARE_BP,
} from "@/lib/client-revenue";
import { formatWorkedDays } from "@/lib/durations";
import { m } from "@/paraglide/messages.js";

type MissionBudgetProps = {
  forfait: MissionForfaitData;
  /** The mission's target day rate, or null when none is set. */
  targetRateCents: number | null;
  /** The account's workday, which turns tracked minutes into days. */
  workdayMinutes: number;
};

/**
 * What a fixed price cost to deliver, against what it was meant to.
 *
 * This is the only reason to track time on a forfait: none of these figures is
 * revenue, and none of them reaches an invoice. The effective rate is the verdict
 * — invoiced divided by days actually worked — and the bar says how much of the
 * effort the price paid for has already gone.
 */
export function MissionBudget({
  forfait,
  targetRateCents,
  workdayMinutes,
}: MissionBudgetProps) {
  const format = useMoneyFormat();
  const consumedBp = forfait.consumedShareBp;
  const isOver = isOverBudget(forfait);
  const isWarning = !isOver && (consumedBp ?? 0) >= WARN_SHARE_BP;

  return (
    <section className="rounded-md border bg-card px-5 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-medium text-foreground-hi text-sm">
          {m.missions_budget_title()}
        </h2>
        {isOver && (
          <span className="text-destructive text-xs">
            {m.missions_budget_over()}
          </span>
        )}
      </div>

      {consumedBp === null || forfait.budgetMinutes === null ? (
        <p className="mt-2 text-pretty text-muted-foreground-3 text-xs leading-relaxed">
          {m.missions_budget_no_target()}
        </p>
      ) : (
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted-2">
          <div
            className={barClasses(isOver, isWarning)}
            style={{ width: `${Math.min(consumedBp, FULL_SHARE_BP) / 100}%` }}
          />
        </div>
      )}

      <dl className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="flex items-baseline gap-2">
          <dt className="text-muted-foreground-3 text-xs">
            {m.missions_budget_tracked()}
          </dt>
          <dd className="font-mono text-foreground-hi text-sm tabular-nums">
            {formatWorkedDays(
              format.locale,
              forfait.trackedMinutes / workdayMinutes,
            )}
          </dd>
          {forfait.budgetMinutes !== null && targetRateCents !== null && (
            <dd className="text-muted-foreground-3 text-xs">
              {m.missions_budget_of({
                budget: formatWorkedDays(
                  format.locale,
                  forfait.budgetMinutes / workdayMinutes,
                ),
                rate: formatWholeAmount(format, targetRateCents),
              })}
            </dd>
          )}
        </div>

        {forfait.effectiveRate !== null && (
          <div className="flex items-baseline gap-2">
            <dt className="text-muted-foreground-3 text-xs">
              {m.missions_budget_effective()}
            </dt>
            <dd className="font-mono text-foreground-hi text-sm tabular-nums">
              {formatAmountWithCents(format, forfait.effectiveRate.amount)}
            </dd>
            {targetRateCents !== null && (
              <dd
                className={
                  forfait.effectiveRate.amount < targetRateCents
                    ? "text-destructive text-xs"
                    : "text-success text-xs"
                }
              >
                {forfait.effectiveRate.amount < targetRateCents
                  ? m.missions_budget_under_target({
                      rate: formatWholeAmount(format, targetRateCents),
                    })
                  : m.missions_budget_over_target({
                      rate: formatWholeAmount(format, targetRateCents),
                    })}
              </dd>
            )}
          </div>
        )}
      </dl>
    </section>
  );
}

function barClasses(isOver: boolean, isWarning: boolean): string {
  if (isOver) {
    return "h-full rounded-full bg-destructive";
  }

  return isWarning
    ? "h-full rounded-full bg-primary-text"
    : "h-full rounded-full bg-primary";
}
