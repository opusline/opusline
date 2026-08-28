import type { PersonalTransferData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { Link } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

type PastTransfersCardProps = {
  transfers: PersonalTransferData[];
  /** The transfer a delete request is in flight for. */
  deletingTransferId: number | null;
  onDelete: (transferId: number) => void;
};

export function PastTransfersCard({
  transfers,
  deletingTransferId,
  onDelete,
}: PastTransfersCardProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  return (
    <section className="rounded-md border bg-card px-6 py-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className={eyebrowVariants()}>{m.treasury_past_title()}</h2>
        <Link
          className="text-primary-text text-xs hover:underline"
          to="/bank-account"
        >
          {m.treasury_see_bank()}
        </Link>
      </div>

      {transfers.length === 0 ? (
        <p className="mt-4 text-muted-foreground-3 text-sm">
          {m.treasury_past_empty()}
        </p>
      ) : (
        <ul className="mt-1.5">
          {transfers.map((transfer) => (
            <TransferRow
              dateLabel={calendarDateNumericLabel(
                dateFormat,
                transfer.transferredOn,
              )}
              isDeleting={deletingTransferId === transfer.id}
              key={transfer.id}
              onDelete={onDelete}
              transfer={transfer}
              valueLabel={formatWholeAmount(format, transfer.amount.amount)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

type TransferRowProps = {
  transfer: PersonalTransferData;
  dateLabel: string;
  valueLabel: string;
  isDeleting: boolean;
  onDelete: (transferId: number) => void;
};

function TransferRow({
  transfer,
  dateLabel,
  valueLabel,
  isDeleting,
  onDelete,
}: TransferRowProps) {
  return (
    <li className="flex items-center gap-3 border-secondary border-b py-3 last:border-b-0">
      <span className="shrink-0 text-foreground-3 text-sm tabular-nums">
        {dateLabel}
      </span>
      <span className="min-w-0 flex-1 truncate text-muted-foreground-2 text-sm">
        {transfer.note}
      </span>
      {!transfer.reflectedInBalance && (
        <Badge variant="quiet">{m.treasury_pending_badge()}</Badge>
      )}
      <span className="shrink-0 whitespace-nowrap font-mono text-foreground-2 text-sm tabular-nums">
        {valueLabel}
      </span>
      <Button
        aria-label={m.treasury_delete_aria({ date: dateLabel })}
        disabled={isDeleting}
        onClick={() => onDelete(transfer.id)}
        size="icon-sm"
        variant="ghost"
      >
        <Trash2Icon aria-hidden />
      </Button>
    </li>
  );
}
