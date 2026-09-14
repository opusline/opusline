import type { ExpenseData, ExpensesMonthData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { CheckIcon, LockIcon } from "lucide-react";

import { useDateFormat, useLocale } from "@/components/money-format-provider";
import { m } from "@/paraglide/messages.js";

import { expenseStatusPresentation } from "../lib/labels";

type ExpenseStatusBadgeProps = {
  expense: ExpenseData;
  month: Pick<ExpensesMonthData, "month" | "vat" | "declaredOn">;
  /** Whether to print the line under the pill (the table does, the card does not). */
  withSub?: boolean;
};

/**
 * A filed CA3 locks the deductions it carried: the lock shows on every such
 * row, all the time — a hover-only lock is invisible to a keyboard. A deferred
 * or blocked row is still open, whatever the month's state.
 */
function isExpenseLocked(expense: ExpenseData): boolean {
  return expense.vatStatus === 1;
}

export function ExpenseStatusBadge({
  expense,
  month,
  withSub = true,
}: ExpenseStatusBadgeProps) {
  const locale = useLocale();
  const dateFormat = useDateFormat();
  const status = expenseStatusPresentation(locale, dateFormat, expense, month);
  const isLocked = isExpenseLocked(expense);

  return (
    <div className="min-w-0">
      <Badge className="gap-1.5" shape="pill" variant={status.variant}>
        {status.isDeducted && <CheckIcon aria-hidden />}
        {status.label}
        {status.flag !== null && (
          <span className="rounded-xs border border-info/40 px-1 font-mono text-2xs">
            {status.flag}
          </span>
        )}
        {isLocked && (
          <>
            <LockIcon aria-hidden className="opacity-80" />
            <span className="sr-only">{m.expenses_locked()}</span>
          </>
        )}
      </Badge>
      {withSub && status.sub !== null && (
        <div className="mt-1 truncate text-muted-foreground-3 text-xs">
          {status.sub}
        </div>
      )}
    </div>
  );
}
