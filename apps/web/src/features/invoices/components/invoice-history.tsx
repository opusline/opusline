import type { InvoiceEventData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents, type MoneyFormat } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { INVOICE_EVENT_TOKENS, invoiceEventLabel } from "@/lib/invoice-status";

/** A recorded payment's note is its amount in cents (PayInvoice writes it); any other note is text. */
function eventNote(format: MoneyFormat, event: InvoiceEventData): string {
  return event.kind === 6 && event.note !== null && /^-?\d+$/.test(event.note)
    ? formatAmountWithCents(format, Number(event.note))
    : (event.note ?? "");
}

export function InvoiceHistory({
  history,
  className,
}: {
  history: InvoiceEventData[];
  className?: string;
}) {
  const dateFormat = useDateFormat();
  const format = useMoneyFormat();

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
              <p
                className="mt-1 text-muted-foreground-3 text-xs"
                data-testid="invoice-history-note"
              >
                {eventNote(format, event)}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
