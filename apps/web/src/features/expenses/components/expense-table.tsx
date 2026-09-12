import type { ExpenseData, ExpensesMonthData } from "@opusline/api-client";
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

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { type AmountUnit, expenseAmountCents } from "../lib/amounts";
import { expenseRateLabel } from "../lib/labels";
import { useFileDrop } from "../lib/use-file-drop";
import { DateTile } from "./date-tile";
import { ExpenseReceiptCell } from "./expense-receipt-cell";
import { ExpenseRowMenu } from "./expense-row-menu";
import { ExpenseStatusBadge } from "./expense-status-badge";
import { ExpenseSupplierCell } from "./expense-supplier-cell";

export type ExpenseRowHandlers = {
  /** The expense a receipt upload is in flight for. */
  uploadingExpenseId: number | null;
  onAttachReceipt: (expense: ExpenseData, files: FileList) => void;
  onDetachReceipt: (expense: ExpenseData) => void;
  onDelete: (expense: ExpenseData) => void;
};

type ExpenseTableProps = ExpenseRowHandlers & {
  month: ExpensesMonthData;
  expenses: ExpenseData[];
  unit: AmountUnit;
  className?: string;
};

const HEAD_CLASSES = cn(
  eyebrowVariants({ tone: "quiet" }),
  "h-auto px-2.5 pt-2.5 pb-2 font-normal",
);

/**
 * `table-fixed` with a width on every column, so the supplier cell truncates
 * instead of pushing the amounts off the card.
 */
export function ExpenseTable({
  month,
  expenses,
  unit,
  className,
  ...handlers
}: ExpenseTableProps) {
  const isVatLiable = month.vat !== null;

  return (
    <Table className={cn("table-fixed", className)}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className={cn(HEAD_CLASSES, "w-17")}>
            {m.expenses_col_date()}
          </TableHead>
          <TableHead className={HEAD_CLASSES}>
            {m.expenses_col_supplier()}
          </TableHead>
          {isVatLiable && (
            <>
              <TableHead className={cn(HEAD_CLASSES, "w-22 text-right")}>
                {m.expenses_col_ht()}
              </TableHead>
              <TableHead className={cn(HEAD_CLASSES, "w-27 text-right")}>
                {m.expenses_col_vat()}
              </TableHead>
            </>
          )}
          <TableHead className={cn(HEAD_CLASSES, "w-22 text-right")}>
            {m.expenses_col_ttc()}
          </TableHead>
          <TableHead className={cn(HEAD_CLASSES, "w-40")}>
            {m.expenses_col_status()}
          </TableHead>
          <TableHead className={cn(HEAD_CLASSES, "w-38")}>
            {m.expenses_col_receipt()}
          </TableHead>
          <TableHead className={cn(HEAD_CLASSES, "w-11")}>
            <span className="sr-only">{m.common_more_actions()}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <ExpenseRow
            expense={expense}
            key={expense.id}
            month={month}
            unit={unit}
            {...handlers}
          />
        ))}
      </TableBody>
    </Table>
  );
}

const CELL_CLASSES = "px-2.5 py-2.5 align-middle";

const AMOUNT_CLASSES = "font-mono text-sm tabular-nums";

function ExpenseRow({
  expense,
  month,
  unit,
  uploadingExpenseId,
  onAttachReceipt,
  onDetachReceipt,
  onDelete,
}: ExpenseRowHandlers & {
  expense: ExpenseData;
  month: ExpensesMonthData;
  unit: AmountUnit;
}) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const dropTarget = useFileDrop((files) => onAttachReceipt(expense, files));

  return (
    <TableRow
      className="group/row border-t transition-colors hover:bg-accent data-drag-over:bg-primary/7"
      {...dropTarget}
    >
      <TableCell className={CELL_CLASSES}>
        <DateTile date={expense.spentOn} />
      </TableCell>
      <TableCell className={cn(CELL_CLASSES, "max-w-0")}>
        <ExpenseSupplierCell expense={expense} />
      </TableCell>
      {month.vat !== null && (
        <>
          <TableCell
            className={cn(
              CELL_CLASSES,
              AMOUNT_CLASSES,
              "text-right",
              unit === "ht" ? "text-foreground-hi" : "text-muted-foreground-3",
            )}
          >
            {formatAmountWithCents(format, expense.amountHt.amount)}
          </TableCell>
          <TableCell className={cn(CELL_CLASSES, "text-right")}>
            <div className={cn(AMOUNT_CLASSES, "text-foreground-2")}>
              {expense.vat.amount === 0 && expense.vatTreatment !== 0
                ? "—"
                : formatAmountWithCents(format, expense.vat.amount)}
            </div>
            <div className="mt-0.5 text-muted-foreground-3 text-xs">
              {expenseRateLabel(locale, expense)}
            </div>
          </TableCell>
        </>
      )}
      <TableCell
        className={cn(
          CELL_CLASSES,
          AMOUNT_CLASSES,
          "text-right",
          unit === "ttc" || month.vat === null
            ? "text-foreground-hi"
            : "text-muted-foreground-3",
        )}
      >
        {formatAmountWithCents(format, expenseAmountCents(expense, "ttc"))}
      </TableCell>
      <TableCell className={cn(CELL_CLASSES, "max-w-0")}>
        <ExpenseStatusBadge expense={expense} month={month} />
      </TableCell>
      <TableCell className={cn(CELL_CLASSES, "max-w-0")}>
        <ExpenseReceiptCell
          expense={expense}
          isUploading={uploadingExpenseId === expense.id}
          onAttach={(files) => onAttachReceipt(expense, files)}
        />
      </TableCell>
      <TableCell className={cn(CELL_CLASSES, "pr-2 pl-0 text-right")}>
        <ExpenseRowMenu
          expense={expense}
          onDelete={onDelete}
          onDetachReceipt={onDetachReceipt}
        />
      </TableCell>
    </TableRow>
  );
}
