import type { InvoiceSummaryData } from "@opusline/api-client";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";

import { capitalizedMonthLabel } from "@/lib/dates";

import { m } from "@/paraglide/messages.js";

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
      <h2 className={eyebrowVariants()}>
        {capitalizedMonthLabel(format.locale, `${summary.month}-01`)}
      </h2>

      {hasUnbilledWork ? (
        <p className="mt-3 text-foreground-2 text-sm text-pretty">
          <span className="font-mono text-foreground-hi tabular-nums">
            {formatWholeAmount(format, monthUnbilled.amount.amount)}
          </span>{" "}
          {m.invoices_month_unbilled()}
        </p>
      ) : (
        <p className="mt-3 text-muted-foreground-3 text-sm text-pretty">
          {m.invoices_month_all_billed()}
        </p>
      )}

      <p className="mt-1.5 text-muted-foreground-3 text-xs">
        {periodsLabel(monthUnbilled)}
      </p>
    </section>
  );
}
