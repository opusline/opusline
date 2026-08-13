import type { InvoiceDetailData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@opusline/ui/components/sheet";

import { formatAmountWithCents, formatPercentFromBp } from "@/lib/billing";
import { calendarDateNumericLabel, calendarRangeLabel } from "@/lib/dates";
import { INVOICE_EVENT_LABELS, invoiceStatusBadge } from "@/lib/invoice-status";

import { Fact } from "./invoice-fact";

type InvoiceDrawerProps = {
  detail: InvoiceDetailData | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
}: InvoiceDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[30rem] gap-0 overflow-y-auto sm:max-w-[30rem]"
      >
        {detail === undefined ? (
          <SheetHeader>
            <SheetTitle>Facture</SheetTitle>
            <SheetDescription>Chargement…</SheetDescription>
          </SheetHeader>
        ) : (
          <InvoiceDrawerBody detail={detail} />
        )}
      </SheetContent>
    </Sheet>
  );
}

function InvoiceDrawerBody({ detail }: { detail: InvoiceDetailData }) {
  const { invoice, client, mission, history } = detail;
  const badge = invoiceStatusBadge(invoice);

  return (
    <>
      <SheetHeader className="gap-1.5">
        <SheetTitle className="flex items-center gap-2.5 font-mono text-base">
          {invoice.number ?? "Brouillon"}
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
          value={mission?.name ?? "Sans mission"}
          tone="text"
        />
        <Fact
          label="Période"
          value={
            calendarRangeLabel(invoice.periodStart, invoice.periodEnd) ?? "—"
          }
        />
        <Fact
          label="Émise le"
          value={calendarDateNumericLabel(invoice.issuedOn)}
        />
        <Fact
          label="Échéance"
          value={calendarDateNumericLabel(invoice.dueOn)}
        />
        <Fact
          label="Montant HT"
          value={formatAmountWithCents(invoice.amountHt.amount)}
        />
        <Fact
          label={`TVA ${formatPercentFromBp(invoice.vatRateBp)} %`}
          value={formatAmountWithCents(invoice.amountVat.amount)}
        />
        <Fact
          label="Total TTC"
          value={formatAmountWithCents(invoice.amountTtc.amount)}
        />
        {invoice.paidOn !== null && (
          <Fact
            label="Encaissée le"
            value={calendarDateNumericLabel(invoice.paidOn)}
          />
        )}
      </dl>

      <section className="border-t px-4 py-5">
        <SectionTitle>Historique</SectionTitle>
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
                  {INVOICE_EVENT_LABELS[event.kind]}
                </p>
                <p className="mt-0.5 font-mono text-muted-foreground-3 text-xs tabular-nums">
                  {calendarDateNumericLabel(event.occurredOn)}
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
