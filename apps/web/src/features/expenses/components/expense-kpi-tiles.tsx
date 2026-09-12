import type { ExpensesMonthData } from "@opusline/api-client";
import {
  StatTile,
  StatTileNote,
  StatTileRow,
} from "@opusline/ui/components/stat-tile";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatAmountWithCents, formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import type { AmountUnit } from "../lib/amounts";
import { monthName } from "../lib/labels";

type ExpenseKpiTilesProps = {
  month: ExpensesMonthData;
  unit: AmountUnit;
};

/**
 * The earliest CA3 the month's deferred deductions land on. A deferral out of
 * an open month goes to box 20 of that CA3; only one out of a filed month is a
 * regularisation on box 21, and the line says so when every deferral is one.
 */
function deferredClaim(
  month: ExpensesMonthData,
): { period: string; isRegularisation: boolean } | null {
  const rows = month.expenses.filter((expense) => expense.vatStatus === 2);

  if (rows.length === 0) {
    return null;
  }

  return {
    period: rows
      .map((expense) => expense.vatClaimPeriod)
      .reduce((earliest, period) => (period < earliest ? period : earliest)),
    isRegularisation: rows.every((expense) => expense.isRegularisation),
  };
}

export function ExpenseKpiTiles({ month, unit }: ExpenseKpiTilesProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const isHt = unit === "ht";
  const [unitLabel, otherLabel] = isHt
    ? [m.common_ht(), m.expenses_col_ttc()]
    : [m.expenses_col_ttc(), m.common_ht()];
  const [chosen, other] = isHt
    ? [month.totals.ht, month.totals.ttc]
    : [month.totals.ttc, month.totals.ht];
  const subscriptions = month.subscriptions;
  const monthly = isHt ? subscriptions?.monthlyHt : subscriptions?.monthlyTtc;
  const yearly = isHt ? subscriptions?.yearlyHt : subscriptions?.yearlyTtc;
  const money = (cents: number) => formatAmountWithCents(format, cents);
  const deferred = deferredClaim(month);

  return (
    <StatTileRow
      className="grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]"
      variant="cards"
    >
      {month.vat === null ? (
        <StatTile
          label={m.expenses_kpi_charges()}
          padding="roomy"
          size="xl"
          tone="brand"
          value={money(month.totals.ttc.amount)}
        />
      ) : (
        <StatTile
          label={
            month.declaredOn === null
              ? m.expenses_kpi_vat_deductible()
              : m.expenses_kpi_vat_deducted()
          }
          padding="roomy"
          size="xl"
          tone="brand"
          value={money(month.vat.deductible.amount)}
        >
          {month.vat.blocked.amount > 0 && (
            <StatTileNote tone="attention">
              {m.expenses_kpi_blocked_line({
                amount: money(month.vat.blocked.amount),
                count: month.vat.blockedCount,
              })}
            </StatTileNote>
          )}
          {month.vat.reverseCharged.amount > 0 && (
            <StatTileNote tone="info">
              {m.expenses_kpi_reverse_line({
                amount: money(month.vat.reverseCharged.amount),
              })}
            </StatTileNote>
          )}
          {deferred !== null && (
            <StatTileNote tone="quiet">
              {(deferred.isRegularisation
                ? m.expenses_kpi_regularised_line
                : m.expenses_kpi_deferred_line)({
                amount: money(month.vat.deferred.amount),
                month: monthName(locale, deferred.period),
              })}
            </StatTileNote>
          )}
          {month.vat.balance.amount < 0 ? (
            <StatTileNote tone="success">
              {m.expenses_kpi_credit_line({
                credit: money(-month.vat.balance.amount),
                collected: money(month.vat.collected.amount),
              })}
            </StatTileNote>
          ) : (
            month.vat.collected.amount > 0 && (
              <StatTileNote tone="quiet">
                {m.expenses_kpi_balance_line({
                  collected: money(month.vat.collected.amount),
                  balance: money(month.vat.balance.amount),
                })}
              </StatTileNote>
            )
          )}
        </StatTile>
      )}
      <StatTile
        label={m.expenses_kpi_total({ unit: unitLabel })}
        padding="roomy"
        size="xl"
        sub={
          month.vat === null
            ? m.expenses_count({ count: month.totals.count })
            : m.expenses_kpi_total_sub({
                count: month.totals.count,
                other: `${money(other.amount)} ${otherLabel}`,
              })
        }
        tone="strong"
        value={money(chosen.amount)}
      />
      <StatTile
        label={m.expenses_kpi_subscriptions()}
        padding="roomy"
        size="xl"
        sub={
          subscriptions === null || yearly === undefined
            ? m.expenses_kpi_subscriptions_none()
            : `${m.expenses_kpi_subscriptions_sub({
                count: subscriptions.count,
                yearly: formatWholeAmount(format, yearly.amount),
              })} · ${m.expenses_kpi_subscriptions_annual({
                count: subscriptions.annualCount,
              })}`
        }
        tone={subscriptions === null ? "quiet" : "strong"}
        value={
          monthly === undefined ? (
            "—"
          ) : (
            <>
              {formatWholeAmount(format, monthly.amount)}
              <span className="font-sans text-base text-muted-foreground-3">
                {" "}
                {m.expenses_per_month()}
              </span>
            </>
          )
        }
      />
    </StatTileRow>
  );
}
