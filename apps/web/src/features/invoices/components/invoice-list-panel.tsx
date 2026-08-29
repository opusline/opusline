import type { InvoiceListItemData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { LoadMoreButton } from "@/components/load-more-button";
import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { invoiceStatusBadge } from "@/lib/invoice-status";
import { m } from "@/paraglide/messages.js";

import { invoiceRowDetail, invoiceRowDetailWithMission } from "../lib/labels";

type InvoiceListPanelProps = {
  invoices: InvoiceListItemData[];
  /** Today in the account's timezone — the date isLate was derived from. */
  accountToday: string;
  /** A client's list spans missions, so its rows name theirs; a mission's do not. */
  withMission?: boolean;
  isPending?: boolean;
  isError?: boolean;
  /** Older rows exist past the fetched window. */
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onShowMore?: () => void;
  /** Why the list is empty — a client with no billable time, an unbillable mission. */
  emptyHint: string;
  onOpen: (invoiceId: number) => void;
};

export function InvoiceListPanel({
  invoices,
  accountToday,
  withMission,
  isPending,
  isError,
  hasMore = false,
  isLoadingMore = false,
  onShowMore,
  emptyHint,
  onOpen,
}: InvoiceListPanelProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  if (isPending) {
    return (
      <div className="flex flex-col gap-2 rounded-md border bg-card px-5 py-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    );
  }

  // A refetch that fails keeps the rows it already has: the list is still the
  // truth as of the last good read, and replacing it with an error card would
  // read as "this client has no invoices".
  if (isError && invoices.length === 0) {
    return (
      <div className="rounded-md border bg-card px-5 py-6 text-center text-destructive text-sm">
        {m.invoices_load_failed()}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <Empty className="px-7 py-9">
        <EmptyHeader className="gap-2">
          <EmptyTitle variant="strong">
            {m.common_no_invoices_title()}
          </EmptyTitle>
          <EmptyDescription className="text-muted-foreground-3 text-sm leading-relaxed">
            {emptyHint}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border bg-card">
      {/*
        Scrolls in its own box so a client with years of invoices does not push
        the header tiles and the tab bar off the page.
      */}
      <div className="max-h-160 overflow-auto">
        <ul>
          {invoices.map((item) => {
            const { invoice } = item;
            const badge = invoiceStatusBadge(invoice);
            const detail = withMission
              ? invoiceRowDetailWithMission(
                  format.locale,
                  dateFormat,
                  item,
                  accountToday,
                )
              : invoiceRowDetail(
                  format.locale,
                  dateFormat,
                  invoice,
                  accountToday,
                );

            return (
              <li key={invoice.id}>
                <button
                  type="button"
                  onClick={() => onOpen(invoice.id)}
                  className="flex w-full items-center justify-between gap-3.5 border-accent border-b px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-foreground-hi text-sm">
                      {invoice.number ?? m.invoices_no_reference()}
                    </span>
                    <span className="mt-0.75 block truncate text-muted-foreground-3 text-xs">
                      {detail}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="whitespace-nowrap font-mono text-foreground-2 text-sm tabular-nums">
                      {formatWholeAmount(format, invoice.amountTtc.amount)}
                    </span>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {hasMore && onShowMore !== undefined && (
          <LoadMoreButton
            className="border-accent border-t py-2"
            isLoading={isLoadingMore}
            label={m.invoices_show_more()}
            onClick={onShowMore}
          />
        )}
      </div>

      {isError && (
        <p className="border-t px-5 py-3 text-destructive text-sm" role="alert">
          {m.invoices_load_failed()}
        </p>
      )}
    </div>
  );
}
