import type { ExpenseCategoryTotalData } from "@opusline/api-client";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { periodTitle } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

import type { AmountUnit } from "../lib/amounts";
import { expenseCategoryLabel } from "../lib/labels";
import { CategoryBars } from "./category-bars";

type ExpenseCategoryBarsProps = {
  categories: ExpenseCategoryTotalData[];
  unit: AmountUnit;
  /** `YYYY-MM`, captioned at the right of the title. */
  month: string;
};

/** « Par catégorie »: the month's categories, the subscriptions grouped and quiet. */
export function ExpenseCategoryBars({
  categories,
  unit,
  month,
}: ExpenseCategoryBarsProps) {
  const format = useMoneyFormat();
  const locale = useLocale();

  return (
    <CategoryBars
      caption={periodTitle(locale, month)}
      formatValue={(cents) => formatAmountWithCents(format, cents)}
      rows={categories.map((row) => ({
        key: row.category === null ? "subscriptions" : String(row.category),
        label:
          row.category === null
            ? m.expenses_category_subscriptions()
            : expenseCategoryLabel(row.category),
        cents: unit === "ht" ? row.ht.amount : row.ttc.amount,
        tone: row.category === null ? "quiet" : "brand",
      }))}
      title={m.expenses_categories_title({
        unit: unit === "ht" ? m.common_ht() : m.expenses_col_ttc(),
      })}
    />
  );
}
