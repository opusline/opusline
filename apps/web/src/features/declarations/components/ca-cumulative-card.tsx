import type { RevenueCeilingData } from "@opusline/api-client";
import { Eyebrow } from "@opusline/ui/components/eyebrow";
import { Meter } from "@opusline/ui/components/meter";
import { useId } from "react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatPercentFromBp, formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

export function CaCumulativeCard({
  cumulative,
}: {
  cumulative: RevenueCeilingData;
}) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const id = useId();
  const margin = cumulative.margin.amount;

  return (
    <section className="rounded-md border bg-card px-6 py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2.5">
        <Eyebrow id={id}>
          {m.declarations_ceiling_title({ year: cumulative.year })}
        </Eyebrow>
        <span className="font-mono text-base text-foreground-hi tabular-nums">
          {formatWholeAmount(format, cumulative.collectedHt.amount)}{" "}
          <span className="text-muted-foreground-3 text-sm">
            {m.declarations_ceiling_of({
              ceiling: formatWholeAmount(format, cumulative.ceiling.amount),
            })}
          </span>
        </span>
      </div>
      <Meter
        aria-labelledby={id}
        className="mt-3"
        tone="brand"
        value={Math.min(cumulative.shareBp, 10_000)}
        max={10_000}
      />
      <div className="mt-2 flex justify-between gap-3 text-muted-foreground-3 text-xs">
        <span>
          {m.declarations_ceiling_share({
            share: m.common_percent({
              value: formatPercentFromBp(locale, cumulative.shareBp, 0, 0),
            }),
          })}
        </span>
        <span>
          {margin >= 0
            ? m.declarations_ceiling_margin({
                margin: formatWholeAmount(format, margin),
              })
            : m.declarations_ceiling_over({
                amount: formatWholeAmount(format, -margin),
              })}
        </span>
      </div>
    </section>
  );
}
