import type {
  SubscriptionData,
  SubscriptionOccurrenceData,
  SubscriptionOccurrenceState,
} from "@opusline/api-client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@opusline/ui/components/tooltip";
import { cn } from "@opusline/ui/lib/utils";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { calendarMonthYearLabel } from "@/lib/dates";
import { periodTitle } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

import {
  occurrenceMonth,
  occurrenceStateLabel,
  receiptStripMonths,
} from "../lib/subscriptions";

type OccurrenceStripProps = {
  subscription: SubscriptionData;
  /** `Y-m-d`, the account's today: the twelve slots end on its month. */
  today: string;
  /** Small dots on the card, the full squares in the table. */
  size?: "default" | "sm";
};

/**
 * Shape carries the two states that matter, not only hue: a receipt that is in
 * reads as a round dot and a missing one as a square, because `--success` and
 * `--attention` measure 1.09:1 against each other and a red-green-deficient eye
 * cannot separate them. The later states already lean on border style.
 */
const STATE_CLASSES: Record<SubscriptionOccurrenceState, string> = {
  0: "rounded-full bg-success",
  1: "rounded-xs bg-attention",
  2: "rounded-xs border border-border-4",
  3: "rounded-xs border border-muted-foreground-4 border-dashed",
  4: "rounded-xs border border-border-2",
};

/** A month the subscription had no debit in: before it started, after it ended, between two quarters. */
const IDLE_CLASSES = "rounded-xs border border-border-2";

const CELL_SIZE_CLASSES = { default: "size-2.75", sm: "size-2" } as const;

/**
 * Tight enough for twelve months to fit the table column. The cells are only a
 * picture: linking a missing receipt is a row-menu item, because 8–11 px
 * targets this close together would fail WCAG 2.2 SC 2.5.8.
 */
const STRIP_GAP_CLASSES = { default: "gap-0.75", sm: "gap-1" } as const;

function OccurrenceCell({
  occurrence,
  size,
}: {
  occurrence: SubscriptionOccurrenceData;
  size: "default" | "sm";
}) {
  const locale = useLocale();
  const title = m.subscriptions_occurrence_tip({
    month: periodTitle(locale, occurrenceMonth(occurrence)),
    state: occurrenceStateLabel(occurrence.state),
  });

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            aria-label={title}
            className={cn(
              CELL_SIZE_CLASSES[size],
              "block",
              STATE_CLASSES[occurrence.state],
            )}
            role="img"
          />
        }
      />
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  );
}

/**
 * Twelve months of receipts for a monthly or quarterly subscription — a
 * neutral cell where no debit fell — and, for an annual one, its single
 * debit with the month it lands in and the provision.
 */
export function OccurrenceStrip({
  subscription,
  today,
  size = "default",
}: OccurrenceStripProps) {
  const locale = useLocale();
  const format = useMoneyFormat();

  if (subscription.periodicity !== 2) {
    const byMonth = new Map(
      subscription.occurrences.map((occurrence) => [
        occurrenceMonth(occurrence),
        occurrence,
      ]),
    );

    return (
      <ul
        aria-label={m.subscriptions_col_receipts()}
        className={cn("flex items-center", STRIP_GAP_CLASSES[size])}
      >
        {receiptStripMonths(today).map((month) => {
          const occurrence = byMonth.get(month);

          return (
            <li className="flex" key={month}>
              {occurrence === undefined ? (
                <span
                  aria-hidden
                  className={cn(CELL_SIZE_CLASSES[size], "block", IDLE_CLASSES)}
                />
              ) : (
                <OccurrenceCell occurrence={occurrence} size={size} />
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  const latest = subscription.occurrences.at(-1);

  return (
    <div className="flex min-w-0 items-center gap-2">
      {latest !== undefined && (
        <OccurrenceCell occurrence={latest} size="default" />
      )}
      <div className="min-w-0">
        <div className="truncate text-muted-foreground-3 text-xs">
          {latest === undefined
            ? m.occurrence_state_future()
            : m.subscriptions_annual_receipt({
                month: calendarMonthYearLabel(locale, latest.debitOn),
              })}
        </div>
        <div className="mt-0.5 truncate text-2xs text-muted-foreground-4">
          {[
            latest === undefined ? null : occurrenceStateLabel(latest.state),
            subscription.monthlyProvision === null
              ? m.subscriptions_annual_not_provisioned()
              : m.subscriptions_annual_provisioned({
                  amount: formatWholeAmount(
                    format,
                    subscription.monthlyProvision.amount,
                  ),
                }),
          ]
            .filter((part) => part !== null)
            .join(" · ")}
        </div>
      </div>
    </div>
  );
}

const LEGEND: SubscriptionOccurrenceState[] = [0, 1, 2, 3];

export function OccurrenceLegend() {
  return (
    <ul className="flex flex-wrap gap-3.5 text-muted-foreground-3 text-xs">
      {LEGEND.map((state) => (
        <li className="inline-flex items-center gap-1.25" key={state}>
          <span aria-hidden className={cn("size-2.25", STATE_CLASSES[state])} />
          {occurrenceStateLabel(state)}
        </li>
      ))}
    </ul>
  );
}
