import type { ExpenseCategory } from "@opusline/api-client";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { cn } from "@opusline/ui/lib/utils";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatAmountWithCents, formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { expenseCategoryWarning } from "../lib/labels";
import type { ExpenseAmounts, VatTerms } from "../lib/vat";

type CalcBoxProps = {
  /** Null until the amount is readable. */
  amounts: ExpenseAmounts | null;
  vatTerms: VatTerms;
  isVatLiable: boolean;
  /** The third cell: what the row recovers, or what a year of it costs. */
  trailing: { label: string; value: string } | null;
};

function CalcCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className={eyebrowVariants({ tone: "quiet" })}>{label}</dt>
      {children}
    </div>
  );
}

const VALUE_CLASSES = "mt-1 font-mono text-base tabular-nums";

/** TVA · TTC · one more figure, as the row will land. */
export function CalcBox({
  amounts,
  vatTerms,
  isVatLiable,
  trailing,
}: CalcBoxProps) {
  const format = useMoneyFormat();
  const isReverseCharged =
    isVatLiable && (vatTerms.vatTreatment === 1 || vatTerms.vatTreatment === 2);
  const isExempt = !isVatLiable || vatTerms.vatTreatment === 3;
  const money = (cents: number | undefined) =>
    cents === undefined ? "—" : formatAmountWithCents(format, cents);
  const cells = 1 + (isVatLiable ? 1 : 0) + (trailing === null ? 0 : 1);

  return (
    <dl
      className={cn(
        "grid gap-2.5 rounded-md border bg-muted px-3.5 py-3",
        cells === 3
          ? "grid-cols-3"
          : cells === 2
            ? "grid-cols-2"
            : "grid-cols-1",
      )}
    >
      {isVatLiable && (
        <CalcCell label={m.expenses_calc_vat()}>
          <dd className={cn(VALUE_CLASSES, "text-foreground-2")}>
            {isExempt ? "—" : money(amounts?.vatCents)}
          </dd>
          {isReverseCharged && amounts !== null && (
            <dd className="mt-0.5 text-info text-xs">
              {m.expenses_calc_net_zero()}
            </dd>
          )}
        </CalcCell>
      )}
      <CalcCell label={m.expenses_calc_ttc()}>
        <dd className={cn(VALUE_CLASSES, "text-foreground-2")}>
          {money(amounts?.ttcCents)}
        </dd>
      </CalcCell>
      {trailing !== null && (
        <CalcCell label={trailing.label}>
          <dd className={cn(VALUE_CLASSES, "text-primary-text")}>
            {trailing.value}
          </dd>
        </CalcCell>
      )}
    </dl>
  );
}

type ExpenseCalcBoxProps = Omit<CalcBoxProps, "trailing"> & {
  category: ExpenseCategory;
};

/** The expense sheet's box: TVA · TTC · Récupérable, and the category's caveat under it. */
export function ExpenseCalcBox({
  amounts,
  vatTerms,
  isVatLiable,
  category,
}: ExpenseCalcBoxProps) {
  const format = useMoneyFormat();
  const warning = expenseCategoryWarning(category);
  const isReverseCharged =
    vatTerms.vatTreatment === 1 || vatTerms.vatTreatment === 2;
  const recoverable =
    amounts === null || vatTerms.vatTreatment === 3
      ? "—"
      : isReverseCharged
        ? m.expenses_calc_net_zero_value()
        : formatAmountWithCents(format, amounts.recoverableCents);

  return (
    <div>
      <CalcBox
        amounts={amounts}
        isVatLiable={isVatLiable}
        trailing={
          isVatLiable
            ? { label: m.expenses_calc_recoverable(), value: recoverable }
            : null
        }
        vatTerms={vatTerms}
      />
      {warning !== null && (
        <p className="mt-2 text-muted-foreground-3 text-xs">{warning}</p>
      )}
    </div>
  );
}

/** « Par an » for a subscription: the debit times how often it lands. */
export function perYearCell(
  format: ReturnType<typeof useMoneyFormat>,
  amounts: ExpenseAmounts | null,
  occurrencesPerYear: number,
): { label: string; value: string } {
  return {
    label: m.subscriptions_calc_per_year(),
    value:
      amounts === null
        ? "—"
        : formatWholeAmount(format, amounts.ttcCents * occurrencesPerYear),
  };
}
