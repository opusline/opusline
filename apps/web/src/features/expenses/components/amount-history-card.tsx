import type { SubscriptionAmountChangeData } from "@opusline/api-client";
import { Eyebrow, eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { cn } from "@opusline/ui/lib/utils";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatAmountWithCents, formatPercentFromBp } from "@/lib/billing";
import { calendarDateLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

const HEAD_CLASSES = cn(eyebrowVariants({ tone: "quiet" }), "font-normal");

export function AmountHistoryCard({
  changes,
}: {
  changes: SubscriptionAmountChangeData[];
}) {
  return (
    <section className="rounded-md border bg-card px-5 py-4.5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2.5">
        <Eyebrow>{m.subscriptions_history_title()}</Eyebrow>
        <span className="text-muted-foreground-3 text-xs">
          {m.subscriptions_history_caption()}
        </span>
      </div>
      {changes.length === 0 ? (
        <p className="text-muted-foreground-3 text-sm">
          {m.subscriptions_history_empty()}
        </p>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] items-center gap-x-3 gap-y-2.5 text-sm">
          <span className={cn(HEAD_CLASSES, "truncate")}>
            {m.subscriptions_history_col_subscription()}
          </span>
          <span className={cn(HEAD_CLASSES, "text-right")}>
            {m.subscriptions_history_col_before()}
          </span>
          <span className={cn(HEAD_CLASSES, "text-right")}>
            {m.subscriptions_history_col_after()}
          </span>
          <span />
          <span className={cn(HEAD_CLASSES, "whitespace-nowrap text-right")}>
            {m.subscriptions_history_col_since()}
          </span>
          {changes.map((change) => (
            <AmountChangeRow
              change={change}
              key={`${change.subscriptionId}:${change.since}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function AmountChangeRow({ change }: { change: SubscriptionAmountChangeData }) {
  const format = useMoneyFormat();
  const locale = useLocale();

  return (
    <>
      <span className="truncate text-foreground-hi">{change.supplier}</span>
      <span className="text-right font-mono text-muted-foreground-3 tabular-nums line-through">
        {formatAmountWithCents(format, change.before.amount)}
      </span>
      <span className="text-right font-mono text-foreground-2 tabular-nums">
        {formatAmountWithCents(format, change.after.amount)}
      </span>
      <span
        className={cn(
          "text-right font-mono text-xs tabular-nums",
          change.changeBp > 0
            ? "text-attention"
            : change.changeBp < 0
              ? "text-success"
              : "text-muted-foreground-3",
        )}
      >
        {change.changeBp > 0 ? "+" : change.changeBp < 0 ? "−" : ""}
        {m.common_percent({
          value: formatPercentFromBp(locale, Math.abs(change.changeBp), 0, 0),
        })}
      </span>
      <span className="whitespace-nowrap text-right text-muted-foreground-3">
        {calendarDateLabel(locale, change.since)}
      </span>
    </>
  );
}
