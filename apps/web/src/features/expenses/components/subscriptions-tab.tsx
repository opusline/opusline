import type {
  RecurringDebitData,
  SubscriptionsData,
} from "@opusline/api-client";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { cn } from "@opusline/ui/lib/utils";

import { m } from "@/paraglide/messages.js";

import { AmountHistoryCard } from "./amount-history-card";
import { AnnualSplitCard } from "./annual-split-card";
import { DetectedDebitBanner } from "./detected-debit-banner";
import { OccurrenceLegend } from "./occurrence-strip";
import { SubscriptionCardList } from "./subscription-card-list";
import { SubscriptionKpiTiles } from "./subscription-kpi-tiles";
import {
  type SubscriptionRowHandlers,
  SubscriptionTable,
} from "./subscription-table";
import { UpcomingDebitsRail } from "./upcoming-debits-rail";

type SubscriptionsTabProps = SubscriptionRowHandlers & {
  data: SubscriptionsData;
  isVatLiable: boolean;
  isRefreshing: boolean;
  /** Cancelled rows stay hidden until asked for. */
  showCancelled: boolean;
  /** `Y-m-d`, the account's today. */
  today: string;
  isDetectedBusy: boolean;
  onCreateFromDebit: (debit: RecurringDebitData) => void;
  onDismissDebit: (debit: RecurringDebitData) => void;
};

export function SubscriptionsTab({
  data,
  isVatLiable,
  isRefreshing,
  showCancelled,
  today,
  isDetectedBusy,
  onCreateFromDebit,
  onDismissDebit,
  ...handlers
}: SubscriptionsTabProps) {
  const visible = data.subscriptions.filter(
    (subscription) => showCancelled || subscription.cancelledOn === null,
  );

  return (
    <div
      aria-busy={isRefreshing || undefined}
      className={cn(
        "flex flex-col gap-4 transition-opacity",
        isRefreshing && "opacity-60",
      )}
    >
      <SubscriptionKpiTiles kpis={data.kpis} />

      {data.detected.map((debit) => (
        <DetectedDebitBanner
          debit={debit}
          isBusy={isDetectedBusy}
          key={`${debit.label}:${debit.amount.amount}`}
          onCreate={onCreateFromDebit}
          onDismiss={onDismissDebit}
        />
      ))}

      <section className="rounded-md border bg-card">
        {visible.length === 0 ? (
          <Empty className="px-5 py-8">
            <EmptyHeader className="gap-1.5">
              <EmptyTitle variant="strong">
                {data.subscriptions.length === 0
                  ? m.subscriptions_empty_title()
                  : m.subscriptions_all_cancelled_title()}
              </EmptyTitle>
              <EmptyDescription className="text-muted-foreground-3 text-sm">
                {data.subscriptions.length === 0
                  ? m.subscriptions_empty_sub()
                  : m.subscriptions_all_cancelled_sub()}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <SubscriptionTable
              className="hidden lg:table"
              isVatLiable={isVatLiable}
              subscriptions={visible}
              today={today}
              {...handlers}
            />
            <SubscriptionCardList
              className="lg:hidden"
              isVatLiable={isVatLiable}
              subscriptions={visible}
              today={today}
              {...handlers}
            />
            <div className="flex justify-end border-t px-3 py-2.5">
              <OccurrenceLegend />
            </div>
          </>
        )}
      </section>

      {/* The table needs the width: the thirty-day rail joins the cards below it. */}
      {data.subscriptions.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4">
          <UpcomingDebitsRail data={data} today={today} />
          <AnnualSplitCard
            categories={data.categories}
            yearlyHtCents={data.yearlyHt.amount}
          />
          <AmountHistoryCard changes={data.amountChanges} />
        </div>
      )}
    </div>
  );
}
