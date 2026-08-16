import type { BankAccountData, BankMovementData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { cn } from "@opusline/ui/lib/utils";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { movementsSourceNote, signedAmountLabel } from "../lib/labels";

const GRID_CLASSES =
  "grid grid-cols-[6.5rem_minmax(0,1fr)_6.5rem_7.25rem_5.5rem] items-center gap-3";

type BankMovementsCardProps = {
  data: BankAccountData;
};

export function BankMovementsCard({ data }: BankMovementsCardProps) {
  const dateFormat = useDateFormat();

  return (
    <section className="rounded-md border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
          {m.bank_movements_title()}
        </h2>
        <span className="text-muted-foreground-3 text-xs">
          {movementsSourceNote(dateFormat, data)}
        </span>
      </div>

      {data.movements.length === 0 ? (
        <p className="pt-6 pb-2 text-center text-muted-foreground-3 text-sm">
          {m.bank_movements_empty()}
        </p>
      ) : (
        <div className="max-h-96 overflow-auto">
          <div className="min-w-xl">
            <div
              className={cn(
                GRID_CLASSES,
                "sticky top-0 z-10 bg-card pt-3 pb-2 font-medium text-muted-foreground-3 text-xs uppercase tracking-wider",
              )}
            >
              <div>{m.bank_movements_date_header()}</div>
              <div>{m.bank_movements_label_header()}</div>
              <div>{m.bank_movements_link_header()}</div>
              <div className="text-right">
                {m.bank_movements_amount_header()}
              </div>
              <div className="text-right">
                {m.bank_movements_balance_header()}
              </div>
            </div>
            {data.movements.map((movement) => (
              <MovementRow key={movement.id} movement={movement} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function MovementRow({ movement }: { movement: BankMovementData }) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  return (
    <div className={cn(GRID_CLASSES, "border-secondary border-t py-2.5")}>
      <div className="font-mono text-muted-foreground-3 text-sm tabular-nums">
        {calendarDateNumericLabel(dateFormat, movement.bookedOn)}
      </div>
      <div className="truncate text-foreground-3 text-sm">{movement.label}</div>
      <div>
        {movement.invoice !== null ? (
          <span className="font-mono text-muted-foreground text-xs">
            {movement.invoice.number ?? "—"}
          </span>
        ) : movement.pendingMatchId !== null ? (
          <Badge variant="brand">{m.bank_movement_pending_chip()}</Badge>
        ) : (
          <span className="text-muted-foreground-3 text-xs">—</span>
        )}
      </div>
      <div
        className={cn(
          "text-right font-mono text-sm tabular-nums",
          movement.amount.amount > 0 ? "text-success" : "text-foreground-3",
        )}
      >
        {signedAmountLabel(format, movement.amount.amount)}
      </div>
      <div className="text-right font-mono text-muted-foreground-3 text-sm tabular-nums">
        {movement.runningBalance === null
          ? "—"
          : formatWholeAmount(format, movement.runningBalance.amount)}
      </div>
    </div>
  );
}
