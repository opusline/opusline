import type { ExpenseData } from "@opusline/api-client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@opusline/ui/components/sheet";

import { useMoneyFormat } from "@/components/money-format-provider";
import type { FieldErrorMap } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

import { type ExpenseDraft, expenseToDraft } from "../lib/expense-draft";
import { ExpenseForm } from "./expense-form";

export type ExpenseSheetState =
  | { mode: "create"; initial: ExpenseDraft }
  | { mode: "edit"; expense: ExpenseData };

type ExpenseSheetProps = {
  /** Null keeps the sheet closed; the form mounts fresh on every open. */
  state: ExpenseSheetState | null;
  isVatLiable: boolean;
  today: string;
  isSaving: boolean;
  error: string | null;
  fieldErrors: FieldErrorMap | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: ExpenseDraft) => void;
};

export function ExpenseSheet({
  state,
  isVatLiable,
  today,
  isSaving,
  error,
  fieldErrors,
  onOpenChange,
  onSubmit,
}: ExpenseSheetProps) {
  const format = useMoneyFormat();

  return (
    <Sheet onOpenChange={onOpenChange} open={state !== null}>
      <SheetContent side="right" size="md">
        {state !== null && (
          <>
            <SheetHeader className="pb-4">
              <SheetTitle size="lg">
                {state.mode === "create"
                  ? m.expenses_add()
                  : m.expenses_sheet_edit_title()}
              </SheetTitle>
              <SheetDescription className="sr-only">
                {state.mode === "create"
                  ? m.expenses_quick_hint()
                  : m.expenses_sheet_edit_hint()}
              </SheetDescription>
            </SheetHeader>
            <ExpenseForm
              error={error}
              fieldErrors={fieldErrors}
              initial={
                state.mode === "create"
                  ? state.initial
                  : expenseToDraft(format, state.expense)
              }
              isSaving={isSaving}
              isVatLiable={isVatLiable}
              mode={state.mode}
              onCancel={() => onOpenChange(false)}
              onSubmit={onSubmit}
              storedReceiptName={
                state.mode === "edit"
                  ? (state.expense.receipt?.fileName ?? null)
                  : null
              }
              today={today}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
