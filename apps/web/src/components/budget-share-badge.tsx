import type { FixedPriceBudgetData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";

import { useMoneyFormat } from "@/components/money-format-provider";
import {
  budgetShareLabel,
  budgetShareTitle,
  budgetTone,
} from "@/lib/fixed-price-budget";

type BudgetShareBadgeProps = {
  budget: FixedPriceBudgetData;
};

export function BudgetShareBadge({ budget }: BudgetShareBadgeProps) {
  const format = useMoneyFormat();
  const { consumption } = budget;

  if (consumption === null) {
    return null;
  }

  return (
    <Badge
      title={budgetShareTitle(format.locale, budget) ?? undefined}
      variant={budgetTone(consumption.state)}
    >
      {budgetShareLabel(format.locale, consumption.consumedShareBp)}
    </Badge>
  );
}
