import type { SubscriptionCategoryTotalData } from "@opusline/api-client";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { expenseCategoryLabel } from "../lib/labels";
import { CategoryBars } from "./category-bars";

type AnnualSplitCardProps = {
  categories: SubscriptionCategoryTotalData[];
  yearlyHtCents: number;
};

export function AnnualSplitCard({
  categories,
  yearlyHtCents,
}: AnnualSplitCardProps) {
  const format = useMoneyFormat();

  return (
    <CategoryBars
      caption={m.subscriptions_split_caption({
        amount: formatWholeAmount(format, yearlyHtCents),
      })}
      formatValue={(cents) =>
        m.subscriptions_split_value({
          amount: formatWholeAmount(format, cents),
        })
      }
      rows={[...categories]
        .sort((a, b) => b.yearlyHt.amount - a.yearlyHt.amount)
        .map((row) => ({
          key: String(row.category),
          label: expenseCategoryLabel(row.category),
          cents: row.yearlyHt.amount,
        }))}
      title={m.subscriptions_split_title()}
    />
  );
}
