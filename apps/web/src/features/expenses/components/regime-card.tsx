import type { ExpenseRegimeProjectionData } from "@opusline/api-client";
import { Eyebrow } from "@opusline/ui/components/eyebrow";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

type RegimeCardProps = {
  projection: ExpenseRegimeProjectionData;
};

export function RegimeCard({ projection }: RegimeCardProps) {
  const format = useMoneyFormat();

  return (
    <section className="flex flex-wrap items-center gap-6 rounded-md border bg-card px-5 py-4.5">
      <div className="flex gap-5.5">
        <div>
          <Eyebrow className="mb-2">{m.expenses_regime_real()}</Eyebrow>
          <div className="font-mono text-2xl text-foreground-hi leading-none tabular-nums">
            {formatWholeAmount(format, projection.projectedChargesHt.amount)}
          </div>
        </div>
        <div aria-hidden className="w-px bg-border" />
        <div>
          <Eyebrow className="mb-2">{m.expenses_regime_abatement()}</Eyebrow>
          <div className="font-mono text-2xl text-primary-text leading-none tabular-nums">
            {formatWholeAmount(format, projection.abatement.amount)}
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 basis-80">
        <p className="text-foreground-hi text-sm">
          {projection.microIsFavourable
            ? m.expenses_regime_micro_better()
            : m.expenses_regime_real_better()}
        </p>
        <p className="mt-1 text-muted-foreground-3 text-xs leading-relaxed">
          {m.expenses_regime_body({
            charges: formatWholeAmount(
              format,
              projection.projectedChargesHt.amount,
            ),
            revenue: formatWholeAmount(
              format,
              projection.annualRevenueHt.amount,
            ),
            allowance: formatWholeAmount(format, projection.abatement.amount),
          })}
        </p>
      </div>
    </section>
  );
}
