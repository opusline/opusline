import type { InvoiceDetailData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
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
import { invoiceStatusBadge, invoiceStatusToken } from "@/lib/invoice-status";
import { m } from "@/paraglide/messages.js";

import { Fact } from "./invoice-fact";
import { InvoiceHistory } from "./invoice-history";

type InvoiceDrawerProps = {
  detail: InvoiceDetailData | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The fiche could not be fetched — reported in place of the body. */
  error?: string | null;
  /** What can be done to this invoice next — composed by the page that owns the writes. */
  actions?: ReactNode;
};

function SectionTitle({ children }: { children: string }) {
  return <h3 className={eyebrowVariants()}>{children}</h3>;
}

export function InvoiceDrawer({
  detail,
  open,
  onOpenChange,
  error,
  actions,
}: InvoiceDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="gap-0 overflow-y-auto"
        data-testid="invoice-drawer"
        side="right"
        size="md"
      >
        <InvoiceDrawerContents
          actions={actions}
          detail={detail}
          error={error ?? null}
        />
      </SheetContent>
    </Sheet>
  );
}

function InvoiceDrawerContents({
  detail,
  error,
  actions,
}: {
  detail: InvoiceDetailData | undefined;
  error: string | null;
  actions?: ReactNode;
}) {
  if (error !== null) {
    return (
      <SheetHeader>
        <SheetTitle>{m.invoices_drawer_title()}</SheetTitle>
        {/* Its own node rather than the description: the sheet announces the
            description on open, so an alert there would be read twice. */}
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      </SheetHeader>
    );
  }

  if (detail === undefined) {
    return (
      <SheetHeader>
        <SheetTitle>{m.invoices_drawer_title()}</SheetTitle>
        <SheetDescription>{m.invoices_loading()}</SheetDescription>
      </SheetHeader>
    );
  }

  return <InvoiceDrawerBody actions={actions} detail={detail} />;
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
        <SheetTitle
          className="flex items-center gap-2.5 font-mono text-base"
          data-reference={invoice.number ?? ""}
          data-status={invoiceStatusToken(invoice)}
          data-testid="invoice-drawer-title"
        >
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
        <InvoiceHistory className="mt-3.5" history={history} />
      </section>
    </>
  );
}
