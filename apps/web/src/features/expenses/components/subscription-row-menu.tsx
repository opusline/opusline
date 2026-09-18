import type {
  SubscriptionData,
  SubscriptionOccurrenceData,
} from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import { cn } from "@opusline/ui/lib/utils";
import { ExternalLinkIcon, MoreVerticalIcon } from "lucide-react";
import { useRef } from "react";

import { useLocale } from "@/components/money-format-provider";
import { m } from "@/paraglide/messages.js";

import { monthName } from "../lib/labels";
import { RECEIPT_ACCEPT } from "../lib/receipts";
import {
  occurrenceMonth,
  occurrencesMissingReceipt,
} from "../lib/subscriptions";

export type OccurrenceLinkHandler = (
  subscription: SubscriptionData,
  occurrence: SubscriptionOccurrenceData,
  files: FileList,
) => void;

export type SubscriptionRowMenuHandlers = {
  onEdit: (subscription: SubscriptionData) => void;
  onChangeAmount: (subscription: SubscriptionData) => void;
  onPause: (subscription: SubscriptionData) => void;
  onResume: (subscription: SubscriptionData) => void;
  onToggleProvision: (subscription: SubscriptionData) => void;
  onCancel: (subscription: SubscriptionData) => void;
  onReactivate: (subscription: SubscriptionData) => void;
  onDelete: (subscription: SubscriptionData) => void;
  onLinkReceipt: OccurrenceLinkHandler;
};

type SubscriptionRowMenuProps = SubscriptionRowMenuHandlers & {
  subscription: SubscriptionData;
  /** `Y-m-d`, the account's today: the missing receipts offered are the strip's. */
  today: string;
  className?: string;
};

export function SubscriptionRowMenu({
  subscription,
  className,
  onEdit,
  onChangeAmount,
  onPause,
  onResume,
  onToggleProvision,
  onCancel,
  onReactivate,
  onDelete,
  onLinkReceipt,
  today,
}: SubscriptionRowMenuProps) {
  const locale = useLocale();
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const linkingRef = useRef<SubscriptionOccurrenceData | null>(null);
  const isCancelled = subscription.cancelledOn !== null;

  const pickReceiptFor = (occurrence: SubscriptionOccurrenceData) => {
    linkingRef.current = occurrence;
    receiptInputRef.current?.click();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              aria-label={m.expenses_row_menu_aria({
                supplier: subscription.supplier,
              })}
              className={cn(
                "text-muted-foreground-3 opacity-0 transition-opacity pointer-coarse:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100 group-hover/row:opacity-100",
                className,
              )}
              size="icon-sm"
              variant="ghost"
            />
          }
        >
          <MoreVerticalIcon aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-58">
          <DropdownMenuItem onClick={() => onEdit(subscription)}>
            {m.subscriptions_menu_edit()}
          </DropdownMenuItem>
          {occurrencesMissingReceipt(subscription, today).map((occurrence) => (
            <DropdownMenuItem
              key={occurrence.debitOn}
              onClick={() => pickReceiptFor(occurrence)}
            >
              {m.subscriptions_menu_link_receipt({
                month: monthName(locale, occurrenceMonth(occurrence)),
              })}
            </DropdownMenuItem>
          ))}
          {!isCancelled && (
            <>
              {subscription.isPaused ? (
                <DropdownMenuItem onClick={() => onResume(subscription)}>
                  {m.subscriptions_menu_resume()}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onPause(subscription)}>
                  {m.subscriptions_menu_pause()}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onChangeAmount(subscription)}>
                {m.subscriptions_menu_change_amount()}
              </DropdownMenuItem>
              {subscription.periodicity === 2 && (
                <DropdownMenuItem
                  onClick={() => onToggleProvision(subscription)}
                >
                  {subscription.provisionMonthly
                    ? m.subscriptions_menu_unprovision()
                    : m.subscriptions_provision()}
                </DropdownMenuItem>
              )}
            </>
          )}
          {isCancelled ? (
            <DropdownMenuItem onClick={() => onReactivate(subscription)}>
              {m.subscriptions_menu_reactivate()}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onCancel(subscription)}>
              {m.subscriptions_menu_cancel()}
            </DropdownMenuItem>
          )}
          {subscription.customerSpaceUrl !== null && (
            <DropdownMenuItem
              render={
                <a
                  href={subscription.customerSpaceUrl}
                  rel="noreferrer"
                  target="_blank"
                />
              }
            >
              {m.subscriptions_open_customer_space()}
              <ExternalLinkIcon aria-hidden className="ml-auto" />
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(subscription)}
            variant="destructive"
          >
            {m.subscriptions_menu_delete()}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Outside the menu: its popup unmounts on close, before the picker answers. */}
      <input
        accept={RECEIPT_ACCEPT}
        aria-hidden
        className="sr-only"
        onChange={(event) => {
          const occurrence = linkingRef.current;

          if (
            occurrence !== null &&
            event.target.files !== null &&
            event.target.files.length > 0
          ) {
            onLinkReceipt(subscription, occurrence, event.target.files);
          }

          event.target.value = "";
        }}
        ref={receiptInputRef}
        tabIndex={-1}
        type="file"
      />
    </>
  );
}
