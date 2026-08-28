import type { DeadlineItemData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount, type MoneyFormat } from "@/lib/billing";
import { calendarDateNumericLabel, capitalizedMonthLabel } from "@/lib/dates";
import {
  daysUntilDue,
  deadlineItemAmountCents,
  deadlineItemKey,
  deadlineItemTitle,
  isItemDone,
} from "@/lib/deadlines";
import { m } from "@/paraglide/messages.js";

import { deadlineRowTone } from "../lib/rows";

type DeadlineTimelineProps = {
  items: DeadlineItemData[];
  /** The account's own calendar date — every "how long is left" is cut against it. */
  today: string;
  /** The occurrence a completion request is in flight for, as `fiscal:kind:periodKey`. */
  pendingKey: string | null;
  onToggleFiscal: (item: DeadlineItemData) => void;
};

const DOT_TONES = {
  late: "bg-destructive",
  action: "bg-primary",
  quiet: "bg-border-4",
  done: "bg-success",
} as const;

export function DeadlineTimeline({
  items,
  today,
  pendingKey,
  onToggleFiscal,
}: DeadlineTimelineProps) {
  if (items.length === 0) {
    return (
      <Empty className="rounded-md border bg-card px-6 py-9">
        <EmptyHeader className="gap-2">
          <EmptyTitle variant="strong">
            {m.deadlines_upcoming_empty_title()}
          </EmptyTitle>
          <EmptyDescription className="max-w-[52ch] text-pretty text-muted-foreground-3 text-sm">
            {m.deadlines_upcoming_empty()}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {items.map((item) => (
        <DeadlineRow
          isPending={pendingKey === deadlineItemKey(item)}
          item={item}
          key={deadlineItemKey(item)}
          onToggleFiscal={onToggleFiscal}
          today={today}
        />
      ))}
    </ol>
  );
}

type DeadlineRowProps = {
  item: DeadlineItemData;
  today: string;
  isPending: boolean;
  onToggleFiscal: (item: DeadlineItemData) => void;
};

function DeadlineRow({
  item,
  today,
  isPending,
  onToggleFiscal,
}: DeadlineRowProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  const tone = deadlineRowTone(item, today);
  const done = isItemDone(item);
  const title = deadlineItemTitle(item);
  const amountCents = deadlineItemAmountCents(item);
  const dueLabel = calendarDateNumericLabel(dateFormat, item.dueOn);

  const card = (
    <>
      <div className="min-w-0 flex-1 basis-64">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className={cn(
              "text-base",
              done ? "text-muted-foreground-3" : "text-foreground-hi",
            )}
          >
            {title}
          </span>
          <TimingChip item={item} today={today} tone={tone} />
        </div>
        <div className="mt-0.5 text-muted-foreground-3 text-sm">
          {subLineOf(item, format, today)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div
          className={cn(
            "whitespace-nowrap font-mono text-lg tabular-nums",
            done
              ? "text-muted-foreground-3"
              : tone === "quiet"
                ? "text-foreground-2"
                : "text-primary-text",
          )}
        >
          {amountCents === null ? (
            "—"
          ) : (
            <>
              {/* The tilde marks a guess (last year's CFE), not a sum — the
                  URSSAF and TVA figures are computed from real collections. */}
              {item.fiscal?.isEstimate &&
                (item.fiscal.kind === 3 || item.fiscal.kind === 4) && (
                  <span aria-hidden>{"~ "}</span>
                )}
              {formatWholeAmount(format, amountCents)}
            </>
          )}
        </div>
        <div className="mt-0.5 text-muted-foreground-3 text-xs">
          {item.fiscal?.completedOn != null
            ? m.deadlines_done_at({
                date: calendarDateNumericLabel(
                  dateFormat,
                  item.fiscal.completedOn,
                ),
              })
            : item.type === 1
              ? m.deadlines_reminder_due_at({ date: dueLabel })
              : m.deadlines_due_at({ date: dueLabel })}
        </div>
      </div>
    </>
  );

  const cardClasses = cn(
    "flex min-w-0 flex-1 flex-wrap items-center gap-4 rounded-md border px-5 py-3.5 text-left transition-colors",
    // A settled line recedes: its card fades toward the page instead of
    // sitting as solid as the ones still calling for something.
    done ? "bg-card/50" : "bg-card",
    tone === "action" && "border-primary/35",
    "hover:border-border-4 focus-visible:outline-2 focus-visible:outline-primary-text focus-visible:outline-offset-2",
  );

  return (
    <li className="flex items-stretch gap-3.5">
      <span className="flex w-2 shrink-0 justify-center pt-6" aria-hidden>
        <span className={cn("size-2 rounded-full", DOT_TONES[tone])} />
      </span>
      {item.invoice !== null ? (
        <Link
          className={cardClasses}
          search={{ invoice: item.invoice.id }}
          to="/invoices"
        >
          {card}
        </Link>
      ) : (
        <button
          aria-label={
            done
              ? `${m.deadlines_mark_not_done()} — ${title} ${dueLabel}`
              : `${m.deadlines_mark_done()} — ${title} ${dueLabel}`
          }
          className={cardClasses}
          disabled={isPending}
          onClick={() => onToggleFiscal(item)}
          type="button"
        >
          {card}
        </button>
      )}
    </li>
  );
}

function TimingChip({
  item,
  today,
  tone,
}: {
  item: DeadlineItemData;
  today: string;
  tone: ReturnType<typeof deadlineRowTone>;
}) {
  if (tone === "done") {
    return <Badge variant="success">{m.deadlines_chip_done()}</Badge>;
  }

  if (item.type === 1) {
    return <Badge variant="brand">{m.deadlines_chip_todo()}</Badge>;
  }

  const days = daysUntilDue(item.dueOn, today);

  if (days < 0) {
    return (
      <Badge variant="warn">{m.deadlines_chip_late({ count: -days })}</Badge>
    );
  }

  if (days === 0) {
    return <Badge variant="brand">{m.deadlines_chip_today()}</Badge>;
  }

  return (
    <Badge variant={tone === "action" ? "brand" : "quiet"}>
      {m.deadlines_chip_in({ count: days })}
    </Badge>
  );
}

/**
 * The line under the title: what the figure is made of, in the design's own
 * words per kind. Assembled here rather than sent by the API so it renders in
 * the viewer's language; the ICS feed composes its own server-side.
 */
function subLineOf(
  item: DeadlineItemData,
  format: MoneyFormat,
  today: string,
): string {
  const invoice = item.invoice;

  if (invoice !== null && item.type === 1) {
    const parts = [
      m.deadlines_reminder_unpaid({
        number: invoice.number ?? `#${invoice.id}`,
        days: daysUntilDue(item.dueOn, today) * -1,
      }),
      invoice.remindersSent === 0
        ? m.deadlines_reminder_never_sent()
        : m.deadlines_reminder_sent_times({ count: invoice.remindersSent }),
    ];

    return parts.join(" · ");
  }

  if (invoice !== null) {
    const period =
      invoice.periodStart !== null
        ? capitalizedMonthLabel(format.locale, invoice.periodStart)
        : (invoice.missionName ?? "");
    const parts = [period];

    if (daysUntilDue(item.dueOn, today) < 0) {
      parts.push(m.deadlines_invoice_late_suffix());
    }

    return parts.filter((part) => part !== "").join(" · ");
  }

  const fiscal = item.fiscal;

  if (fiscal === null) {
    return "";
  }

  switch (fiscal.kind) {
    case 0: {
      if (fiscal.amount === null || fiscal.rateBp === null) {
        return m.deadlines_fiscal_pending_sub();
      }

      // The estimate is HT collected × rate; reading the HT back out keeps
      // the sentence's two numbers provably consistent with each other.
      const collectedCents = Math.round(
        (fiscal.amount.amount * 10_000) / fiscal.rateBp,
      );

      return m.deadlines_urssaf_sub({
        amount: formatWholeAmount(format, collectedCents),
        rate: String(fiscal.rateBp / 100),
      });
    }
    case 1:
    case 2:
      return fiscal.amount === null
        ? m.deadlines_fiscal_pending_sub()
        : m.deadlines_vat_sub({
            amount: formatWholeAmount(format, fiscal.amount.amount),
          });
    default:
      return fiscal.isEstimate
        ? m.deadlines_cfe_sub_estimate()
        : m.deadlines_cfe_sub_notice();
  }
}
