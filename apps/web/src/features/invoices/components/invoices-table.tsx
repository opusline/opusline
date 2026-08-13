import type { InvoiceListItemData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Chip, ChipCount, ChipGroup } from "@opusline/ui/components/chip";
import { cn } from "@opusline/ui/lib/utils";
import { useState } from "react";

import { formatAmountWithCents, paymentTermsLabel } from "@/lib/billing";
import { invoiceStatusBadge } from "@/lib/invoice-status";
import { COLOR_CLASSES } from "@/lib/palette";

import {
  groupByClient,
  INVOICE_SCOPE_LABELS,
  INVOICE_SCOPES,
  type InvoiceScope,
  isInvoiceScope,
  matchesScope,
} from "../lib/grouping";
import { InvoicesEmptyState } from "./invoices-empty-state";

type InvoicesTableProps = {
  invoices: InvoiceListItemData[];
};

export function InvoicesTable({ invoices }: InvoicesTableProps) {
  const [scope, setScope] = useState<InvoiceScope>("all");

  const scopedInvoices: Record<InvoiceScope, InvoiceListItemData[]> = {
    all: invoices,
    draft: invoices.filter((item) => matchesScope(item, "draft")),
    sent: invoices.filter((item) => matchesScope(item, "sent")),
    late: invoices.filter((item) => matchesScope(item, "late")),
    paid: invoices.filter((item) => matchesScope(item, "paid")),
  };
  const groups = groupByClient(scopedInvoices[scope]);

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
            aria-label={`${INVOICE_SCOPE_LABELS[invoiceScope]} (${scopedInvoices[invoiceScope].length})`}
          >
            {INVOICE_SCOPE_LABELS[invoiceScope]}
            <ChipCount aria-hidden>
              {scopedInvoices[invoiceScope].length}
            </ChipCount>
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
                      "size-2 shrink-0 rounded-full",
                      COLOR_CLASSES[group.client.color],
                    )}
                  />
                  <span className="truncate font-medium text-foreground-hi text-sm">
                    {group.client.name}
                  </span>
                  <span className="text-muted-foreground-3 text-xs">
                    {group.items.length}
                  </span>
                </span>
                <span className="ml-auto whitespace-nowrap text-muted-foreground-3 text-xs">
                  {paymentTermsLabel(group.client.paymentTermsDays)}
                </span>
                <span className="w-32 text-right font-mono text-foreground-hi text-sm tabular-nums">
                  {formatAmountWithCents(group.total)}
                </span>
              </div>

              <ul>
                {group.items.map(({ invoice, mission }) => {
                  const badge = invoiceStatusBadge(invoice);

                  return (
                    <li
                      key={invoice.id}
                      className="grid grid-cols-[7rem_minmax(0,1fr)_auto_auto] items-center gap-4 border-b px-5 py-3 last:border-b-0"
                    >
                      <span className="font-mono text-foreground-2 text-sm tabular-nums">
                        {invoice.number ?? "—"}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-foreground-2 text-sm">
                          {mission?.name ?? "Sans mission"}
                        </span>
                        <span className="mt-0.75 block text-muted-foreground-3 text-xs">
                          Échéance {invoice.dueOn}
                        </span>
                      </span>
                      <span className="w-32 text-right font-mono text-foreground-hi text-sm tabular-nums">
                        {formatAmountWithCents(invoice.amountTtc.amount)}
                      </span>
                      <span className="flex justify-end">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </span>
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
