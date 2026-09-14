import type { ExpenseMonthPointData } from "@opusline/api-client";
import { Eyebrow } from "@opusline/ui/components/eyebrow";
import { Sparkline } from "@opusline/ui/components/sparkline";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { cachedDateFormatter, fromCalendarDate } from "@/lib/dates";
import { monthStart } from "@/lib/months";
import { m } from "@/paraglide/messages.js";

import type { AmountUnit } from "../lib/amounts";

type ExpenseTrendCardProps = {
  series: ExpenseMonthPointData[];
  unit: AmountUnit;
};

export function ExpenseTrendCard({ series, unit }: ExpenseTrendCardProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const unitLabel = unit === "ht" ? m.common_ht() : m.expenses_col_ttc();
  const shortMonth = (month: string) =>
    cachedDateFormatter(locale, { month: "short", year: "2-digit" }).format(
      fromCalendarDate(monthStart(month)),
    );
  const points = series.map((point) => ({
    label: shortMonth(point.month),
    value: unit === "ht" ? point.ht.amount : point.ttc.amount,
  }));
  const average =
    points.length === 0
      ? 0
      : points.reduce((sum, point) => sum + point.value, 0) / points.length;
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <section className="flex flex-col rounded-md border bg-card px-5 py-4.5">
      <div className="mb-1.5 flex items-baseline justify-between gap-2.5">
        <Eyebrow>{m.expenses_trend_title({ unit: unitLabel })}</Eyebrow>
        <span className="text-muted-foreground-3 text-xs">
          {m.expenses_trend_average({
            amount: formatWholeAmount(format, Math.round(average)),
          })}
        </span>
      </div>
      <Sparkline
        aria-label={m.expenses_trend_aria({ unit: unitLabel })}
        className="flex-1"
        format={(value) => formatWholeAmount(format, value)}
        points={points}
      />
      <div className="mt-1 flex justify-between font-mono text-2xs text-muted-foreground-4">
        <span>{first?.label}</span>
        <span>{last?.label}</span>
      </div>
    </section>
  );
}
