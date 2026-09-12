import type { ExpenseCategory } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import { ChevronDownIcon, XIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";

import { EXPENSE_CATEGORIES, expenseCategoryLabel } from "../lib/labels";

type ExpenseBulkBarProps = {
  count: number;
  canDefer: boolean;
  isBusy: boolean;
  onRecategorize: (category: ExpenseCategory) => void;
  onDefer: () => void;
  onLinkReceipt: () => void;
  onClear: () => void;
};

/** Takes the place of the filter chips while rows are selected. */
export function ExpenseBulkBar({
  count,
  canDefer,
  isBusy,
  onRecategorize,
  onDefer,
  onLinkReceipt,
  onClear,
}: ExpenseBulkBarProps) {
  return (
    <>
      <span aria-hidden className="mr-1.5 text-foreground-hi text-sm">
        {m.expenses_selected_count({ count })}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={isBusy}
          render={<Button size="lg" variant="secondary" />}
        >
          {m.expenses_bulk_category()}
          <ChevronDownIcon aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-48">
          {EXPENSE_CATEGORIES.map((category) => (
            <DropdownMenuItem
              key={category}
              onClick={() => onRecategorize(category)}
            >
              {expenseCategoryLabel(category)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {canDefer && (
        <Button
          disabled={isBusy}
          onClick={onDefer}
          size="lg"
          variant="secondary"
        >
          {m.expenses_bulk_defer()}
        </Button>
      )}
      <Button
        disabled={isBusy}
        onClick={onLinkReceipt}
        size="lg"
        variant="secondary"
      >
        {m.expenses_bulk_link()}
      </Button>
      <Button
        aria-label={m.expenses_bulk_clear_aria()}
        className="ml-auto"
        onClick={onClear}
        size="icon-sm"
        variant="ghost"
      >
        <XIcon aria-hidden />
      </Button>
    </>
  );
}
