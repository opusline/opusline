import type { ExpensesMonthData } from "@opusline/api-client";
import { Chip, ChipCount, ChipGroup } from "@opusline/ui/components/chip";

import { m } from "@/paraglide/messages.js";

import {
  type ExpenseFilter,
  expenseFilterLabel,
  expenseFilters,
  matchesExpenseFilter,
} from "../lib/filters";

type ExpenseFilterChipsProps = {
  month: Pick<ExpensesMonthData, "vat" | "expenses">;
  value: ExpenseFilter;
  onChange: (filter: ExpenseFilter) => void;
};

export function ExpenseFilterChips({
  month,
  value,
  onChange,
}: ExpenseFilterChipsProps) {
  const filters = expenseFilters(month);

  return (
    <ChipGroup
      aria-label={m.expenses_filter_aria()}
      onValueChange={(next) => {
        const filter = filters.find((candidate) => candidate === next[0]);

        if (filter !== undefined) {
          onChange(filter);
        }
      }}
      value={[value]}
    >
      {filters.map((filter) => (
        <Chip key={filter} size="sm" value={filter}>
          {expenseFilterLabel(filter)}
          <ChipCount>
            {
              month.expenses.filter((expense) =>
                matchesExpenseFilter(expense, filter, month),
              ).length
            }
          </ChipCount>
        </Chip>
      ))}
    </ChipGroup>
  );
}
