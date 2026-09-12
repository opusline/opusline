import type { ExpenseCategoryTotalData } from "@opusline/api-client";
import { Eyebrow } from "@opusline/ui/components/eyebrow";
import { Meter } from "@opusline/ui/components/meter";
import { useId } from "react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { periodTitle } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

import type { AmountUnit } from "../lib/amounts";
import { expenseCategoryLabel } from "../lib/labels";

type CategoryBarsProps = {
  categories: ExpenseCategoryTotalData[];
  unit: AmountUnit;
  /** `YYYY-MM`, captioned at the right of the title. */
  month: string;
};

export function CategoryBars({ categories, unit, month }: CategoryBarsProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const id = useId();
  const amountOf = (row: ExpenseCategoryTotalData) =>
    unit === "ht" ? row.ht.amount : row.ttc.amount;
  const largest = Math.max(...categories.map(amountOf), 0);

  return (
    <section className="rounded-md border bg-card px-5 py-4.5">
      <div className="mb-3.5 flex items-baseline justify-between gap-2.5">
        <Eyebrow>
          {m.expenses_categories_title({
            unit: unit === "ht" ? m.common_ht() : m.expenses_col_ttc(),
          })}
        </Eyebrow>
        <span className="text-muted-foreground-3 text-xs">
          {periodTitle(locale, month)}
        </span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {categories.map((row, index) => (
          <li
            className="grid grid-cols-[7rem_minmax(0,1fr)_5.5rem] items-center gap-3 text-sm"
            key={row.category ?? "subscriptions"}
          >
            <span className="truncate text-foreground-3" id={`${id}-${index}`}>
              {row.category === null
                ? m.expenses_category_subscriptions()
                : expenseCategoryLabel(row.category)}
            </span>
            <Meter
              aria-labelledby={`${id}-${index}`}
              getAriaValueText={() =>
                formatAmountWithCents(format, amountOf(row))
              }
              tone={row.category === null ? "quiet" : "brand"}
              value={largest === 0 ? 0 : amountOf(row) / largest}
            />
            <span className="text-right font-mono text-foreground-2 tabular-nums">
              {formatAmountWithCents(format, amountOf(row))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
