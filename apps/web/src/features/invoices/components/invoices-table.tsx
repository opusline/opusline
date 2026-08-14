import type {
  InvoiceClientTotalsData,
  InvoiceListItemData,
} from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Chip, ChipCount, ChipGroup } from "@opusline/ui/components/chip";
import { cn } from "@opusline/ui/lib/utils";
import { useMemo, useState } from "react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { invoiceStatusBadge } from "@/lib/invoice-status";
import { COLOR_CLASSES } from "@/lib/palette";

import {
  countByScope,
  groupByClient,
  INVOICE_SCOPE_LABELS,
  INVOICE_SCOPES,
  type InvoiceScope,
  isInvoiceScope,
  matchesScope,
} from "../lib/grouping";
import { invoiceCountLabel, invoiceRowDetail } from "../lib/labels";
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
        invoices.filter((item) => matchesScope(item, scope)),
        clientTotals,
        scope,
      ),
    [invoices, clientTotals, scope],
  );

  return (
    <div className="flex flex-col gap-3">
      <ChipGroup
        aria-label="Filtrer les factures"
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
            aria-label={`${INVOICE_SCOPE_LABELS[invoiceScope]} (${counts[invoiceScope]})`}
          >
            {INVOICE_SCOPE_LABELS[invoiceScope]}
            <ChipCount aria-hidden>{counts[invoiceScope]}</ChipCount>
          </Chip>
        ))}
      </ChipGroup>

      {groups.length === 0 ? (
        <InvoicesEmptyState hasInvoices={invoices.length > 0} />
      ) : (
        <div className="overflow-hidden rounded-md border bg-card">
          {groups.map((group) => (
            <section key={group.client.id}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b bg-muted-2 px-5 py-3">
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
                  <span className="whitespace-nowrap text-muted-foreground-3 text-xs">
                    {invoiceCountLabel(group.items.length)}
                  </span>
                </span>
                <span className="ml-auto whitespace-nowrap text-muted-foreground-3 text-xs">
                  {group.averageDaysToPay === null
                    ? null
                    : `${group.averageDaysToPay} j en moyenne pour payer`}
                </span>
                <span className="w-32 text-right font-mono text-foreground-hi text-sm tabular-nums">
                  {formatWholeAmount(format, group.total)}
                </span>
              </div>

              <ul>
                {group.items.map(({ invoice, mission }) => {
                  const badge = invoiceStatusBadge(invoice);

                  return (
                    <li key={invoice.id}>
                      <button
                        type="button"
                        onClick={() => onOpen?.(invoice.id)}
                        className="grid w-full grid-cols-[7rem_minmax(0,1fr)_auto_auto] items-center gap-4 border-b px-5 py-3 text-left transition-colors last:border-b-0 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                      >
                        <span className="font-mono text-foreground-2 text-sm tabular-nums">
                          {invoice.number ?? "—"}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-foreground-2 text-sm">
                            {mission?.name ?? "Sans mission"}
                          </span>
                          <span className="mt-0.75 block text-muted-foreground-3 text-xs">
                            {invoiceRowDetail(
                              dateFormat,
                              invoice,
                              accountToday,
                            )}
                          </span>
                        </span>
                        <span className="w-32 text-right font-mono text-foreground-hi text-sm tabular-nums">
                          {formatWholeAmount(format, invoice.amountTtc.amount)}
                        </span>
                        <span className="flex justify-end">
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
