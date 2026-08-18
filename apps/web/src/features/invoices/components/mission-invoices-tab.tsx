import type { InvoiceListItemData, MissionData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { CircleAlert, PlusIcon } from "lucide-react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { isFixedPrice } from "@/lib/durations";
import { invoiceStatusBadge } from "@/lib/invoice-status";
import { m } from "@/paraglide/messages.js";

import { invoiceRowDetail } from "../lib/labels";

const ROW_GRID =
  "grid grid-cols-[minmax(0,1fr)_6rem_7.25rem] items-baseline gap-x-3";

type MissionInvoicesTabProps = {
  mission: MissionData;
  invoices: InvoiceListItemData[];
  /** Today in the account's timezone — the date isLate was derived from. */
  accountToday: string;
  isPending?: boolean;
  isError?: boolean;
  onCreateInvoice: () => void;
  onOpenInvoice: (invoiceId: number) => void;
};

export function MissionInvoicesTab({
  mission,
  invoices,
  accountToday,
  isPending,
  isError,
  onCreateInvoice,
  onOpenInvoice,
}: MissionInvoicesTabProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  // A fixed price is billed by decision, so it needs a way in; a time-billed
  // mission gets one from the "à facturer" row, which knows which entries the
  // invoice consumes.
  const canCreate = isFixedPrice(mission.billingMode) && mission.rate !== null;

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="warn">
        <CircleAlert />
        <AlertDescription>{m.missions_invoices_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {canCreate && (
        <div className="flex justify-end">
          <Button onClick={onCreateInvoice}>
            <PlusIcon aria-hidden className="size-3.5" strokeWidth={2.2} />
            {m.missions_create_invoice()}
          </Button>
        </div>
      )}

      {invoices.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{m.common_no_invoices_title()}</EmptyTitle>
            <EmptyDescription>{emptyHint(mission)}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="overflow-hidden rounded-md border bg-card">
          {invoices.map(({ invoice }) => {
            const badge = invoiceStatusBadge(invoice);

            return (
              <li key={invoice.id} className="border-b last:border-b-0">
                <button
                  type="button"
                  className={`${ROW_GRID} w-full px-5 py-3.5 text-left transition-colors hover:bg-accent`}
                  onClick={() => onOpenInvoice(invoice.id)}
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="truncate text-foreground-hi text-sm">
                      {invoice.number ?? m.invoices_no_reference()}
                    </span>
                    <span className="truncate text-muted-foreground-3 text-xs">
                      {invoiceRowDetail(
                        format.locale,
                        dateFormat,
                        invoice,
                        accountToday,
                      )}
                    </span>
                  </span>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                  <span className="text-right font-mono text-foreground-hi text-sm tabular-nums">
                    {formatWholeAmount(format, invoice.amountTtc.amount)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function emptyHint(mission: MissionData): string {
  if (mission.rate === null) {
    return m.missions_no_invoices_unbillable_hint();
  }

  return isFixedPrice(mission.billingMode)
    ? m.missions_no_invoices_forfait_hint()
    : m.missions_no_invoices_billable_hint();
}
