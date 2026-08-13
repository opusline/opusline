import type { InvoiceSummaryData } from "@opusline/api-client";

import { formatEuros } from "@/lib/billing";

import { INVOICE_FORECAST_BUCKET_LABELS } from "../lib/summary-labels";

/**
 * What is expected to land in the next 60 days, bar per bucket.
 *
 * Money already overdue is not one of the bars: it is not expected, it is missing.
 * It sits under them as a note so the bars stay a forecast.
 */
export function InvoiceForecastCard({
  summary,
}: {
  summary: InvoiceSummaryData;
}) {
  const upcoming = summary.forecast.filter((bar) => bar.bucket !== 0);
  const overdue = summary.overdue;

  return (
    <section className="rounded-md border bg-card px-5 py-4">
      <h2 className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
        Attendu sur 60 jours
      </h2>

      <ul className="mt-3.5 flex flex-col gap-3">
        {upcoming.map((bar) => (
          <li key={bar.bucket}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground-3 text-xs">
                {INVOICE_FORECAST_BUCKET_LABELS[bar.bucket]}
              </span>
              <span className="font-mono text-foreground-hi text-sm tabular-nums">
                {formatEuros(bar.amount.amount)}
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
            {formatEuros(overdue.amount.amount)}
          </span>{" "}
          déjà échus
        </p>
      )}
    </section>
  );
}
