import type { InvoiceSummaryData } from "@opusline/api-client";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";

import { m } from "@/paraglide/messages.js";

import { invoiceForecastBucketLabel } from "../lib/summary-labels";

/**
 * What is expected to land in the next 60 days, bar per bucket.
 *
 * Money already overdue is not one of the bars — the API leaves it out for that
 * reason — so it sits underneath as a note and the bars stay a forecast.
 */
export function InvoiceForecastCard({
  summary,
}: {
  summary: InvoiceSummaryData;
}) {
  const format = useMoneyFormat();
  const overdue = summary.overdue;

  return (
    <section className="rounded-md border bg-card px-5 py-4">
      <h2 className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
        {m.invoices_forecast_title()}
      </h2>

      <ul className="mt-3.5 flex flex-col gap-3">
        {summary.forecast.map((bar) => (
          <li key={bar.bucket}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground-3 text-xs">
                {invoiceForecastBucketLabel(bar.bucket)}
              </span>
              <span className="font-mono text-foreground-hi text-sm tabular-nums">
                {formatWholeAmount(format, bar.amount.amount)}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted-2">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${bar.shareBp / 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      {overdue.count > 0 && (
        <p className="mt-4 border-t pt-3 text-muted-foreground-3 text-xs">
          <span className="font-mono text-destructive tabular-nums">
            {formatWholeAmount(format, overdue.amount.amount)}
          </span>{" "}
          {m.invoices_already_overdue()}
        </p>
      )}
    </section>
  );
}
