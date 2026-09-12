import type { ExpenseData } from "@opusline/api-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@opusline/ui/components/alert-dialog";
import { Button } from "@opusline/ui/components/button";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

type DeleteExpenseDialogProps = {
  /** The expense up for deletion; null keeps the dialog closed. */
  expense: ExpenseData | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (expense: ExpenseData) => void;
};

export function DeleteExpenseDialog({
  expense,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteExpenseDialogProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  return (
    <AlertDialog onOpenChange={onOpenChange} open={expense !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.expenses_delete_title()}</AlertDialogTitle>
          <AlertDialogDescription>
            {expense !== null &&
              m.expenses_delete_body({
                supplier: expense.supplier,
                amount: formatAmountWithCents(format, expense.amountTtc.amount),
                date: calendarDateNumericLabel(dateFormat, expense.spentOn),
              })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {m.common_cancel()}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={() => {
              if (expense !== null) {
                onConfirm(expense);
              }
            }}
            render={<Button size="2xl" variant="destructive" />}
          >
            {m.expenses_delete_confirm()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
