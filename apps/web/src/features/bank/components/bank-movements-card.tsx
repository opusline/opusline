import type { BankAccountData, BankMovementData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
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
import { XIcon } from "lucide-react";

import { LoadMoreButton } from "@/components/load-more-button";
import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { useIsPhone } from "@/lib/use-is-phone";
import { m } from "@/paraglide/messages.js";

import { bankAccountName } from "../lib/connection";
import { movementsSourceNote, signedAmountLabel } from "../lib/labels";
import type { OlderMovements } from "../lib/use-older-movements";

const HEAD_CLASSES = "sticky top-0 z-10 bg-card px-0 pt-3 pb-2 font-normal";

type BankMovementsCardProps = {
  data: BankAccountData;
  olderMovements?: OlderMovements;
  /** Undoes a pairing the app got wrong; absent, the transfer badge is read-only. */
  onUnpairTransfer?: (movementId: number) => void;
  /** The movement an undo request is in flight for. */
  unpairingMovementId?: number | null;
};

export function BankMovementsCard({
  data,
  olderMovements,
  onUnpairTransfer,
  unpairingMovementId = null,
}: BankMovementsCardProps) {
  const dateFormat = useDateFormat();
  const accountNames = bankAccountNames(data);

  // The summary window and the appended pages can briefly overlap while a
  // write refreshes one before the other — a movement must never render twice.
  const windowIds = new Set(data.movements.map((movement) => movement.id));
  const movements = [
    ...data.movements,
    ...(olderMovements?.movements ?? []).filter(
      (movement) => !windowIds.has(movement.id),
    ),
  ];

  return (
    <section className="rounded-md border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className={eyebrowVariants()}>{m.bank_movements_title()}</h2>
        <span className="text-muted-foreground-3 text-xs">
          {movementsSourceNote(dateFormat, data)}
        </span>
      </div>

      {movements.length === 0 ? (
        <p className="pt-6 pb-2 text-center text-muted-foreground-3 text-sm">
          {m.bank_movements_empty()}
        </p>
      ) : (
        <Table
          className="table-fixed border-separate border-spacing-0 sm:min-w-xl"
          containerClassName="max-h-96 overflow-auto"
          scrollLabel={m.bank_movements_title()}
        >
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead
                className={cn(
                  eyebrowVariants(),
                  HEAD_CLASSES,
                  "w-26 max-sm:hidden",
                )}
              >
                {m.bank_movements_date_header()}
              </TableHead>
              <TableHead className={cn(eyebrowVariants(), HEAD_CLASSES)}>
                {m.bank_movements_label_header()}
              </TableHead>
              <TableHead
                className={cn(
                  eyebrowVariants(),
                  HEAD_CLASSES,
                  "w-26 max-sm:hidden",
                )}
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
                  "w-22 text-right max-sm:hidden",
                )}
              >
                {m.bank_movements_balance_header()}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
              <MovementRow
                accountName={accountNames?.get(movement.bankAccountId) ?? null}
                isUnpairing={unpairingMovementId === movement.id}
                key={movement.id}
                movement={movement}
                onUnpairTransfer={
                  onUnpairTransfer === undefined
                    ? undefined
                    : () => onUnpairTransfer(movement.id)
                }
              />
            ))}
          </TableBody>
        </Table>
      )}

      {olderMovements?.hasMore && (
        <LoadMoreButton
          className="pt-3"
          isLoading={olderMovements.isLoading}
          label={m.bank_movements_show_more()}
          onClick={olderMovements.onShowMore}
        />
      )}
    </section>
  );
}

const CELL_CLASSES = "border-secondary border-t px-0 py-2.5";

/** Only worth a line once there are several accounts to tell apart. */
function bankAccountNames(data: BankAccountData): Map<number, string> | null {
  if (data.accounts.length < 2) {
    return null;
  }

  return new Map(
    data.accounts.map((account) => [
      account.id,
      bankAccountName(account, data.connections),
    ]),
  );
}

function MovementRow({
  movement,
  accountName,
  isUnpairing,
  onUnpairTransfer,
}: {
  movement: BankMovementData;
  accountName: string | null;
  isUnpairing: boolean;
  onUnpairTransfer: (() => void) | undefined;
}) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const isPhone = useIsPhone();

  const link =
    movement.invoice !== null ? (
      <span className="font-mono text-muted-foreground text-xs">
        {movement.invoice.number ?? "—"}
      </span>
    ) : movement.pendingMatchId !== null ? (
      <Badge variant="brand">{m.bank_movement_pending_chip()}</Badge>
    ) : movement.isInternalTransfer ? (
      <span className="inline-flex items-center gap-0.5">
        <Badge data-testid="bank-movement-internal-transfer" variant="quiet">
          {m.bank_movement_internal_transfer_chip()}
        </Badge>
        {onUnpairTransfer !== undefined && (
          <Button
            aria-label={m.bank_movement_unpair_aria()}
            data-testid="bank-movement-unpair"
            disabled={isUnpairing}
            onClick={onUnpairTransfer}
            size="icon-xs"
            title={m.bank_movement_unpair_aria()}
            variant="ghost"
          >
            <XIcon aria-hidden />
          </Button>
        )}
      </span>
    ) : null;
  const balance =
    movement.runningBalance === null
      ? null
      : formatWholeAmount(format, movement.runningBalance.amount);

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        className={cn(
          CELL_CLASSES,
          "pr-3 font-mono text-muted-foreground-3 text-sm tabular-nums max-sm:hidden",
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
        {accountName !== null && (
          <span
            className="mt-0.75 block truncate text-muted-foreground-3 text-xs"
            data-testid="bank-movement-account"
          >
            {accountName}
          </span>
        )}
        {/* Below sm the date, link and balance ride under the label and the
            amount: five columns leave the label none of a phone's width. */}
        {isPhone && (
          <span className="mt-0.75 flex items-center gap-2 font-mono text-muted-foreground-3 text-xs tabular-nums">
            {calendarDateNumericLabel(dateFormat, movement.bookedOn)}
            {link}
          </span>
        )}
      </TableCell>
      <TableCell className={cn(CELL_CLASSES, "pr-3 max-sm:hidden")}>
        {link ?? <span className="text-muted-foreground-3 text-xs">—</span>}
      </TableCell>
      <TableCell
        className={cn(
          CELL_CLASSES,
          "text-right font-mono text-sm tabular-nums sm:pr-3",
          movement.amount.amount > 0 ? "text-success" : "text-foreground-3",
        )}
      >
        {signedAmountLabel(format, movement.amount.amount)}
        {isPhone && balance !== null && (
          <span className="mt-0.75 block text-muted-foreground-3 text-xs">
            {balance}
          </span>
        )}
      </TableCell>
      <TableCell
        className={cn(
          CELL_CLASSES,
          "text-right font-mono text-muted-foreground-3 text-sm tabular-nums max-sm:hidden",
        )}
      >
        {balance ?? "—"}
      </TableCell>
    </TableRow>
  );
}
