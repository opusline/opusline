import type { InvoiceEventData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";

import { useDateFormat } from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { INVOICE_EVENT_TOKENS, invoiceEventLabel } from "@/lib/invoice-status";

export function InvoiceHistory({
  history,
  className,
}: {
  history: InvoiceEventData[];
  className?: string;
}) {
  const dateFormat = useDateFormat();

  return (
    <ol className={cn("flex flex-col gap-3.5", className)}>
      {/* Newest first: the last thing that happened is the thing you came to check. */}
      {[...history].reverse().map((event) => (
        <li
          key={event.id}
          className="flex gap-3"
          data-event={INVOICE_EVENT_TOKENS[event.kind]}
          data-testid="invoice-history-item"
        >
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
  );
}
