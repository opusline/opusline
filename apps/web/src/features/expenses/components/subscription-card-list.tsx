import type { SubscriptionData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";

import {
  useDateFormat,
  useLocale,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import {
  debitDayLabel,
  subscriptionPeriodicityLabel,
  subscriptionRegimeLabel,
} from "../lib/subscriptions";
import { OccurrenceStrip } from "./occurrence-strip";
import { SubscriptionRowMenu } from "./subscription-row-menu";
import { SubscriptionStatusBadge } from "./subscription-status-badge";
import { SubscriptionSupplierCell } from "./subscription-supplier-cell";
import type { SubscriptionRowHandlers } from "./subscription-table";

type SubscriptionCardListProps = SubscriptionRowHandlers & {
  subscriptions: SubscriptionData[];
  isVatLiable: boolean;
  today: string;
  className?: string;
};

export function SubscriptionCardList({
  subscriptions,
  isVatLiable,
  today,
  className,
  onLinkReceipt,
  ...menuHandlers
}: SubscriptionCardListProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const dateFormat = useDateFormat();

  return (
    <ul className={cn("flex flex-col gap-2 p-2", className)}>
      {subscriptions.map((subscription) => (
        <li
          className={cn(
            "group/row rounded-md border bg-card p-3",
            subscription.cancelledOn !== null && "bg-muted/60",
          )}
          key={subscription.id}
        >
          <div className="flex items-start gap-2.5">
            <div className="min-w-0 flex-1">
              <SubscriptionSupplierCell subscription={subscription} />
              <div className="mt-1 text-muted-foreground-3 text-xs">
                {[
                  subscriptionPeriodicityLabel(subscription.periodicity),
                  debitDayLabel(locale, subscription),
                  subscription.nextDebitOn === null
                    ? null
                    : m.subscriptions_next_debit({
                        date: calendarDateNumericLabel(
                          dateFormat,
                          subscription.nextDebitOn,
                        ),
                      }),
                ]
                  .filter((part) => part !== null)
                  .join(" · ")}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-mono text-base text-foreground-hi tabular-nums">
                {formatAmountWithCents(format, subscription.amountTtc.amount)}
              </div>
              {isVatLiable && (
                <div className="mt-0.5 text-muted-foreground-3 text-xs">
                  {formatAmountWithCents(format, subscription.amountHt.amount)}{" "}
                  {m.common_ht()} ·{" "}
                  {subscriptionRegimeLabel(locale, format, subscription)}
                </div>
              )}
            </div>
            <SubscriptionRowMenu
              className="opacity-100"
              subscription={subscription}
              {...menuHandlers}
            />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            <SubscriptionStatusBadge
              layout="inline"
              subscription={subscription}
            />
            <OccurrenceStrip
              onLinkReceipt={onLinkReceipt}
              size="sm"
              subscription={subscription}
              today={today}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
