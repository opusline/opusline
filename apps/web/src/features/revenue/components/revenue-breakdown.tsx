import type {
  DateFormat,
  InvoiceListItemData,
  Locale,
  RevenueClientData,
} from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { cn } from "@opusline/ui/lib/utils";

import {
  useDateFormat,
  useLocale,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { calendarDateNumericLabel, capitalizedMonthLabel } from "@/lib/dates";
import { COLOR_CLASSES } from "@/lib/palette";
import { periodTitle } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

import { basisText, type RevenueBasisKey, shareLabel } from "../lib/labels";

const GROUP_GRID =
  "grid grid-cols-[minmax(0,1fr)_minmax(3.75rem,12.5rem)_2.75rem_6.5rem] items-center gap-4";

type RevenueBreakdownProps = {
  clients: RevenueClientData[];
  invoices: InvoiceListItemData[];
  basis: RevenueBasisKey;
  /** The shown period's title, for the empty state. */
  periodLabel: string;
  lastActivePeriod: string | null;
  onOpenInvoice: (invoiceId: number) => void;
  onShowPeriod: (period: string) => void;
};

export function RevenueBreakdown({
  clients,
  invoices,
  basis,
  periodLabel,
  lastActivePeriod,
  onOpenInvoice,
  onShowPeriod,
}: RevenueBreakdownProps) {
  const locale = useLocale();

  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b px-5 py-4">
        <h2 className={eyebrowVariants()}>{m.revenue_breakdown_title()}</h2>
        {clients.length > 0 && (
          <span className="text-muted-foreground-3 text-xs">
            {m.revenue_breakdown_clients({ count: clients.length })} ·{" "}
            {m.invoices_count({ count: invoices.length })}
          </span>
        )}
      </header>

      {clients.length === 0 ? (
        <Empty surface="plain" className="py-9">
          <EmptyHeader>
            <EmptyTitle variant="strong">
              {basisText(basis).emptyTitle({ period: periodLabel })}
            </EmptyTitle>
            <EmptyDescription>{basisText(basis).emptyBody()}</EmptyDescription>
          </EmptyHeader>
          {lastActivePeriod !== null && (
            <Button
              onClick={() => onShowPeriod(lastActivePeriod)}
              variant="outline"
            >
              {m.revenue_empty_cta({
                period: periodTitle(locale, lastActivePeriod),
              })}
            </Button>
          )}
        </Empty>
      ) : (
        clients.map((group) => (
          <ClientGroup
            basis={basis}
            group={group}
            invoices={invoices.filter(
              (item) => item.client.id === group.clientId,
            )}
            key={group.clientId}
            onOpenInvoice={onOpenInvoice}
          />
        ))
      )}
    </section>
  );
}

function ClientGroup({
  group,
  invoices,
  basis,
  onOpenInvoice,
}: {
  group: RevenueClientData;
  invoices: InvoiceListItemData[];
  basis: RevenueBasisKey;
  onOpenInvoice: (invoiceId: number) => void;
}) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const dateFormat = useDateFormat();

  return (
    <div>
      <div className={cn(GROUP_GRID, "border-b bg-muted-2 px-5 py-3.5")}>
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "size-2.5 flex-none rounded-sm",
              COLOR_CLASSES[group.color],
            )}
          />
          <span className="truncate font-medium text-foreground-hi text-sm">
            {group.clientName}
          </span>
          <span className="flex-none whitespace-nowrap text-muted-foreground-3 text-xs">
            {m.invoices_count({ count: group.invoiceCount })}
          </span>
        </div>
        <span className="block h-1.75 overflow-hidden rounded-xs bg-muted">
          <span
            className={cn(
              "block h-full rounded-xs",
              COLOR_CLASSES[group.color],
            )}
            style={{ width: `${group.shareBp / 100}%` }}
          />
        </span>
        <span className="whitespace-nowrap text-right font-mono text-muted-foreground-3 text-xs tabular-nums">
          {shareLabel(locale, group.shareBp)}
        </span>
        <span className="whitespace-nowrap text-right font-mono text-foreground-hi text-sm tabular-nums">
          {formatWholeAmount(format, group.total.amount)}
        </span>
      </div>

      {invoices.map((item) => (
        <button
          className="flex w-full cursor-pointer items-center gap-4 border-accent border-b px-5 py-3 text-left hover:bg-accent"
          key={item.invoice.id}
          onClick={() => onOpenInvoice(item.invoice.id)}
          type="button"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-foreground-2 text-sm">
              {item.mission?.name ??
                item.invoice.number ??
                m.invoices_no_reference()}
            </span>
            <span className="mt-0.5 block truncate text-muted-foreground-3 text-xs">
              {rowDetail(locale, dateFormat, basis, item)}
            </span>
          </span>
          <span className="flex-none whitespace-nowrap text-right font-mono text-foreground-2 text-sm tabular-nums">
            {formatWholeAmount(format, item.invoice.amountHt.amount)}
          </span>
        </button>
      ))}
    </div>
  );
}

/** "Juillet 2026 · émise le 31/07/2026" — coverage, then the basis's own date. */
function rowDetail(
  locale: Locale,
  dateFormat: DateFormat,
  basis: RevenueBasisKey,
  item: InvoiceListItemData,
): string {
  const basisDate =
    basis === "collected"
      ? (item.invoice.paidOn ?? item.invoice.issuedOn)
      : item.invoice.issuedOn;
  const dateLabel = basisText(basis).rowDate({
    date: calendarDateNumericLabel(dateFormat, basisDate),
  });

  if (item.invoice.periodStart === null) {
    return dateLabel;
  }

  return `${capitalizedMonthLabel(locale, item.invoice.periodStart)} · ${dateLabel}`;
}
