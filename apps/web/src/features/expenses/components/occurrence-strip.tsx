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
import { useRef } from "react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { calendarMonthYearLabel } from "@/lib/dates";
import { periodTitle, shiftPeriod } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

import { monthName } from "../lib/labels";
import { RECEIPT_ACCEPT } from "../lib/receipts";
import { occurrenceMonth, occurrenceStateLabel } from "../lib/subscriptions";

export type OccurrenceLinkHandler = (
  subscription: SubscriptionData,
  occurrence: SubscriptionOccurrenceData,
  files: FileList,
) => void;

type OccurrenceStripProps = {
  subscription: SubscriptionData;
  /** `Y-m-d`, the account's today: the twelve slots end on its month. */
  today: string;
  /** Small dots on the card, the full squares in the table. */
  size?: "default" | "sm";
  onLinkReceipt: OccurrenceLinkHandler;
};

const STATE_CLASSES: Record<SubscriptionOccurrenceState, string> = {
  0: "bg-success",
  1: "bg-attention",
  2: "border border-border-4",
  3: "border border-muted-foreground-4 border-dashed",
  4: "border border-border-2",
};

/** A month the subscription had no debit in: before it started, after it ended, between two quarters. */
const IDLE_CLASSES = "border border-border-2";

const SLOT_COUNT = 12;

/** The twelve months ending on today's, oldest first. */
function monthSlots(today: string): string[] {
  const last = today.slice(0, 7);

  return Array.from({ length: SLOT_COUNT }, (_, index) =>
    shiftPeriod(last, index - (SLOT_COUNT - 1)),
  );
}

function OccurrenceCell({
  subscription,
  occurrence,
  size,
  onLinkReceipt,
}: Omit<OccurrenceStripProps, "today"> & {
  occurrence: SubscriptionOccurrenceData;
}) {
  const locale = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const title = m.subscriptions_occurrence_tip({
    month: periodTitle(locale, occurrenceMonth(occurrence)),
    state: occurrenceStateLabel(occurrence.state),
  });
  const cellClass = cn(
    size === "sm" ? "size-2" : "size-2.75",
    "block rounded-xs",
    STATE_CLASSES[occurrence.state],
  );

  if (occurrence.state !== 1) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={<span aria-label={title} className={cellClass} role="img" />}
        />
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              aria-label={m.subscriptions_occurrence_link_aria({
                month: monthName(locale, occurrenceMonth(occurrence)),
                supplier: subscription.supplier,
              })}
              className={cn(
                cellClass,
                "cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-text",
              )}
              onClick={() => inputRef.current?.click()}
              type="button"
            />
          }
        />
        <TooltipContent>
          {title} · {m.expenses_receipt_link()}
        </TooltipContent>
      </Tooltip>
      {/* The button is the control; the input only carries the picker. */}
      <input
        accept={RECEIPT_ACCEPT}
        aria-hidden
        className="sr-only"
        onChange={(event) => {
          if (event.target.files !== null && event.target.files.length > 0) {
            onLinkReceipt(subscription, occurrence, event.target.files);
          }

          event.target.value = "";
        }}
        ref={inputRef}
        tabIndex={-1}
        type="file"
      />
    </>
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
  onLinkReceipt,
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
        className={cn(
          "flex items-center",
          size === "sm" ? "gap-1" : "gap-0.75",
        )}
      >
        {monthSlots(today).map((month) => {
          const occurrence = byMonth.get(month);

          return (
            <li className="flex" key={month}>
              {occurrence === undefined ? (
                <span
                  aria-hidden
                  className={cn(
                    size === "sm" ? "size-2" : "size-2.75",
                    "block rounded-xs",
                    IDLE_CLASSES,
                  )}
                />
              ) : (
                <OccurrenceCell
                  occurrence={occurrence}
                  onLinkReceipt={onLinkReceipt}
                  size={size}
                  subscription={subscription}
                />
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
        <OccurrenceCell
          occurrence={latest}
          onLinkReceipt={onLinkReceipt}
          size="default"
          subscription={subscription}
        />
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
          <span
            aria-hidden
            className={cn("size-2.25 rounded-xs", STATE_CLASSES[state])}
          />
          {occurrenceStateLabel(state)}
        </li>
      ))}
    </ul>
  );
}
