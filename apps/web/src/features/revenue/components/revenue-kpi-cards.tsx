import type { RevenueData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatPercentFromBp, formatWholeAmount } from "@/lib/billing";
import { periodKind, periodTitle } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

import {
  basisText,
  type RevenueBasisKey,
  revenueTrendNoneLabel,
  trendDeltaLabel,
} from "../lib/labels";

export function RevenueKpiCards({
  data,
  basis,
}: {
  data: RevenueData;
  basis: RevenueBasisKey;
}) {
  const format = useMoneyFormat();
  const locale = useLocale();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-3.5">
      <section className="rounded-md border bg-card p-5">
        <h2 className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
          {basisText(basis).kpiTitle()}
        </h2>
        <p className="mt-3 whitespace-nowrap font-mono text-4xl text-primary-text leading-none tabular-nums">
          {formatWholeAmount(format, data.total.amount)}
        </p>
        <p className="mt-2.5 flex items-center gap-1.5 text-muted-foreground-3 text-sm">
          <TrendLine data={data} basis={basis} />
        </p>
      </section>

      {data.vat !== null && (
        <section className="rounded-md border border-dashed border-border-2 bg-muted p-5">
          <div className="flex items-center gap-1.5">
            <h2 className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
              {m.revenue_vat_title()}
            </h2>
            <Badge variant="quiet">{m.revenue_vat_chip()}</Badge>
          </div>
          <p className="mt-3 whitespace-nowrap font-mono text-4xl text-muted-foreground-3 leading-none tabular-nums">
            {formatWholeAmount(format, data.vat.amount.amount)}
          </p>
          <p className="mt-2.5 text-muted-foreground-3 text-sm">
            {m.revenue_vat_sub({
              rate: formatPercentFromBp(locale, data.vat.rateBp),
            })}
          </p>
        </section>
      )}

      {data.net !== null && (
        <section className="rounded-md border bg-card p-5">
          <h2 className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
            {m.revenue_net_title()}
          </h2>
          <p className="mt-3 whitespace-nowrap font-mono text-4xl text-foreground-hi leading-none tabular-nums">
            {formatWholeAmount(format, data.net.amount.amount)}
          </p>
          <p className="mt-2.5 text-muted-foreground-3 text-sm">
            {data.total.amount === 0
              ? m.revenue_net_zero()
              : `${formatWholeAmount(format, data.total.amount)} − ${formatWholeAmount(format, data.net.contributions.amount)} (${formatPercentFromBp(locale, data.net.rateBp)} %)`}
          </p>
        </section>
      )}
    </div>
  );
}

function TrendLine({
  data,
  basis,
}: {
  data: RevenueData;
  basis: RevenueBasisKey;
}) {
  const format = useMoneyFormat();
  const locale = useLocale();

  if (data.total.amount === 0) {
    return basisText(basis).kpiZero();
  }

  const changeBp = data.previous.changeBp;

  if (changeBp === null) {
    return revenueTrendNoneLabel(periodKind(data.period));
  }

  const TrendIcon = changeBp < 0 ? ArrowDownRightIcon : ArrowUpRightIcon;

  return (
    <>
      {/* intdiv truncates a hair's decline to zero — a flat period must not
          wear a green rise, so zero gets the figure and no arrow. */}
      {changeBp !== 0 && (
        <TrendIcon
          aria-hidden
          className={
            changeBp < 0
              ? "size-3 flex-none text-destructive-strong"
              : "size-3 flex-none text-success"
          }
        />
      )}
      {m.revenue_trend_vs({
        delta: trendDeltaLabel(locale, changeBp),
        period: periodTitle(locale, data.previous.period),
        amount: formatWholeAmount(format, data.previous.total.amount),
      })}
    </>
  );
}
