import type { VatDeclarationData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { CopyButton } from "@opusline/ui/components/copy-button";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount, formatWholeFigure } from "@/lib/billing";
import { VAT_REGIME_MESSAGES } from "@/lib/fiscality";
import { m } from "@/paraglide/messages.js";

import {
  ca3RateLine,
  declarationCopyValue,
  declarationPeriodLabel,
} from "../lib/labels";

export function VatDeclarationCard({ vat }: { vat: VatDeclarationData }) {
  const format = useMoneyFormat();
  const locale = useLocale();

  const salesHt = vat.salesHt.amount;
  const rateLine = ca3RateLine(vat.rateBp);

  // Only these two boxes are typed: the télédéclaration greys out the « taxe
  // due » column and every total, deriving them from the base. Both carry the
  // same HT figure — A1 as the operations total, 08 as the rate line's base.
  const rateHint = `${m.declarations_vat_case({ box: rateLine?.box ?? "" })} · ${m.declarations_ca3_base()}`;

  const lines = [
    {
      key: "a1",
      label: m.declarations_ca3_line_a1(),
      hint: m.declarations_vat_case({ box: "A1" }),
    },
    {
      key: "rate",
      label: rateLine?.label ?? m.declarations_ca3_line_rate_other(),
      hint: rateLine === null ? m.declarations_ca3_base() : rateHint,
    },
  ];

  return (
    <section className="rounded-md border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <h2 className="font-heading font-semibold text-foreground-hi text-xl">
          {m.declarations_vat_title({
            period: declarationPeriodLabel(locale, vat.period),
          })}
        </h2>
        <Badge variant="quiet">{VAT_REGIME_MESSAGES[vat.regime].label()}</Badge>
      </div>
      <p className="mt-1.5 mb-2 text-muted-foreground-3 text-sm leading-relaxed">
        {m.declarations_vat_intro()}
      </p>

      <div>
        {lines.map((line) => (
          <div
            className="flex items-center justify-between gap-3.5 border-secondary border-b py-3 last:border-b-0"
            key={line.key}
          >
            <div className="flex min-w-0 flex-col gap-0.75">
              <span className="text-foreground-2 text-sm">{line.label}</span>
              <span className="font-mono text-muted-foreground-3 text-xs">
                {line.hint}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              <span className="whitespace-nowrap font-mono text-foreground-2 text-xl tabular-nums">
                {formatWholeFigure(format, salesHt)}
              </span>
              <CopyButton
                aria-label={m.declarations_copy_line({ line: line.label })}
                copiedLabel={m.common_copied()}
                failedLabel={m.common_copy_failed()}
                size="icon"
                value={declarationCopyValue(salesHt)}
              />
            </div>
          </div>
        ))}
      </div>

      {rateLine === null && (
        <p className="mt-3 text-muted-foreground-3 text-xs leading-relaxed">
          {m.declarations_ca3_mixed_note()}
        </p>
      )}
      <p className="mt-3 text-muted-foreground-3 text-xs leading-relaxed">
        {m.declarations_ca3_computed_note({
          amount: formatWholeAmount(format, vat.collected.amount),
        })}
      </p>

      <a
        className="mt-3.5 inline-block text-link text-sm transition-colors hover:text-link-hover"
        href="https://www.impots.gouv.fr"
        rel="noreferrer"
        target="_blank"
      >
        {m.declarations_vat_link()}
      </a>
    </section>
  );
}
