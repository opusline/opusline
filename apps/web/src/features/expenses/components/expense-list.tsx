import type { ExpensesMonthData } from "@opusline/api-client";

import type { AmountUnit } from "../lib/amounts";
import { ExpenseCardList } from "./expense-card-list";
import { type ExpenseRowHandlers, ExpenseTable } from "./expense-table";
import { JournalEmptyState } from "./journal-empty-state";

type ExpenseListProps = ExpenseRowHandlers & {
  month: ExpensesMonthData;
  unit: AmountUnit;
};

export function ExpenseList({ month, unit, ...handlers }: ExpenseListProps) {
  return (
    <section className="rounded-md border bg-card">
      {month.expenses.length === 0 ? (
        <JournalEmptyState month={month.month} />
      ) : (
        <>
          <ExpenseTable
            className="hidden lg:table"
            expenses={month.expenses}
            month={month}
            unit={unit}
            {...handlers}
          />
          <ExpenseCardList
            className="lg:hidden"
            expenses={month.expenses}
            month={month}
            unit={unit}
            {...handlers}
          />
        </>
      )}
    </section>
  );
}
