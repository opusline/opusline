import type {
  SubscriptionsData,
  UpcomingDebitData,
} from "@opusline/api-client";
import { Eyebrow } from "@opusline/ui/components/eyebrow";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { useId } from "react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatAmountWithCents, formatWholeAmount } from "@/lib/billing";
import { addCalendarDays, calendarDateLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { subscriptionPeriodicityLabel } from "../lib/subscriptions";

type UpcomingDebitsRailProps = {
  data: Pick<SubscriptionsData, "upcoming" | "kpis" | "subscriptions">;
  /** `Y-m-d`, the account's today: the horizon is thirty days out. */
  today: string;
};

/** Σ of the debits ahead; the provision lines are money set aside, not paid out. */
function upcomingTotalCents(upcoming: UpcomingDebitData[]): number {
  return upcoming
    .filter((debit) => !debit.isProvision)
    .reduce((total, debit) => total + debit.amountTtc.amount, 0);
}

export function UpcomingDebitsRail({ data, today }: UpcomingDebitsRailProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const titleId = useId();
  const provisioned = data.subscriptions.filter(
    (subscription) => subscription.monthlyProvision !== null,
  );

  return (
    <aside aria-labelledby={titleId} className="rounded-md border bg-card p-4">
      <Eyebrow className="mb-3.5" id={titleId}>
        {m.subscriptions_upcoming_title()}
      </Eyebrow>
      {data.upcoming.length === 0 ? (
        <p className="pb-3.5 text-muted-foreground-3 text-sm">
          {m.subscriptions_upcoming_none()}
        </p>
      ) : (
        <ol className="flex flex-col">
          {data.upcoming.map((debit, index) => (
            <li
              className="grid grid-cols-[0.875rem_minmax(0,1fr)_auto] items-start gap-2.5 pb-3.5"
              key={`${debit.subscriptionId}:${debit.dueOn}:${debit.isProvision}`}
            >
              <div className="flex h-full flex-col items-center">
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 size-2.25 shrink-0 rounded-full",
                    debit.isProvision
                      ? "border border-muted-foreground-3 border-dashed"
                      : "bg-primary",
                  )}
                />
                {index < data.upcoming.length - 1 && (
                  <span aria-hidden className="mt-1 w-px flex-1 bg-border-2" />
                )}
              </div>
              <div className="-mt-0.75 min-w-0">
                <div className="text-foreground-hi text-sm">
                  {debit.supplier}
                </div>
                <div
                  className={cn(
                    "mt-0.5 text-xs",
                    debit.isProvision
                      ? "text-muted-foreground-4 italic"
                      : "text-muted-foreground-3",
                  )}
                >
                  {debit.isProvision
                    ? m.subscriptions_upcoming_provision({
                        amount: formatWholeAmount(
                          format,
                          debit.amountTtc.amount,
                        ),
                      })
                    : m.subscriptions_upcoming_line({
                        date: calendarDateLabel(locale, debit.dueOn),
                        periodicity: subscriptionPeriodicityLabel(
                          debit.periodicity,
                        ),
                      })}
                </div>
              </div>
              <span className="-mt-0.75 whitespace-nowrap font-mono text-foreground-2 text-sm tabular-nums">
                {debit.isProvision
                  ? formatWholeAmount(format, debit.amountTtc.amount)
                  : formatAmountWithCents(format, debit.amountTtc.amount)}
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="flex items-baseline justify-between gap-2 border-t pt-3">
        <span className="text-muted-foreground-3 text-sm">
          {m.subscriptions_upcoming_by({
            date: calendarDateLabel(locale, addCalendarDays(today, 30)),
          })}
        </span>
        <span className="font-mono text-lg text-primary-text tabular-nums">
          {formatAmountWithCents(format, upcomingTotalCents(data.upcoming))}
        </span>
      </div>
      {provisioned.length > 0 && (
        <p className="mt-3 rounded-md border bg-muted px-3 py-2.5 text-muted-foreground-3 text-xs leading-relaxed">
          {m.subscriptions_upcoming_provision_note({
            suppliers: provisioned
              .map((subscription) => subscription.supplier)
              .join(" + "),
            amount: formatWholeAmount(
              format,
              data.kpis.provisionedPerMonth.amount,
            ),
          })}{" "}
          <Link
            className="text-link underline underline-offset-2 hover:text-link-hover"
            to="/treasury"
          >
            {m.subscriptions_upcoming_provision_link()}
          </Link>{" "}
          {m.subscriptions_upcoming_provision_tail()}
        </p>
      )}
    </aside>
  );
}
