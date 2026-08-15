import type { InvoiceDetailData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@opusline/ui/components/sheet";
import type { ReactNode } from "react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents, formatPercentFromBp } from "@/lib/billing";
import { calendarDateNumericLabel, calendarRangeLabel } from "@/lib/dates";
import { invoiceEventLabel, invoiceStatusBadge } from "@/lib/invoice-status";
import { m } from "@/paraglide/messages.js";

import { Fact } from "./invoice-fact";

type InvoiceDrawerProps = {
  detail: InvoiceDetailData | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What can be done to this invoice next — composed by the page that owns the writes. */
  actions?: ReactNode;
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
      {children}
    </h3>
  );
}

export function InvoiceDrawer({
  detail,
  open,
  onOpenChange,
  actions,
}: InvoiceDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[30rem] gap-0 overflow-y-auto sm:max-w-[30rem]"
      >
        {detail === undefined ? (
          <SheetHeader>
            <SheetTitle>{m.invoices_drawer_title()}</SheetTitle>
            <SheetDescription>{m.invoices_loading()}</SheetDescription>
          </SheetHeader>
        ) : (
          <InvoiceDrawerBody actions={actions} detail={detail} />
        )}
      </SheetContent>
    </Sheet>
  );
}

function InvoiceDrawerBody({
  detail,
  actions,
}: {
  detail: InvoiceDetailData;
  actions?: ReactNode;
}) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const { invoice, client, mission, history } = detail;
  const badge = invoiceStatusBadge(invoice);

  return (
    <>
      <SheetHeader className="gap-1.5">
        <SheetTitle className="flex items-center gap-2.5 font-mono text-base">
          {invoice.number ?? m.invoice_status_draft()}
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </SheetTitle>
        <SheetDescription>
          {mission === null ? client.name : `${mission.name} · ${client.name}`}
        </SheetDescription>
      </SheetHeader>

      <dl className="grid grid-cols-2 gap-x-5 gap-y-4 border-t px-4 py-5">
        <Fact label="Client" value={client.name} tone="text" />
        <Fact
          label="Mission"
          value={mission?.name ?? m.invoices_no_mission()}
          tone="text"
        />
        <Fact
          label={m.invoices_fact_period()}
          value={
            calendarRangeLabel(
              dateFormat,
              invoice.periodStart,
              invoice.periodEnd,
            ) ?? "—"
          }
        />
        <Fact
          label={m.invoices_issued_on_label()}
          value={calendarDateNumericLabel(dateFormat, invoice.issuedOn)}
        />
        <Fact
          label={m.invoices_due_label()}
          value={calendarDateNumericLabel(dateFormat, invoice.dueOn)}
        />
        <Fact
          label={m.invoices_amount_ht_label()}
          value={formatAmountWithCents(format, invoice.amountHt.amount)}
        />
        <Fact
          label={m.invoices_vat_rate_fact({
            rate: formatPercentFromBp(format.locale, invoice.vatRateBp),
          })}
          value={formatAmountWithCents(format, invoice.amountVat.amount)}
        />
        <Fact
          label="Total TTC"
          value={formatAmountWithCents(format, invoice.amountTtc.amount)}
        />
        {invoice.paidOn !== null && (
          <Fact
            label={m.invoices_paid_on_label()}
            value={calendarDateNumericLabel(dateFormat, invoice.paidOn)}
          />
        )}
      </dl>

      {actions}

      <section className="border-t px-4 py-5">
        <SectionTitle>{m.invoices_history_title()}</SectionTitle>
        <ol className="mt-3.5 flex flex-col gap-3.5">
          {/* Newest first: the last thing that happened is the thing you came to check. */}
          {[...history].reverse().map((event) => (
            <li key={event.id} className="flex gap-3">
              <span
                aria-hidden
                className="mt-1.5 size-1.75 shrink-0 rounded-full bg-border-4"
              />
              <div className="min-w-0">
                <p className="text-foreground-3 text-sm">
                  {invoiceEventLabel(event.kind)}
                </p>
                <p className="mt-0.5 font-mono text-muted-foreground-3 text-xs tabular-nums">
                  {calendarDateNumericLabel(dateFormat, event.occurredOn)}
                </p>
                {event.note !== null && (
                  <p className="mt-1 text-muted-foreground-3 text-xs">
                    {event.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
