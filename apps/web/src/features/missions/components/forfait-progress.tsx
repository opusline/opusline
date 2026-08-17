import type { MissionBillingProgressData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { cn } from "@opusline/ui/lib/utils";
import { CircleAlert } from "lucide-react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

/** The bar never runs past its track, even when the billing has. */
function barWidth(progressBp: number): string {
  return `${Math.min(progressBp, 10_000) / 100}%`;
}

function draftNote(draftCount: number): string | null {
  if (draftCount === 0) {
    return null;
  }

  return draftCount === 1
    ? m.forfait_draft_note({ count: draftCount })
    : m.forfait_drafts_note({ count: draftCount });
}

type ForfaitProgressProps = {
  progress: MissionBillingProgressData;
};

export function ForfaitProgress({ progress }: ForfaitProgressProps) {
  const format = useMoneyFormat();
  const note = draftNote(progress.draftCount);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border bg-card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className={EYEBROW_CLASSES}>{m.forfait_progress_title()}</span>
          <span className="font-mono text-muted-foreground-3 text-xs tabular-nums">
            {m.forfait_remaining()} ·{" "}
            {formatWholeAmount(format, progress.remaining.amount)}
          </span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-2xl text-foreground-hi tabular-nums">
            {formatWholeAmount(format, progress.invoiced.amount)}
          </span>
          <span className="text-muted-foreground-3 text-sm">
            {m.forfait_progress_of({
              price: formatWholeAmount(format, progress.fixedPrice.amount),
            })}
          </span>
        </div>

        <div
          aria-hidden
          className="mt-3 h-2 w-full overflow-hidden rounded-sm bg-secondary"
        >
          <div
            className={cn(
              "h-full rounded-sm",
              progress.isOverBilled ? "bg-destructive" : "bg-primary",
            )}
            style={{ width: barWidth(progress.progressBp) }}
          />
        </div>

        {progress.issuedCount === 0 && (
          <p className="mt-2.5 text-muted-foreground-3 text-xs">
            {m.forfait_nothing_billed()}
          </p>
        )}
        {note !== null && (
          <p className="mt-2.5 text-muted-foreground-3 text-xs">{note}</p>
        )}
      </div>

      {progress.isOverBilled && (
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>
            <strong className="font-medium">{m.forfait_over_billed()}</strong>{" "}
            {m.forfait_over_billed_body({
              amount: formatWholeAmount(
                format,
                Math.abs(progress.remaining.amount),
              ),
              price: formatWholeAmount(format, progress.fixedPrice.amount),
            })}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
