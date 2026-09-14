import type {
  ExpenseData,
  ExpensesMonthData,
  ExpenseTodoData,
  ExpenseTodoKind,
} from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Dropzone } from "@opusline/ui/components/dropzone";
import { Eyebrow } from "@opusline/ui/components/eyebrow";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { PaperclipIcon } from "lucide-react";
import { useId } from "react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { RECEIPT_ACCEPT } from "../lib/receipts";

type ExpenseTodoRailProps = {
  month: ExpensesMonthData;
  uploadingExpenseId: number | null;
  onAttachReceipt: (expense: ExpenseData, files: FileList) => void;
  onCreateFromDebit: (todo: ExpenseTodoData) => void;
};

const KIND_STYLES: Record<ExpenseTodoKind, { card: string; dot: string }> = {
  0: { card: "border-attention/40", dot: "bg-attention" },
  1: { card: "border-primary/40", dot: "bg-primary" },
  2: { card: "border-border", dot: "bg-muted-foreground-4" },
};

function todoLines(
  todo: ExpenseTodoData,
  date: string,
  blockedVat: string | null,
): [string, string] {
  switch (todo.kind) {
    case 0:
      return [
        m.expenses_todo_missing_receipt({ supplier: todo.label }),
        blockedVat === null
          ? m.expenses_todo_missing_receipt_franchise_sub({ date })
          : m.expenses_todo_missing_receipt_sub({ date, vat: blockedVat }),
      ];
    case 1:
      return [
        m.expenses_todo_unmatched_debit({ label: todo.label }),
        m.expenses_todo_unmatched_debit_sub({ date }),
      ];
    case 2:
      return [
        m.expenses_todo_annual({ supplier: todo.label }),
        m.expenses_todo_annual_sub({ date }),
      ];
  }
}

export function ExpenseTodoRail({
  month,
  uploadingExpenseId,
  onAttachReceipt,
  onCreateFromDebit,
}: ExpenseTodoRailProps) {
  const titleId = useId();

  return (
    <aside aria-labelledby={titleId} className="flex flex-col gap-3">
      <Eyebrow className="mx-0.5" id={titleId}>
        {m.expenses_todo_title()}
      </Eyebrow>
      <ul className="flex flex-col gap-3">
        {month.todo.map((todo) => (
          <TodoCard
            key={`${todo.kind}:${todo.expenseId ?? todo.bankMovementId ?? todo.subscriptionId}`}
            month={month}
            onAttachReceipt={onAttachReceipt}
            onCreateFromDebit={onCreateFromDebit}
            todo={todo}
            uploadingExpenseId={uploadingExpenseId}
          />
        ))}
      </ul>
      <Link
        className="mx-0.5 text-link text-sm transition-colors hover:text-link-hover"
        search={(current) => ({ ...current, tab: "subscriptions" })}
        to="/expenses"
      >
        {m.expenses_todo_all_subscriptions()}
      </Link>
    </aside>
  );
}

function TodoCard({
  todo,
  month,
  uploadingExpenseId,
  onAttachReceipt,
  onCreateFromDebit,
}: ExpenseTodoRailProps & { todo: ExpenseTodoData }) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const style = KIND_STYLES[todo.kind];
  const expense = month.expenses.find((row) => row.id === todo.expenseId);
  const [title, sub] = todoLines(
    todo,
    calendarDateNumericLabel(dateFormat, todo.date),
    month.vat === null
      ? null
      : formatAmountWithCents(format, expense?.recoverableVat.amount ?? 0),
  );

  return (
    <li
      className={cn(
        "flex flex-col gap-3 rounded-md border bg-card p-3.5",
        style.card,
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className={cn("mt-1.5 size-2 shrink-0 rounded-full", style.dot)}
        />
        <div className="min-w-0 flex-1">
          <div className="text-foreground-hi text-sm">{title}</div>
          <div className="mt-0.75 text-muted-foreground-3 text-xs leading-snug">
            {sub}
          </div>
        </div>
        <span className="shrink-0 font-mono text-foreground-2 text-sm tabular-nums">
          {formatAmountWithCents(format, todo.amount.amount)}
        </span>
      </div>
      {todo.kind === 0 && expense !== undefined && (
        <Dropzone
          accept={RECEIPT_ACCEPT}
          aria-label={m.expenses_receipt_link_aria({
            supplier: expense.supplier,
          })}
          className="justify-center"
          disabled={uploadingExpenseId === expense.id}
          onFiles={(files) => onAttachReceipt(expense, files)}
          size="inline"
          tone="attention"
        >
          <PaperclipIcon aria-hidden />
          {uploadingExpenseId === expense.id
            ? m.expenses_receipt_uploading()
            : m.expenses_receipt_link()}
        </Dropzone>
      )}
      {todo.kind === 1 && (
        <Button
          onClick={() => onCreateFromDebit(todo)}
          size="lg"
          variant="secondary"
        >
          {m.expenses_todo_create()}
        </Button>
      )}
    </li>
  );
}
