import type { ExpenseData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@opusline/ui/components/tooltip";
import { RefreshCwIcon, TriangleAlertIcon } from "lucide-react";

import { useLocale } from "@/components/money-format-provider";
import { m } from "@/paraglide/messages.js";

import {
  expenseCategoryLabel,
  expenseCategoryWarning,
  monthName,
} from "../lib/labels";

export function ExpenseSupplierCell({ expense }: { expense: ExpenseData }) {
  const locale = useLocale();
  const warning = expenseCategoryWarning(expense.category);

  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-1.75">
        <span className="truncate text-foreground-hi text-sm">
          {expense.supplier}
        </span>
        {expense.subscription !== null && (
          <RefreshCwIcon
            aria-label={m.expenses_subscription_aria()}
            className="size-3 shrink-0 text-muted-foreground-4"
            role="img"
          />
        )}
      </div>
      <div className="mt-1 flex min-w-0 items-center gap-1.5">
        <Badge className="shrink-0" variant="quiet">
          {expenseCategoryLabel(expense.category)}
        </Badge>
        {warning !== null && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  aria-label={warning}
                  className="flex shrink-0 rounded-sm text-attention focus-visible:outline-2 focus-visible:outline-primary-text"
                  type="button"
                />
              }
            >
              <TriangleAlertIcon aria-hidden className="size-3.25" />
            </TooltipTrigger>
            <TooltipContent>{warning}</TooltipContent>
          </Tooltip>
        )}
        {expense.proShareBp < 10_000 && (
          <Badge className="shrink-0 font-mono" variant="brand">
            {m.expenses_pro_share({ share: expense.proShareBp / 100 })}
          </Badge>
        )}
        {expense.description !== null && (
          <span className="truncate text-muted-foreground-3 text-xs">
            {expense.description}
          </span>
        )}
      </div>
      {expense.isRegularisation && (
        <div className="mt-1 text-primary-text text-xs">
          {m.expenses_regularisation_note({
            month: monthName(locale, expense.vatClaimPeriod),
          })}
        </div>
      )}
    </div>
  );
}
