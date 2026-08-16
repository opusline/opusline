import type { InvoiceListItemData, Locale } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Link } from "@tanstack/react-router";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { capitalizedMonthLabel } from "@/lib/dates";
import { invoiceStatusBadge } from "@/lib/invoice-status";
import { m } from "@/paraglide/messages.js";

import { basisText, type RevenueBasisKey } from "../lib/labels";

/** The list is a glance, not the ledger — the link carries to the full screen. */
const VISIBLE_ROWS = 5;

type RevenueInvoicesCardProps = {
  invoices: InvoiceListItemData[];
  basis: RevenueBasisKey;
  periodTitle: string;
  onOpenInvoice: (invoiceId: number) => void;
};

export function RevenueInvoicesCard({
  invoices,
  basis,
  periodTitle,
  onOpenInvoice,
}: RevenueInvoicesCardProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const visible = invoices.slice(0, VISIBLE_ROWS);

  return (
    <section className="flex-1 rounded-md border bg-card px-5 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
          {basisText(basis).invoicesTitle()}
        </h2>
        <Link
          className="text-primary-text text-xs hover:text-primary-text-strong"
          to="/invoices"
        >
          {m.revenue_invoices_link()}
        </Link>
      </div>

      {visible.length === 0 ? (
        <p className="pt-4 pb-1 text-muted-foreground-3 text-sm text-pretty">
          {basisText(basis).invoicesEmpty({ period: periodTitle })}
        </p>
      ) : (
        <ul className="mt-1.5">
          {visible.map((item) => {
            const badge = invoiceStatusBadge(item.invoice);

            return (
              <li key={item.invoice.id}>
                <button
                  className="flex w-full cursor-pointer items-center justify-between gap-3 border-secondary border-t py-2.75 text-left"
                  onClick={() => onOpenInvoice(item.invoice.id)}
                  type="button"
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-mono text-foreground-2 text-sm">
                      {item.invoice.number ?? m.invoices_no_reference()}
                    </span>
                    <span className="truncate text-muted-foreground-3 text-xs">
                      {rowSubtitle(locale, item)}
                    </span>
                  </span>
                  <span className="flex flex-none items-center gap-2.5">
                    <span className="font-mono text-foreground-2 text-sm tabular-nums">
                      {formatWholeAmount(format, item.invoice.amountHt.amount)}
                    </span>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {invoices.length > VISIBLE_ROWS && (
        <p className="border-secondary border-t pt-2.5 text-muted-foreground-3 text-xs">
          {m.invoices_more_count({ count: invoices.length - VISIBLE_ROWS })}
        </p>
      )}
    </section>
  );
}

/** "Nordlys · Juillet 2026" — the client, then what the invoice covers. */
function rowSubtitle(locale: Locale, item: InvoiceListItemData): string {
  const coverage =
    item.mission?.name ??
    (item.invoice.periodStart === null
      ? null
      : capitalizedMonthLabel(locale, item.invoice.periodStart));

  return coverage === null
    ? item.client.name
    : `${item.client.name} · ${coverage}`;
}
