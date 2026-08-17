import type {
  FiscalDeadlineData,
  FiscalDeadlineKind,
  FiscalDeadlineListData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { cn } from "@opusline/ui/lib/utils";
import { Info } from "lucide-react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

const KIND_MESSAGES: Record<FiscalDeadlineKind, () => string> = {
  0: m.deadlines_kind_vat,
  1: m.deadlines_kind_urssaf,
};

/** "in 12 days" / "today" / "3 days late" — the reader's real question. */
function timingLabel(deadline: FiscalDeadlineData): string {
  if (deadline.isOverdue) {
    return m.deadlines_overdue_by({ count: Math.abs(deadline.daysUntilDue) });
  }

  return deadline.daysUntilDue === 0
    ? m.deadlines_due_today()
    : m.deadlines_in_days({ count: deadline.daysUntilDue });
}

function DeadlineRow({ deadline }: { deadline: FiscalDeadlineData }) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  return (
    <div className="flex flex-wrap items-center gap-3 border-secondary border-b px-5 py-3.5 last:border-0">
      <Badge variant={deadline.kind === 0 ? "brand" : "neutral"}>
        {KIND_MESSAGES[deadline.kind]()}
      </Badge>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-foreground-hi text-sm">
          {deadline.period}
        </div>
        <div className="mt-0.5 text-muted-foreground-3 text-xs">
          {m.deadlines_due_on({
            date: calendarDateNumericLabel(dateFormat, deadline.dueOn),
          })}{" "}
          ·{" "}
          <span className={cn(deadline.isOverdue && "text-destructive")}>
            {timingLabel(deadline)}
          </span>
        </div>
      </div>
      <span className="shrink-0 text-right font-mono text-foreground-hi text-sm tabular-nums">
        {deadline.amount === null ? (
          <span className="text-muted-foreground-3 text-xs">
            {m.deadlines_amount_pending()}
          </span>
        ) : (
          formatWholeAmount(format, deadline.amount.amount)
        )}
      </span>
    </div>
  );
}

type DeadlinesPageProps = {
  fiscalDeadlines: FiscalDeadlineListData;
};

export function DeadlinesPage({ fiscalDeadlines }: DeadlinesPageProps) {
  const overdue = fiscalDeadlines.deadlines.filter(
    (deadline) => deadline.isOverdue,
  );
  const upcoming = fiscalDeadlines.deadlines.filter(
    (deadline) => !deadline.isOverdue,
  );

  return (
    <div className="flex max-w-270 flex-col gap-5">
      <div>
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          {m.deadlines_title()}
        </h1>
        <p className="mt-1.5 text-muted-foreground-3 text-sm">
          {m.deadlines_subtitle()}
        </p>
      </div>

      {fiscalDeadlines.deadlines.length === 0 && (
        <div className="rounded-md border bg-card px-5 py-6 text-center text-muted-foreground-3 text-sm">
          {m.deadlines_none()}
        </div>
      )}

      {overdue.length > 0 && (
        <div className="overflow-hidden rounded-md border border-destructive/40 bg-card">
          <div className="border-b border-destructive/30 bg-destructive/8 px-5 py-3">
            <span className={cn(EYEBROW_CLASSES, "text-destructive")}>
              {m.deadlines_overdue_group()}
            </span>
          </div>
          {overdue.map((deadline) => (
            <DeadlineRow
              deadline={deadline}
              key={`${deadline.kind}-${deadline.period}`}
            />
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="overflow-hidden rounded-md border bg-card">
          <div className="border-b px-5 py-3">
            <span className={EYEBROW_CLASSES}>
              {m.deadlines_upcoming_group()}
            </span>
          </div>
          {upcoming.map((deadline) => (
            <DeadlineRow
              deadline={deadline}
              key={`${deadline.kind}-${deadline.period}`}
            />
          ))}
        </div>
      )}

      {fiscalDeadlines.hasUncomputedVatSchedule && (
        <Alert>
          <Info />
          <AlertDescription>
            <strong className="font-medium">{m.deadlines_ca12_title()}</strong>{" "}
            {m.deadlines_ca12_body()}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
