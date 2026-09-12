import type { ExpensesMonthData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";

import type { AmountUnit } from "../lib/amounts";
import { ExpenseKpiTiles } from "./expense-kpi-tiles";
import { ExpenseList } from "./expense-list";
import type { ExpenseRowHandlers } from "./expense-table";

type JournalTabProps = ExpenseRowHandlers & {
  month: ExpensesMonthData;
  unit: AmountUnit;
  isRefreshing: boolean;
};

export function JournalTab({
  month,
  unit,
  isRefreshing,
  ...handlers
}: JournalTabProps) {
  return (
    <div
      aria-busy={isRefreshing || undefined}
      className={cn(
        "flex flex-col gap-4 transition-opacity",
        isRefreshing && "opacity-60",
      )}
    >
      <ExpenseKpiTiles month={month} unit={unit} />
      <ExpenseList month={month} unit={unit} {...handlers} />
    </div>
  );
}
