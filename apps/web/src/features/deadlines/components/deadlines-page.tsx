import type { DeadlineBoardData, DeadlineItemData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { Chip, ChipCount, ChipGroup } from "@opusline/ui/components/chip";
import { cn } from "@opusline/ui/lib/utils";
import { CalendarCogIcon, CalendarPlusIcon, CheckIcon } from "lucide-react";

import {
  DEADLINE_CATEGORIES,
  type DeadlineCategory,
  daysUntilDue,
  deadlineCategoryLabel,
  isItemDone,
  itemCategory,
} from "@/lib/deadlines";
import { m } from "@/paraglide/messages.js";

import { DeadlineTimeline } from "./deadline-timeline";

export type DeadlineFilter = DeadlineCategory | "all";

type DeadlinesPageProps = {
  board: DeadlineBoardData;
  today: string;
  filter: DeadlineFilter;
  onFilterChange: (filter: DeadlineFilter) => void;
  isRefreshing: boolean;
  pendingKey: string | null;
  onToggleFiscal: (item: DeadlineItemData) => void;
  onOpenSubscribe: () => void;
};

function isDeadlineFilter(value: unknown): value is DeadlineFilter {
  return (
    value === "all" || DEADLINE_CATEGORIES.includes(value as DeadlineCategory)
  );
}

export function DeadlinesPage({
  board,
  today,
  filter,
  onFilterChange,
  isRefreshing,
  pendingKey,
  onToggleFiscal,
  onOpenSubscribe,
}: DeadlinesPageProps) {
  const counts = new Map<DeadlineFilter, number>([["all", board.items.length]]);

  for (const category of DEADLINE_CATEGORIES) {
    counts.set(
      category,
      board.items.filter((item) => itemCategory(item) === category).length,
    );
  }

  const visible =
    filter === "all"
      ? board.items
      : board.items.filter((item) => itemCategory(item) === filter);

  const owed = board.items.filter((item) => !isItemDone(item));
  const lateCount = owed.filter(
    (item) => daysUntilDue(item.dueOn, today) < 0 && item.type !== 1,
  ).length;
  const reminderCount = owed.filter((item) => item.type === 1).length;
  const upcomingCount = owed.length - lateCount - reminderCount;

  const summary = [
    m.deadlines_summary_late({ count: lateCount }),
    m.deadlines_summary_upcoming({ count: upcomingCount }),
    m.deadlines_summary_reminders({ count: reminderCount }),
  ].join(" · ");

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-4xl flex-col gap-4 transition-opacity",
        isRefreshing && "opacity-60",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          {m.deadlines_title()}
        </h1>
        <div className="flex items-center gap-2.5">
          {board.calendarSubscribedOn !== null && (
            <Badge variant="success">
              <CheckIcon aria-hidden />
              {m.deadlines_subscribed_badge()}
            </Badge>
          )}
          <Button onClick={onOpenSubscribe} size="xl" variant="outline">
            {board.calendarSubscribedOn !== null ? (
              <CalendarCogIcon aria-hidden data-icon="inline-start" />
            ) : (
              <CalendarPlusIcon aria-hidden data-icon="inline-start" />
            )}
            {board.calendarSubscribedOn !== null
              ? m.deadlines_manage_button()
              : m.deadlines_subscribe_button()}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <ChipGroup
          aria-label={m.deadlines_filter_aria()}
          onValueChange={(value) => {
            const next = value.find(isDeadlineFilter);

            if (next !== undefined) {
              onFilterChange(next);
            }
          }}
          value={[filter]}
        >
          {(["all", ...DEADLINE_CATEGORIES] as const).map((category) => (
            <Chip
              aria-label={`${
                category === "all"
                  ? m.deadline_category_all()
                  : deadlineCategoryLabel(category)
              } (${counts.get(category) ?? 0})`}
              key={category}
              shape="pill"
              value={category}
            >
              {category === "all"
                ? m.deadline_category_all()
                : deadlineCategoryLabel(category)}
              <ChipCount aria-hidden>{counts.get(category) ?? 0}</ChipCount>
            </Chip>
          ))}
        </ChipGroup>
        <p className="text-muted-foreground-3 text-xs">{summary}</p>
      </div>

      <DeadlineTimeline
        items={visible}
        onToggleFiscal={onToggleFiscal}
        pendingKey={pendingKey}
        today={today}
      />
    </div>
  );
}
