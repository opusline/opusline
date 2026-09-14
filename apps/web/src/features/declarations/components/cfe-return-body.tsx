import type { CfeReturnData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Eyebrow } from "@opusline/ui/components/eyebrow";
import { InfoIcon } from "lucide-react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeFigure } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { SettlementBlock } from "./settlement-block";

type CfeReturnBodyProps = {
  cfe: CfeReturnData;
  /** Only the running year's bill can be guessed or entered from the avis. */
  isRunningYear: boolean;
  onEnterAmount: () => void;
};

export function CfeReturnBody({
  cfe,
  isRunningYear,
  onEnterAmount,
}: CfeReturnBodyProps) {
  const format = useMoneyFormat();
  const isKnown = cfe.expected !== null;

  return (
    <>
      <div className="rounded-md border border-primary/40 bg-background p-5">
        <Eyebrow>
          {isKnown && !cfe.isEstimate
            ? m.declarations_cfe_amount_label()
            : m.declarations_cfe_estimated_amount()}
        </Eyebrow>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3.5">
          <span className="whitespace-nowrap font-mono text-4xl text-primary-text leading-none tabular-nums">
            {cfe.expected === null
              ? "—"
              : formatWholeFigure(format, cfe.expected.amount)}
          </span>
          {isRunningYear && (
            <Button onClick={onEnterAmount} size="xl" variant="secondary">
              {m.declarations_cfe_enter_amount()}
            </Button>
          )}
        </div>
        <p className="mt-3 text-muted-foreground-3 text-sm leading-relaxed">
          {!isRunningYear
            ? m.declarations_cfe_past_year_note()
            : cfe.expected === null
              ? m.declarations_cfe_unknown_note()
              : cfe.isEstimate
                ? m.declarations_cfe_estimate_note()
                : m.declarations_cfe_notice_note()}
        </p>
      </div>

      <SettlementBlock
        expectedLabel={m.declarations_settlement_expected()}
        provisionedLabel={m.declarations_cfe_provisioned({
          count: cfe.monthsProvisioned,
        })}
        settlement={cfe}
        shortfallTone="attention"
        title={m.declarations_cfe_provision()}
      />

      <p className="flex items-start gap-2.5 px-0.5 text-muted-foreground-3 text-sm leading-relaxed">
        <InfoIcon
          aria-hidden
          className="mt-0.75 size-3.5 shrink-0 text-primary-text"
        />
        {m.declarations_cfe_books_expense()}
      </p>
    </>
  );
}
