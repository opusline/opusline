import { CopyButton } from "@opusline/ui/components/copy-button";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeFigure } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { type Ca3Row, declarationCopyValue } from "../lib/labels";

const VALUE_TONES = {
  default: "text-foreground-2",
  success: "text-success",
  quiet: "text-muted-foreground-2",
  due: "text-primary-text text-xl",
} as const;

const LINK_CLASSES =
  "rounded-sm text-right focus-visible:outline-2 focus-visible:outline-primary-text";

export function Ca3BoxRow({ row }: { row: Ca3Row }) {
  const format = useMoneyFormat();
  const valueClass = cn(
    "whitespace-nowrap font-mono text-base tabular-nums",
    VALUE_TONES[row.tone],
  );
  const value = formatWholeFigure(format, row.valueCents);
  const sourceFigure = row.source !== undefined && (
    <>
      <span
        className={cn(valueClass, "border-border-4 border-b border-dashed")}
      >
        {value}
      </span>
      <span className="mt-0.75 block text-muted-foreground-3 text-2xs">
        {row.source.caption} →
      </span>
    </>
  );

  return (
    <div className="flex items-center justify-between gap-3 border-secondary border-b py-2.5 last:border-b-0">
      <div className="flex min-w-0 flex-col gap-0.75">
        <span className="text-foreground-2 text-sm">{row.label}</span>
        <span className="font-mono text-muted-foreground-3 text-xs">
          {m.declarations_box({ box: row.box })}
          {row.note !== undefined && (
            <span className="font-sans"> · {row.note}</span>
          )}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        {row.source === undefined ? (
          <span className={valueClass}>{value}</span>
        ) : row.source.to === "/expenses" ? (
          <Link
            className={LINK_CLASSES}
            search={{ period: row.source.period }}
            to="/expenses"
          >
            {sourceFigure}
          </Link>
        ) : (
          <Link className={LINK_CLASSES} to="/invoices">
            {sourceFigure}
          </Link>
        )}
        {row.value2Cents !== undefined && (
          <>
            <CopyButton
              aria-label={m.declarations_copy_base()}
              copiedLabel={m.common_copied()}
              failedLabel={m.common_copy_failed()}
              size="icon"
              value={declarationCopyValue(row.valueCents)}
            />
            <span aria-hidden className="h-5 w-px bg-border-2" />
            <span className={valueClass}>
              {formatWholeFigure(format, row.value2Cents)}
            </span>
          </>
        )}
        <CopyButton
          aria-label={
            row.value2Cents === undefined
              ? m.declarations_copy_line({ line: row.label })
              : m.declarations_copy_tax()
          }
          copiedLabel={m.common_copied()}
          failedLabel={m.common_copy_failed()}
          size="icon"
          value={declarationCopyValue(row.value2Cents ?? row.valueCents)}
        />
      </div>
    </div>
  );
}
