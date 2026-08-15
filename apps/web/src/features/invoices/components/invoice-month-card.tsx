import type { InvoiceSummaryData } from "@opusline/api-client";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";

import { capitalizedMonthLabel } from "@/lib/dates";

import { periodsLabel } from "../lib/summary-labels";

/**
 * The month's own figure is not revenue — that lands on the payment date, not this
 * month — but work already tracked and not yet on any invoice. It is the only
 * monthly number on this screen that asks for something to be done.
 */
export function InvoiceMonthCard({ summary }: { summary: InvoiceSummaryData }) {
  const format = useMoneyFormat();
  const { monthUnbilled } = summary;
  const hasUnbilledWork = monthUnbilled.count > 0;

  return (
    <section className="rounded-md border bg-card px-5 py-4">
      <h2 className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
        {capitalizedMonthLabel(format.locale, `${summary.month}-01`)}
      </h2>

      {hasUnbilledWork ? (
        <p className="mt-3 text-foreground-2 text-sm text-pretty">
          <span className="font-mono text-foreground-hi tabular-nums">
            {formatWholeAmount(format, monthUnbilled.amount.amount)}
          </span>{" "}
          saisis ce mois-ci, pas encore facturés.
        </p>
      ) : (
        <p className="mt-3 text-muted-foreground-3 text-sm text-pretty">
          Tout le temps saisi ce mois-ci est facturé.
        </p>
      )}

      <p className="mt-1.5 text-muted-foreground-3 text-xs">
        {periodsLabel(monthUnbilled)}
      </p>
    </section>
  );
}
