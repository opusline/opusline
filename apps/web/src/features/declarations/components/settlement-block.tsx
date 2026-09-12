import type { DeclarationSettlementData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";
import type { ReactNode } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

type SettlementBlockProps = {
  settlement: DeclarationSettlementData;
  expectedLabel: string;
  /** Notes under the three lines: a credit used, a new credit, the first month. */
  children?: ReactNode;
};

export function SettlementBlock({
  settlement,
  expectedLabel,
  children,
}: SettlementBlockProps) {
  const format = useMoneyFormat();
  const money = (cents: number) => formatWholeAmount(format, cents);
  const gap = settlement.gap?.amount ?? null;

  return (
    <div className="rounded-md border bg-muted px-4 py-3.5 text-sm">
      <dl>
        <div className="flex justify-between gap-3 py-1.25">
          <dt className="text-muted-foreground-3">{expectedLabel}</dt>
          <dd className="font-mono text-foreground-2 tabular-nums">
            {money(settlement.expected.amount)}
          </dd>
        </div>
        <div className="flex justify-between gap-3 py-1.25">
          <dt className="text-muted-foreground-3">
            {m.declarations_settlement_provisioned()}
          </dt>
          <dd className="font-mono text-success tabular-nums">
            {settlement.provisioned === null
              ? "—"
              : money(settlement.provisioned.amount)}
          </dd>
        </div>
        <div className="mt-1 flex justify-between gap-3 border-secondary border-t pt-2.25">
          <dt className="text-muted-foreground-3">
            {m.declarations_settlement_gap()}
          </dt>
          <dd
            className={cn(
              "font-mono tabular-nums",
              gap !== null && gap < 0
                ? "text-destructive"
                : "text-foreground-2",
            )}
          >
            {gap === null
              ? "—"
              : `${gap > 0 ? "+" : gap < 0 ? "−" : ""}${money(Math.abs(gap))}`}
          </dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
