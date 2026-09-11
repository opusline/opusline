import type {
  InvoiceClientTotalsData,
  InvoiceListItemData,
} from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Chip, ChipCount, ChipGroup } from "@opusline/ui/components/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@opusline/ui/components/table";
import { cn } from "@opusline/ui/lib/utils";
import { useMemo, useState } from "react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { invoiceStatusBadge } from "@/lib/invoice-status";
import { COLOR_CLASSES } from "@/lib/palette";
import { m } from "@/paraglide/messages.js";

import {
  countByScope,
  groupByClient,
  INVOICE_SCOPES,
  type InvoiceScope,
  invoiceScopeLabel,
  isInvoiceScope,
  matchesScope,
} from "../lib/grouping";
import { invoiceRowDetail } from "../lib/labels";
import { InvoicesEmptyState } from "./invoices-empty-state";

type InvoicesTableProps = {
  invoices: InvoiceListItemData[];
  clientTotals: InvoiceClientTotalsData[];
  /** Today in the account's timezone — the date isLate was derived from. */
  accountToday: string;
  onOpen?: (invoiceId: number) => void;
};

export function InvoicesTable({
  invoices,
  clientTotals,
  accountToday,
  onOpen,
}: InvoicesTableProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const [scope, setScope] = useState<InvoiceScope>("all");

  // Every chip carries its own count, but only the selected scope needs its rows —
  // one pass counts all five, and one filter builds the list actually shown.
  const counts = useMemo(() => countByScope(invoices), [invoices]);
  const groups = useMemo(
    () =>
      groupByClient(
        format.locale,
        invoices.filter((item) => matchesScope(item, scope)),
        clientTotals,
        scope,
      ),
    [format.locale, invoices, clientTotals, scope],
  );

  return (
    <div className="flex flex-col gap-3">
      <ChipGroup
        aria-label={m.invoices_filter_aria()}
        value={[scope]}
        onValueChange={(value) => {
          const nextScope = value.find(isInvoiceScope);

          if (nextScope !== undefined) {
            setScope(nextScope);
          }
        }}
      >
        {INVOICE_SCOPES.map((invoiceScope) => (
          <Chip
            key={invoiceScope}
            value={invoiceScope}
            shape="pill"
            aria-label={`${invoiceScopeLabel(invoiceScope)} (${counts[invoiceScope]})`}
          >
            {invoiceScopeLabel(invoiceScope)}
            <ChipCount aria-hidden>{counts[invoiceScope]}</ChipCount>
          </Chip>
        ))}
      </ChipGroup>

      {groups.length === 0 ? (
        <InvoicesEmptyState hasInvoices={invoices.length > 0} />
      ) : (
        <Table
          className="table-fixed"
          containerClassName="overflow-hidden rounded-md border bg-card"
        >
          {/* The widths the CSS grid used to carry. Layout only — a colgroup is
              invisible to assistive technology, which reads the headers below. */}
          <colgroup>
            <col className="w-28" />
            <col />
            <col className="w-32" />
            <col className="w-24" />
          </colgroup>
          {/* The design draws no header band, so the names live for screen
              readers alone; without them a row reads as four bare values. */}
          <TableHeader>
            <TableRow className="sr-only">
              <TableHead>{m.invoices_column_number()}</TableHead>
              <TableHead>{m.invoices_column_mission()}</TableHead>
              <TableHead>{m.invoices_column_amount()}</TableHead>
              <TableHead>{m.invoices_column_status()}</TableHead>
            </TableRow>
          </TableHeader>
          {groups.map((group) => (
            <TableBody key={group.client.id}>
              <TableRow className="hover:bg-transparent">
                <TableHead
                  className="h-auto border-b bg-muted-2 px-5 py-3 whitespace-normal"
                  colSpan={4}
                  scope="rowgroup"
                >
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="flex min-w-0 items-center gap-2.25">
                      <span
                        aria-hidden
                        className={cn(
                          "size-2.5 shrink-0 rounded-sm",
                          COLOR_CLASSES[group.client.color],
                        )}
                      />
                      <span className="truncate font-medium text-foreground-hi text-sm">
                        {group.client.name}
                      </span>
                      <span className="whitespace-nowrap font-normal text-muted-foreground-3 text-xs">
                        {m.invoices_count({ count: group.items.length })}
                      </span>
                    </span>
                    <span className="ml-auto whitespace-nowrap font-normal text-muted-foreground-3 text-xs">
                      {group.averageDaysToPay === null
                        ? null
                        : m.invoices_average_days_to_pay({
                            days: group.averageDaysToPay,
                          })}
                    </span>
                    <span className="w-32 text-right font-mono text-foreground-hi text-sm tabular-nums">
                      {formatWholeAmount(format, group.total)}
                    </span>
                  </span>
                </TableHead>
              </TableRow>

              {group.items.map(({ invoice, mission }) => {
                const badge = invoiceStatusBadge(invoice);
                const label = invoice.number ?? mission?.name ?? "";

                return (
                  <TableRow
                    className="cursor-pointer"
                    key={invoice.id}
                    onClick={() => onOpen?.(invoice.id)}
                  >
                    <TableCell className="px-5 py-3 font-mono text-foreground-2 text-sm tabular-nums">
                      {/* The row follows the mouse, but the keyboard needs a
                          real control — and one per row, not one per cell. */}
                      <button
                        aria-label={m.invoices_open_aria({ label })}
                        className="rounded-sm text-left focus-visible:outline-2 focus-visible:outline-primary-text"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpen?.(invoice.id);
                        }}
                        type="button"
                      >
                        {invoice.number ?? "—"}
                      </button>
                    </TableCell>
                    <TableCell className="min-w-0 px-0 py-3">
                      <span className="block truncate text-foreground-2 text-sm">
                        {mission?.name ?? m.invoices_no_mission()}
                      </span>
                      <span className="mt-0.75 block text-muted-foreground-3 text-xs">
                        {invoiceRowDetail(
                          format.locale,
                          dateFormat,
                          invoice,
                          accountToday,
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="px-0 py-3 text-right font-mono text-foreground-hi text-sm tabular-nums">
                      {formatWholeAmount(format, invoice.amountTtc.amount)}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-right">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          ))}
        </Table>
      )}
    </div>
  );
}
