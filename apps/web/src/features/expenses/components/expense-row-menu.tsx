import type { ExpenseData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import { cn } from "@opusline/ui/lib/utils";
import { MoreVerticalIcon } from "lucide-react";
import { useState } from "react";

import { m } from "@/paraglide/messages.js";

export type ExpenseRowMenuHandlers = {
  onEdit: (expense: ExpenseData) => void;
  onDuplicate: (expense: ExpenseData) => void;
  onDeferVat: (expense: ExpenseData) => void;
  onReintegrateVat: (expense: ExpenseData) => void;
  onDetachReceipt: (expense: ExpenseData) => void;
  onDelete: (expense: ExpenseData) => void;
};

type ExpenseRowMenuProps = ExpenseRowMenuHandlers & {
  expense: ExpenseData;
  canMoveVat: boolean;
  className?: string;
};

/**
 * The kebab at the end of a row. Detaching asks once more inside the menu —
 * the label turns into the question — rather than opening a dialog for a
 * reversible act; deleting opens a dialog, because it is not reversible.
 */
export function ExpenseRowMenu({
  expense,
  canMoveVat,
  onEdit,
  onDuplicate,
  onDeferVat,
  onReintegrateVat,
  onDetachReceipt,
  onDelete,
  className,
}: ExpenseRowMenuProps) {
  const [isConfirmingDetach, setIsConfirmingDetach] = useState(false);

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open) {
          setIsConfirmingDetach(false);
        }
      }}
    >
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={m.expenses_row_menu_aria({
              supplier: expense.supplier,
            })}
            className={cn(
              "text-muted-foreground-3 opacity-0 transition-opacity pointer-coarse:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100 group-hover/row:opacity-100",
              className,
            )}
            size="icon-sm"
            variant="ghost"
          />
        }
      >
        <MoreVerticalIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuItem onClick={() => onEdit(expense)}>
          {m.expenses_menu_edit()}
        </DropdownMenuItem>
        {canMoveVat &&
          (expense.vatStatus === 2 ? (
            <DropdownMenuItem onClick={() => onReintegrateVat(expense)}>
              {m.expenses_menu_reintegrate()}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onDeferVat(expense)}>
              {m.expenses_menu_defer()}
            </DropdownMenuItem>
          ))}
        <DropdownMenuItem onClick={() => onDuplicate(expense)}>
          {m.expenses_menu_duplicate()}
        </DropdownMenuItem>
        {expense.receipt !== null && (
          <DropdownMenuItem
            className={cn(isConfirmingDetach && "text-attention")}
            closeOnClick={isConfirmingDetach}
            onClick={() => {
              if (isConfirmingDetach) {
                onDetachReceipt(expense);
                return;
              }

              setIsConfirmingDetach(true);
            }}
          >
            {isConfirmingDetach
              ? m.expenses_menu_detach_confirm()
              : m.expenses_menu_detach()}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive data-highlighted:text-destructive"
          onClick={() => onDelete(expense)}
        >
          {m.expenses_menu_delete()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
