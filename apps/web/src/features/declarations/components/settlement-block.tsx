import type { MoneyData, SignedMoneyData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";
import type { ReactNode } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

type SettlementBlockProps = {
  settlement: {
    /** Null for a bill the account cannot know yet. */
    expected: MoneyData | null;
    provisioned: MoneyData | null;
    gap: SignedMoneyData | null;
  };
  expectedLabel: string;
  provisionedLabel?: string;
  title?: string;
  /** A shortfall reads red for a filing, amber for the CFE's slower twelfths. */
  shortfallTone?: "destructive" | "attention";
  /** Notes under the three lines: a credit used, a new credit, the first month. */
  children?: ReactNode;
};

export function SettlementBlock({
  settlement,
  expectedLabel,
  provisionedLabel,
  title,
  shortfallTone = "destructive",
  children,
}: SettlementBlockProps) {
  const format = useMoneyFormat();
  const money = (cents: number) => formatWholeAmount(format, cents);
  const gap = settlement.gap?.amount ?? null;

  return (
    <div className="rounded-md border bg-muted px-4 py-3.5 text-sm">
      {title !== undefined && (
        <div className="mb-1.5 text-foreground-hi">{title}</div>
      )}
      <dl>
        <div className="flex justify-between gap-3 py-1.25">
          <dt className="text-muted-foreground-3">{expectedLabel}</dt>
          <dd className="font-mono text-foreground-2 tabular-nums">
            {settlement.expected === null
              ? "—"
              : money(settlement.expected.amount)}
          </dd>
        </div>
        <div className="flex justify-between gap-3 py-1.25">
          <dt className="text-muted-foreground-3">
            {provisionedLabel ?? m.declarations_settlement_provisioned()}
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
                ? shortfallTone === "destructive"
                  ? "text-destructive"
                  : "text-attention"
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
