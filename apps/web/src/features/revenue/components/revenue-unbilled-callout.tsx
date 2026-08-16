import type {
  InvoiceSummaryData,
  InvoiceTodoWorkData,
  Locale,
} from "@opusline/api-client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { TriangleAlertIcon } from "lucide-react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { billedQuantityLabel } from "@/lib/durations";
import { m } from "@/paraglide/messages.js";

/**
 * The same data the Factures todo panel reads — one cache entry, one truth —
 * summarized into a sentence instead of a list.
 */
export function RevenueUnbilledCallout({
  summary,
  onGoToInvoices,
}: {
  summary: InvoiceSummaryData;
  onGoToInvoices: () => void;
}) {
  const format = useMoneyFormat();

  if (summary.unbilled.count === 0) {
    return null;
  }

  const fragments = summary.todo
    .map((todo) => todo.work)
    .filter((work): work is InvoiceTodoWorkData => work != null)
    .map((work) => workFragment(format.locale, work));

  return (
    <Alert variant="brand">
      <TriangleAlertIcon />
      <AlertTitle>
        {m.revenue_unbilled_title({ count: summary.unbilled.count })}
      </AlertTitle>
      <AlertDescription>
        <span className="text-pretty">
          {fragments.length > 0 && `${fragments.join(", ")}. `}
          {m.revenue_unbilled_total({
            amount: formatWholeAmount(format, summary.unbilled.amount.amount),
          })}
        </span>
        <span className="mt-3 block">
          <Button onClick={onGoToInvoices} size="lg">
            {m.invoices_create_title()}
          </Button>
        </span>
      </AlertDescription>
    </Alert>
  );
}

/** "Orvella front · 3 j" — the mission, then what it would bill in its own unit. */
function workFragment(locale: Locale, work: InvoiceTodoWorkData): string {
  const quantity = billedQuantityLabel(locale, work);

  return quantity === null
    ? work.missionName
    : `${work.missionName} · ${quantity}`;
}
