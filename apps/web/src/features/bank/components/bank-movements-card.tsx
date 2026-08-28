import type { BankAccountData, BankMovementData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@opusline/ui/components/table";
import { cn } from "@opusline/ui/lib/utils";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { movementsSourceNote, signedAmountLabel } from "../lib/labels";

const HEAD_CLASSES = "sticky top-0 z-10 bg-card px-0 pt-3 pb-2 font-normal";

type BankMovementsCardProps = {
  data: BankAccountData;
};

export function BankMovementsCard({ data }: BankMovementsCardProps) {
  const dateFormat = useDateFormat();

  return (
    <section className="rounded-md border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className={eyebrowVariants()}>{m.bank_movements_title()}</h2>
        <span className="text-muted-foreground-3 text-xs">
          {movementsSourceNote(dateFormat, data)}
        </span>
      </div>

      {data.movements.length === 0 ? (
        <p className="pt-6 pb-2 text-center text-muted-foreground-3 text-sm">
          {m.bank_movements_empty()}
        </p>
      ) : (
        <Table
          className="min-w-xl table-fixed border-separate border-spacing-0"
          containerClassName="max-h-96 overflow-auto"
        >
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead
                className={cn(eyebrowVariants(), HEAD_CLASSES, "w-26")}
              >
                {m.bank_movements_date_header()}
              </TableHead>
              <TableHead className={cn(eyebrowVariants(), HEAD_CLASSES)}>
                {m.bank_movements_label_header()}
              </TableHead>
              <TableHead
                className={cn(eyebrowVariants(), HEAD_CLASSES, "w-26")}
              >
                {m.bank_movements_link_header()}
              </TableHead>
              <TableHead
                className={cn(
                  eyebrowVariants(),
                  HEAD_CLASSES,
                  "w-29 text-right",
                )}
              >
                {m.bank_movements_amount_header()}
              </TableHead>
              <TableHead
                className={cn(
                  eyebrowVariants(),
                  HEAD_CLASSES,
                  "w-22 text-right",
                )}
              >
                {m.bank_movements_balance_header()}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.movements.map((movement) => (
              <MovementRow key={movement.id} movement={movement} />
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}

const CELL_CLASSES = "border-secondary border-t px-0 py-2.5";

function MovementRow({ movement }: { movement: BankMovementData }) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        className={cn(
          CELL_CLASSES,
          "pr-3 font-mono text-muted-foreground-3 text-sm tabular-nums",
        )}
      >
        {calendarDateNumericLabel(dateFormat, movement.bookedOn)}
      </TableCell>
      <TableCell
        className={cn(
          CELL_CLASSES,
          "max-w-0 truncate pr-3 text-foreground-3 text-sm",
        )}
      >
        {movement.label}
      </TableCell>
      <TableCell className={cn(CELL_CLASSES, "pr-3")}>
        {movement.invoice !== null ? (
          <span className="font-mono text-muted-foreground text-xs">
            {movement.invoice.number ?? "—"}
          </span>
        ) : movement.pendingMatchId !== null ? (
          <Badge variant="brand">{m.bank_movement_pending_chip()}</Badge>
        ) : (
          <span className="text-muted-foreground-3 text-xs">—</span>
        )}
      </TableCell>
      <TableCell
        className={cn(
          CELL_CLASSES,
          "pr-3 text-right font-mono text-sm tabular-nums",
          movement.amount.amount > 0 ? "text-success" : "text-foreground-3",
        )}
      >
        {signedAmountLabel(format, movement.amount.amount)}
      </TableCell>
      <TableCell
        className={cn(
          CELL_CLASSES,
          "text-right font-mono text-muted-foreground-3 text-sm tabular-nums",
        )}
      >
        {movement.runningBalance === null
          ? "—"
          : formatWholeAmount(format, movement.runningBalance.amount)}
      </TableCell>
    </TableRow>
  );
}
