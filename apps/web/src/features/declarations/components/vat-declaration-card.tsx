import type {
  DeclarationCompletionData,
  VatDeclarationData,
} from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { CopyButton } from "@opusline/ui/components/copy-button";
import { Eyebrow } from "@opusline/ui/components/eyebrow";
import { useId } from "react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { shiftPeriod } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

import { ca3CopyLines, ca3Rows, declarationPeriodLabel } from "../lib/labels";
import { Ca3BoxRow } from "./ca3-box-row";
import { DeclarationActions } from "./declaration-actions";
import { DeclarationDeadlineLine } from "./declaration-deadline-line";
import { SettlementBlock } from "./settlement-block";

type VatDeclarationCardProps = {
  vat: VatDeclarationData;
  isBusy: boolean;
  onMarkFiled: () => void;
  onMarkPaid: () => void;
  onUndo: (completion: DeclarationCompletionData) => void;
};

export function VatDeclarationCard({
  vat,
  isBusy,
  onMarkFiled,
  onMarkPaid,
  onUndo,
}: VatDeclarationCardProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const money = (cents: number) => formatWholeAmount(format, cents);
  const rows = ca3Rows(vat, locale, money);
  const copyLines = ca3CopyLines(rows);
  const { boxes } = vat;
  const previous = declarationPeriodLabel(locale, shiftPeriod(vat.period, -1));
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
          {m.declarations_vat_title({
            period: declarationPeriodLabel(locale, vat.period),
          })}
        </h2>
        <Badge variant="quiet">
          {m.declarations_vat_badge_normal_monthly()}
        </Badge>
      </div>
      <div className="mt-1.5">
        <DeclarationDeadlineLine
          completion={vat.completion}
          deadline={vat.deadline}
        />
      </div>

      <div className="mt-4 mb-1 flex items-center justify-between gap-2.5">
        <Eyebrow>{m.declarations_boxes_title()}</Eyebrow>
        <CopyButton
          copiedLabel={m.declarations_copied_boxes({
            count: copyLines.length,
          })}
          failedLabel={m.common_copy_failed()}
          label={m.declarations_copy_all()}
          value={copyLines.join("\n")}
        />
      </div>
      <div>
        {rows.map((row) => (
          <Ca3BoxRow key={row.box} row={row} />
        ))}
      </div>

      <div className="mt-4 mb-4.5">
        <SettlementBlock
          expectedLabel={m.declarations_vat_expected()}
          settlement={vat.settlement}
        >
          {boxes.credit.amount > 0 && (
            <p className="mt-2.5 text-success text-xs leading-relaxed">
              {vat.creditIsRefundable
                ? m.declarations_credit_note_refund({
                    amount: money(boxes.credit.amount),
                  })
                : m.declarations_credit_note_carry({
                    amount: money(boxes.credit.amount),
                  })}
            </p>
          )}
          {boxes.creditCarried.amount > 0 && boxes.credit.amount === 0 && (
            <p className="mt-2.5 text-muted-foreground-3 text-xs leading-relaxed">
              {m.declarations_used_credit_note({
                credit: money(boxes.creditCarried.amount),
                month: previous,
                gross: money(boxes.due.amount + boxes.creditCarried.amount),
                due: money(boxes.due.amount),
              })}
            </p>
          )}
        </SettlementBlock>
      </div>

      <DeclarationActions
        completion={vat.completion}
        hasDeadline={vat.deadline !== null}
        href="https://www.impots.gouv.fr"
        isBusy={isBusy}
        linkLabel={m.declarations_vat_link()}
        onMarkFiled={onMarkFiled}
        onMarkPaid={onMarkPaid}
        onUndo={onUndo}
      />
    </section>
  );
}
