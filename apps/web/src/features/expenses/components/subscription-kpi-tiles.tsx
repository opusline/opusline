import type { SubscriptionKpisData } from "@opusline/api-client";
import {
  StatTile,
  StatTileRow,
  StatTileUnit,
} from "@opusline/ui/components/stat-tile";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

export function SubscriptionKpiTiles({ kpis }: { kpis: SubscriptionKpisData }) {
  const format = useMoneyFormat();
  const money = (cents: number) => formatWholeAmount(format, cents);
  const annualSub = [
    m.subscriptions_kpi_annual_count({ count: kpis.annualCount }),
    kpis.provisionedCount > 0
      ? m.subscriptions_kpi_provisioned({
          count: kpis.provisionedCount,
          amount: money(kpis.provisionedPerMonth.amount),
        })
      : m.subscriptions_kpi_none_provisioned(),
  ].join(" · ");

  return (
    <StatTileRow
      className="grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]"
      variant="cards"
    >
      <StatTile
        label={m.subscriptions_kpi_monthly()}
        padding="roomy"
        size="xl"
        sub={m.subscriptions_kpi_monthly_sub({ count: kpis.monthlyCount })}
        tone="strong"
        value={
          <>
            {money(kpis.monthlyTtc.amount)}
            <StatTileUnit> {m.expenses_per_month()}</StatTileUnit>
          </>
        }
      />
      <StatTile
        label={m.subscriptions_kpi_annual()}
        padding="roomy"
        size="xl"
        sub={annualSub}
        tone="strong"
        value={
          <>
            {money(kpis.yearlyTtc.amount)}
            <StatTileUnit> {m.subscriptions_per_year()}</StatTileUnit>
          </>
        }
      />
      <StatTile
        label={m.subscriptions_kpi_vat()}
        padding="roomy"
        size="xl"
        sub={m.subscriptions_kpi_vat_sub({
          amount: money(kpis.reverseChargedVatPerYear.amount),
        })}
        tone="brand"
        value={
          <>
            {money(kpis.recoverableVatPerYear.amount)}
            <StatTileUnit> {m.subscriptions_per_year()}</StatTileUnit>
          </>
        }
      />
      <StatTile
        label={m.subscriptions_kpi_missing()}
        padding="roomy"
        size="xl"
        sub={m.subscriptions_kpi_missing_sub()}
        tone={kpis.missingReceipts > 0 ? "attention" : "strong"}
        value={String(kpis.missingReceipts)}
      />
    </StatTileRow>
  );
}
