import type {
  DeclarationCompletionData,
  UrssafDeclarationData,
} from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { CopyButton } from "@opusline/ui/components/copy-button";
import { Eyebrow } from "@opusline/ui/components/eyebrow";
import { Link } from "@tanstack/react-router";
import { useId } from "react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import {
  formatPercentFromBp,
  formatWholeAmount,
  formatWholeFigure,
} from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import {
  contributionKindLabel,
  declarationCopyValue,
  declarationPeriodLabel,
  urssafBadgeLabel,
} from "../lib/labels";
import { DeclarationActions } from "./declaration-actions";
import { DeclarationDeadlineLine } from "./declaration-deadline-line";
import { SettlementBlock } from "./settlement-block";

type UrssafDeclarationCardProps = {
  urssaf: UrssafDeclarationData;
  isBusy: boolean;
  onMarkFiled: () => void;
  onMarkPaid: () => void;
  onUndo: (completion: DeclarationCompletionData) => void;
};

export function UrssafDeclarationCard({
  urssaf,
  isBusy,
  onMarkFiled,
  onMarkPaid,
  onUndo,
}: UrssafDeclarationCardProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col rounded-md border bg-card p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <h2
          className="font-heading font-semibold text-foreground-hi text-xl"
          id={titleId}
        >
          {m.declarations_urssaf_title({
            period: declarationPeriodLabel(locale, urssaf.period),
          })}
        </h2>
        <Badge variant="quiet">{urssafBadgeLabel(urssaf.periodicity)}</Badge>
      </div>
      <div className="mt-1.5">
        {!urssaf.coversShownMonth && (
          <p className="text-muted-foreground-3 text-sm leading-relaxed">
            {m.declarations_urssaf_running_quarter()}
          </p>
        )}
        <DeclarationDeadlineLine
          completion={urssaf.completion}
          deadline={urssaf.deadline}
        />
      </div>

      <div className="mt-4 rounded-md border border-primary/40 bg-background p-5">
        <Eyebrow>{m.declarations_urssaf_kicker()}</Eyebrow>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3.5">
          <Link
            className="rounded-sm text-left focus-visible:outline-2 focus-visible:outline-primary-text"
            to="/invoices"
          >
            <span className="whitespace-nowrap border-primary/50 border-b border-dashed font-mono text-4xl text-primary-text leading-none tabular-nums">
              {formatWholeFigure(format, urssaf.base.amount)}
            </span>
            <span className="mt-2 block text-muted-foreground-3 text-xs">
              {m.declarations_invoices_collected({
                count: urssaf.invoiceCount,
              })}{" "}
              →
            </span>
          </Link>
          <CopyButton
            copiedLabel={m.common_copied()}
            failedLabel={m.common_copy_failed()}
            label={m.common_copy()}
            value={declarationCopyValue(urssaf.base.amount)}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-baseline justify-between gap-2.5">
          <Eyebrow>{m.declarations_contributions()}</Eyebrow>
          <span className="text-muted-foreground-3 text-xs">
            {m.declarations_contributions_scale()}
          </span>
        </div>
        <dl>
          {urssaf.lines.map((line) => (
            <div
              className="flex items-center justify-between gap-3 border-secondary border-b py-2.5"
              key={line.kind}
            >
              <dt className="text-foreground-2 text-sm">
                {contributionKindLabel(line.kind)}
                <span className="ml-2 font-mono text-muted-foreground-3 text-xs">
                  {m.common_percent({
                    value: formatPercentFromBp(locale, line.rateBp),
                  })}
                </span>
              </dt>
              <dd className="font-mono text-base text-foreground-2 tabular-nums">
                {formatWholeAmount(format, line.amount.amount)}
              </dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 pt-3">
            <dt className="text-foreground-hi text-sm">
              {m.declarations_total_due()}
            </dt>
            <dd className="font-mono text-primary-text text-xl tabular-nums">
              {formatWholeAmount(format, urssaf.total.amount)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 mb-4.5">
        <SettlementBlock
          expectedLabel={m.declarations_settlement_expected()}
          settlement={urssaf.settlement}
        />
      </div>

      <DeclarationActions
        completion={urssaf.completion}
        hasDeadline={urssaf.deadline !== null}
        href="https://autoentrepreneur.urssaf.fr"
        isBusy={isBusy}
        linkLabel={m.declarations_urssaf_link()}
        onMarkFiled={onMarkFiled}
        onMarkPaid={onMarkPaid}
        onUndo={onUndo}
      />
    </section>
  );
}
