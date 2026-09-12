import type { SubscriptionData } from "@opusline/api-client";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@opusline/ui/components/table";
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
import {
  type OccurrenceLinkHandler,
  OccurrenceStrip,
} from "./occurrence-strip";
import {
  SubscriptionRowMenu,
  type SubscriptionRowMenuHandlers,
} from "./subscription-row-menu";
import { SubscriptionStatusBadge } from "./subscription-status-badge";
import { SubscriptionSupplierCell } from "./subscription-supplier-cell";

export type SubscriptionRowHandlers = SubscriptionRowMenuHandlers & {
  onLinkReceipt: OccurrenceLinkHandler;
};

type SubscriptionTableProps = SubscriptionRowHandlers & {
  subscriptions: SubscriptionData[];
  isVatLiable: boolean;
  /** `Y-m-d`, the account's today: the strip ends on its month. */
  today: string;
  className?: string;
};

const HEAD_CLASSES = cn(
  eyebrowVariants({ tone: "quiet" }),
  "h-auto px-1.5 pt-2.5 pb-2 font-normal first:pl-3",
);
const CELL_CLASSES = "px-1.5 py-2.75 align-middle first:pl-3";
const AMOUNT_CLASSES = "font-mono text-sm tabular-nums";

export function SubscriptionTable({
  subscriptions,
  isVatLiable,
  today,
  className,
  onLinkReceipt,
  ...menuHandlers
}: SubscriptionTableProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const dateFormat = useDateFormat();

  return (
    <Table className={cn("table-fixed", className)}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className={HEAD_CLASSES}>
            {m.expenses_col_supplier()}
          </TableHead>
          <TableHead className={cn(HEAD_CLASSES, "w-24")}>
            {m.subscriptions_col_periodicity()}
          </TableHead>
          <TableHead className={cn(HEAD_CLASSES, "w-24")}>
            {m.subscriptions_col_next()}
          </TableHead>
          {isVatLiable && (
            <>
              <TableHead className={cn(HEAD_CLASSES, "w-22 text-right")}>
                {m.expenses_col_ht()}
              </TableHead>
              <TableHead className={cn(HEAD_CLASSES, "w-38 text-right")}>
                {m.expenses_col_vat()}
              </TableHead>
            </>
          )}
          <TableHead className={cn(HEAD_CLASSES, "w-22 text-right")}>
            {m.expenses_col_ttc()}
          </TableHead>
          <TableHead className={cn(HEAD_CLASSES, "w-26")}>
            {m.expenses_col_status()}
          </TableHead>
          <TableHead className={cn(HEAD_CLASSES, "w-48")}>
            {m.subscriptions_col_receipts()}
          </TableHead>
          <TableHead className={cn(HEAD_CLASSES, "w-10")}>
            <span className="sr-only">{m.common_more_actions()}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((subscription) => (
          <TableRow
            className={cn(
              "group/row border-t transition-colors hover:bg-accent",
              subscription.cancelledOn !== null && "bg-muted/60",
            )}
            key={subscription.id}
          >
            <TableCell className={cn(CELL_CLASSES, "max-w-0")}>
              <SubscriptionSupplierCell subscription={subscription} />
            </TableCell>
            <TableCell className={CELL_CLASSES}>
              <div className="text-foreground-2 text-sm">
                {subscriptionPeriodicityLabel(subscription.periodicity)}
              </div>
              <div className="mt-0.5 text-muted-foreground-3 text-xs">
                {debitDayLabel(locale, subscription)}
              </div>
            </TableCell>
            <TableCell
              className={cn(CELL_CLASSES, AMOUNT_CLASSES, "text-foreground-3")}
            >
              {subscription.nextDebitOn === null
                ? "—"
                : calendarDateNumericLabel(
                    dateFormat,
                    subscription.nextDebitOn,
                  )}
            </TableCell>
            {isVatLiable && (
              <>
                <TableCell
                  className={cn(
                    CELL_CLASSES,
                    AMOUNT_CLASSES,
                    "text-right text-foreground-2",
                  )}
                >
                  {formatAmountWithCents(format, subscription.amountHt.amount)}
                </TableCell>
                <TableCell className={cn(CELL_CLASSES, "text-right")}>
                  <div className={cn(AMOUNT_CLASSES, "text-foreground-2")}>
                    {subscription.vat.amount === 0
                      ? "—"
                      : formatAmountWithCents(
                          format,
                          subscription.recoverableVat.amount,
                        )}
                  </div>
                  <div className="mt-0.5 whitespace-nowrap text-muted-foreground-3 text-xs">
                    {subscriptionRegimeLabel(locale, format, subscription)}
                  </div>
                </TableCell>
              </>
            )}
            <TableCell
              className={cn(
                CELL_CLASSES,
                AMOUNT_CLASSES,
                "text-right text-foreground-hi",
              )}
            >
              {formatAmountWithCents(format, subscription.amountTtc.amount)}
            </TableCell>
            <TableCell className={cn(CELL_CLASSES, "max-w-0")}>
              <SubscriptionStatusBadge subscription={subscription} />
            </TableCell>
            <TableCell className={cn(CELL_CLASSES, "max-w-0")}>
              <OccurrenceStrip
                onLinkReceipt={onLinkReceipt}
                subscription={subscription}
                today={today}
              />
            </TableCell>
            <TableCell className={cn(CELL_CLASSES, "pr-2 pl-0 text-right")}>
              <SubscriptionRowMenu
                subscription={subscription}
                {...menuHandlers}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
