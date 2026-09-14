import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";

import { useLocale } from "@/components/money-format-provider";
import { m } from "@/paraglide/messages.js";

import { monthName } from "../lib/labels";

type JournalEmptyStateProps = {
  /** `YYYY-MM`. */
  month: string;
  /** The month has rows, the filter keeps none of them. */
  isFiltered?: boolean;
};

export function JournalEmptyState({
  month,
  isFiltered = false,
}: JournalEmptyStateProps) {
  const locale = useLocale();

  return (
    <Empty className="px-5 py-8">
      <EmptyHeader className="gap-1.5">
        <EmptyTitle variant="strong">
          {isFiltered
            ? m.expenses_empty_filter_title()
            : m.expenses_empty_month_title({ month: monthName(locale, month) })}
        </EmptyTitle>
        <EmptyDescription className="text-muted-foreground-3 text-sm">
          {isFiltered
            ? m.expenses_empty_filter_sub()
            : m.expenses_empty_month_sub()}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
