import type { ExpenseData, ExpensesMonthData } from "@opusline/api-client";
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
import type { ExpenseRowHandlers } from "./expense-table";

type ExpenseCardListProps = ExpenseRowHandlers & {
  month: ExpensesMonthData;
  expenses: ExpenseData[];
  unit: AmountUnit;
  className?: string;
};

export function ExpenseCardList({
  month,
  expenses,
  unit,
  className,
  ...handlers
}: ExpenseCardListProps) {
  return (
    <ul className={cn("flex flex-col gap-2 p-2", className)}>
      {expenses.map((expense) => (
        <ExpenseCard
          expense={expense}
          key={expense.id}
          month={month}
          unit={unit}
          {...handlers}
        />
      ))}
    </ul>
  );
}

function ExpenseCard({
  expense,
  month,
  unit,
  uploadingExpenseId,
  onAttachReceipt,
  onDetachReceipt,
  onEdit,
  onDuplicate,
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
    <li
      className={cn(
        "group/row rounded-md border bg-card p-3 transition-colors data-drag-over:border-primary/80 data-drag-over:bg-primary/7",
        expense.vatStatus === 3 && "border-attention/35",
      )}
      {...dropTarget}
    >
      <div className="flex items-start gap-2.5">
        <DateTile date={expense.spentOn} size="sm" />
        <ExpenseSupplierCell expense={expense} />
        <div className="ml-auto shrink-0 text-right">
          <div className="font-mono text-base text-foreground-hi tabular-nums">
            {formatAmountWithCents(format, expenseAmountCents(expense, unit))}
          </div>
          {month.vat !== null && (
            <div className="mt-0.5 text-muted-foreground-3 text-xs">
              {unit === "ht"
                ? expenseRateLabel(locale, expense)
                : `${formatAmountWithCents(format, expenseAmountCents(expense, "ht"))} ${m.common_ht()}`}
            </div>
          )}
        </div>
        <ExpenseRowMenu
          className="opacity-100"
          expense={expense}
          onDelete={onDelete}
          onDetachReceipt={onDetachReceipt}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
        />
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <ExpenseStatusBadge expense={expense} month={month} withSub={false} />
        <div className="min-w-0 max-w-1/2">
          <ExpenseReceiptCell
            expense={expense}
            isUploading={uploadingExpenseId === expense.id}
            onAttach={(files) => onAttachReceipt(expense, files)}
          />
        </div>
      </div>
    </li>
  );
}
