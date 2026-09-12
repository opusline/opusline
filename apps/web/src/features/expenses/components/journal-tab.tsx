import type {
  ExpenseCategory,
  ExpensesMonthData,
  ExpenseTodoData,
} from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";
import { useRef, useState } from "react";

import { m } from "@/paraglide/messages.js";

import type { AmountUnit } from "../lib/amounts";
import {
  type ExpenseFilter,
  hasMovableVat,
  matchesExpenseFilter,
} from "../lib/filters";
import { CategoryBars } from "./category-bars";
import { DeclaredBanner } from "./declared-banner";
import { ExpenseBulkBar } from "./expense-bulk-bar";
import { ExpenseCardList } from "./expense-card-list";
import { ExpenseFilterChips } from "./expense-filter-chips";
import { ExpenseKpiTiles } from "./expense-kpi-tiles";
import { type ExpenseRowHandlers, ExpenseTable } from "./expense-table";
import { ExpenseTodoRail } from "./expense-todo-rail";
import { ExpenseTrendCard } from "./expense-trend-card";
import { JournalEmptyState } from "./journal-empty-state";
import { RegimeCard } from "./regime-card";

type JournalTabProps = ExpenseRowHandlers & {
  month: ExpensesMonthData;
  unit: AmountUnit;
  isRefreshing: boolean;
  onRecategorize: (expenseIds: number[], category: ExpenseCategory) => void;
  onDeferSelectedVat: (expenseIds: number[]) => void;
  onLinkReceiptHint: () => void;
  onUndoDeclared: () => void;
  onCreateFromDebit: (todo: ExpenseTodoData) => void;
  isBulkBusy: boolean;
  isUndoBusy: boolean;
};

export function JournalTab({
  month,
  unit,
  isRefreshing,
  onRecategorize,
  onDeferSelectedVat,
  onLinkReceiptHint,
  onUndoDeclared,
  onCreateFromDebit,
  isBulkBusy,
  isUndoBusy,
  ...handlers
}: JournalTabProps) {
  const [filter, setFilter] = useState<ExpenseFilter>("all");
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const visibleExpenses = month.expenses.filter((expense) =>
    matchesExpenseFilter(expense, filter, month),
  );
  // A row that left the month (deleted, moved) leaves the selection with it.
  const selectedExpenses = month.expenses.filter((expense) =>
    selectedIds.has(expense.id),
  );
  const toolbarRef = useRef<HTMLDivElement>(null);
  const clearSelection = () => {
    setSelectedIds(new Set());
    toolbarRef.current?.querySelector("button")?.focus();
  };
  const toggleSelected = (expenseId: number) =>
    setSelectedIds((current) => {
      const next = new Set(current);

      if (!next.delete(expenseId)) {
        next.add(expenseId);
      }

      return next;
    });

  return (
    <div
      aria-busy={isRefreshing || undefined}
      className={cn(
        "flex flex-col gap-4 transition-opacity",
        isRefreshing && "opacity-60",
      )}
    >
      <ExpenseKpiTiles month={month} unit={unit} />

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-0 flex-1 basis-140 flex-col gap-2.5">
          {month.vat !== null && month.declaredOn !== null && (
            <DeclaredBanner
              declaredOn={month.declaredOn}
              deductedCents={month.vat.deductible.amount}
              isBusy={isUndoBusy}
              month={month.month}
              onUndo={onUndoDeclared}
            />
          )}
          <section className="rounded-md border bg-card">
            <div
              className="flex min-h-12 flex-wrap items-center gap-2 border-b px-3 py-2"
              ref={toolbarRef}
            >
              <span className="sr-only" role="status">
                {selectedExpenses.length > 0 &&
                  m.expenses_selected_count({ count: selectedExpenses.length })}
              </span>
              {selectedExpenses.length > 0 ? (
                <ExpenseBulkBar
                  canDefer={selectedExpenses.some((expense) =>
                    hasMovableVat(expense, month),
                  )}
                  count={selectedExpenses.length}
                  isBusy={isBulkBusy}
                  onClear={clearSelection}
                  onDefer={() => {
                    onDeferSelectedVat(
                      selectedExpenses
                        .filter((expense) => hasMovableVat(expense, month))
                        .map((expense) => expense.id),
                    );
                    clearSelection();
                  }}
                  onLinkReceipt={onLinkReceiptHint}
                  onRecategorize={(category) => {
                    onRecategorize(
                      selectedExpenses.map((expense) => expense.id),
                      category,
                    );
                    clearSelection();
                  }}
                />
              ) : (
                <ExpenseFilterChips
                  month={month}
                  onChange={setFilter}
                  value={filter}
                />
              )}
            </div>
            {visibleExpenses.length === 0 ? (
              <JournalEmptyState
                isFiltered={month.expenses.length > 0}
                month={month.month}
              />
            ) : (
              <>
                <ExpenseTable
                  className="hidden lg:table"
                  expenses={visibleExpenses}
                  month={month}
                  onToggleSelected={toggleSelected}
                  selectedIds={selectedIds}
                  unit={unit}
                  {...handlers}
                />
                <ExpenseCardList
                  className="lg:hidden"
                  expenses={visibleExpenses}
                  month={month}
                  unit={unit}
                  {...handlers}
                />
              </>
            )}
          </section>
        </div>
        {month.todo.length > 0 && (
          <div className="w-full lg:w-66 lg:shrink-0">
            <ExpenseTodoRail
              month={month}
              onAttachReceipt={handlers.onAttachReceipt}
              onCreateFromDebit={onCreateFromDebit}
              uploadingExpenseId={handlers.uploadingExpenseId}
            />
          </div>
        )}
      </div>

      {month.categories.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4">
          <CategoryBars
            categories={month.categories}
            month={month.month}
            unit={unit}
          />
          <ExpenseTrendCard series={month.series} unit={unit} />
        </div>
      )}

      {month.projection !== null && (
        <RegimeCard projection={month.projection} />
      )}
    </div>
  );
}
