import type { UrssafDeclarationData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { CopyButton } from "@opusline/ui/components/copy-button";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeFigure } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import {
  declarationCopyValue,
  declarationPeriodLabel,
  urssafBadgeLabel,
} from "../lib/labels";

export function UrssafDeclarationCard({
  urssaf,
}: {
  urssaf: UrssafDeclarationData;
}) {
  const format = useMoneyFormat();
  const locale = useLocale();

  return (
    <section className="rounded-md border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <h2 className="font-heading font-semibold text-foreground-hi text-xl">
          {m.declarations_urssaf_title({
            period: declarationPeriodLabel(locale, urssaf.period),
          })}
        </h2>
        <Badge variant="quiet">{urssafBadgeLabel(urssaf.periodicity)}</Badge>
      </div>
      <p className="mt-1.5 mb-5 text-muted-foreground-3 text-sm leading-relaxed">
        {m.declarations_urssaf_intro()}
      </p>

      <div className="rounded-md border border-primary/40 bg-background p-5">
        <p className={eyebrowVariants()}>{m.declarations_urssaf_kicker()}</p>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3.5">
          <p className="whitespace-nowrap font-mono text-4xl text-primary-text leading-none tabular-nums">
            {formatWholeFigure(format, urssaf.base.amount)}
          </p>
          <CopyButton
            copiedLabel={m.common_copied()}
            failedLabel={m.common_copy_failed()}
            label={m.common_copy()}
            value={declarationCopyValue(urssaf.base.amount)}
          />
        </div>
        <p className="mt-2.5 text-muted-foreground-3 text-xs">
          {m.declarations_urssaf_note()}
        </p>
      </div>

      <a
        className="mt-3.5 inline-block text-link text-sm transition-colors hover:text-link-hover"
        href="https://autoentrepreneur.urssaf.fr"
        rel="noreferrer"
        target="_blank"
      >
        {m.declarations_urssaf_link()}
      </a>
    </section>
  );
}
