import type { ExpenseCategory } from "@opusline/api-client";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { cn } from "@opusline/ui/lib/utils";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { expenseCategoryWarning } from "../lib/labels";
import type { ExpenseAmounts, VatTerms } from "../lib/vat";

type ExpenseCalcBoxProps = {
  /** Null until the amount is readable. */
  amounts: ExpenseAmounts | null;
  vatTerms: VatTerms;
  category: ExpenseCategory;
  isVatLiable: boolean;
};

export function ExpenseCalcBox({
  amounts,
  vatTerms,
  category,
  isVatLiable,
}: ExpenseCalcBoxProps) {
  const format = useMoneyFormat();
  const warning = expenseCategoryWarning(category);
  const isReverseCharged =
    isVatLiable && (vatTerms.vatTreatment === 1 || vatTerms.vatTreatment === 2);
  const isExempt = !isVatLiable || vatTerms.vatTreatment === 3;
  const money = (cents: number | undefined) =>
    cents === undefined ? "—" : formatAmountWithCents(format, cents);

  return (
    <div>
      <dl
        className={cn(
          "grid gap-2.5 rounded-md border bg-muted px-3.5 py-3",
          isVatLiable ? "grid-cols-3" : "grid-cols-1",
        )}
      >
        {isVatLiable && (
          <div>
            <dt className={eyebrowVariants({ tone: "quiet" })}>
              {m.expenses_calc_vat()}
            </dt>
            <dd className="mt-1 font-mono text-base text-foreground-2 tabular-nums">
              {isExempt ? "—" : money(amounts?.vatCents)}
            </dd>
            {isReverseCharged && amounts !== null && (
              <dd className="mt-0.5 text-info text-xs">
                {m.expenses_calc_net_zero()}
              </dd>
            )}
          </div>
        )}
        <div>
          <dt className={eyebrowVariants({ tone: "quiet" })}>
            {m.expenses_calc_ttc()}
          </dt>
          <dd className="mt-1 font-mono text-base text-foreground-2 tabular-nums">
            {money(amounts?.ttcCents)}
          </dd>
        </div>
        {isVatLiable && (
          <div>
            <dt className={eyebrowVariants({ tone: "quiet" })}>
              {m.expenses_calc_recoverable()}
            </dt>
            <dd className="mt-1 font-mono text-base text-primary-text tabular-nums">
              {amounts === null || isExempt
                ? "—"
                : isReverseCharged
                  ? m.expenses_calc_net_zero_value()
                  : money(amounts.recoverableCents)}
            </dd>
          </div>
        )}
      </dl>
      {warning !== null && (
        <p className="mt-2 text-muted-foreground-3 text-xs">{warning}</p>
      )}
    </div>
  );
}
