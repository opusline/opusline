import type { ExpensesMonthData } from "@opusline/api-client";
import { StatTile, StatTileRow } from "@opusline/ui/components/stat-tile";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatAmountWithCents, formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import type { AmountUnit } from "../lib/amounts";

type ExpenseKpiTilesProps = {
  month: ExpensesMonthData;
  unit: AmountUnit;
};

export function ExpenseKpiTiles({ month, unit }: ExpenseKpiTilesProps) {
  const format = useMoneyFormat();
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
          value={formatAmountWithCents(format, month.totals.ttc.amount)}
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
          value={formatAmountWithCents(format, month.vat.deductible.amount)}
        />
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
                other: `${formatAmountWithCents(format, other.amount)} ${otherLabel}`,
              })
        }
        tone="strong"
        value={formatAmountWithCents(format, chosen.amount)}
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
