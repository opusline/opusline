import { Button } from "@opusline/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@opusline/ui/components/popover";
import { cn } from "@opusline/ui/lib/utils";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { BudgetShareBadge } from "@/components/budget-share-badge";
import { weekdayDateLabel, weekdayShortLabel } from "@/lib/weeks";
import { m } from "@/paraglide/messages.js";

import { PILL_SKINS, UNINVOICED_RING } from "../lib/pill-skins";
import type { WeekGridModel } from "../lib/week-grid";
import { ActivityPopover } from "./activity-popover";
import { LivePill, skinOf } from "./week-cell";
import type { WeekGridProps } from "./week-grid";

type WeekDayListProps = Pick<
  WeekGridProps,
  "model" | "live" | "noteSuggestions" | "onDelete" | "onUpdate"
> & {
  /** `Y-m-d` of the day the list opens on when the week holds today. */
  today: string;
  /** Receives the `Y-m-d` on screen, so the new entry lands on that day. */
  onAddEntry: (date: string) => void;
};

type DayColumn = Extract<WeekGridModel["columns"][number], { kind: "day" }>;

function pickDay(
  columns: WeekGridModel["columns"],
  chosen: string | null,
  today: string,
): DayColumn | undefined {
  const days = columns.filter((column) => column.kind === "day");

  return (
    days.find((day) => day.date === chosen) ??
    days.find((day) => day.date === today) ??
    days[0]
  );
}

/** The week as one day at a time, for a screen too narrow for seven columns. */
export function WeekDayList({
  model,
  live,
  today,
  noteSuggestions,
  onAddEntry,
  onDelete,
  onUpdate,
}: WeekDayListProps) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const day = pickDay(model.columns, chosen, today);

  if (day === undefined) {
    return null;
  }

  const columnIndex = model.columns.indexOf(day);
  const entries = model.rows.flatMap((row) => {
    const cell = row.cells[columnIndex];
    const liveHere =
      live !== null &&
      live.missionId === row.missionId &&
      live.date === day.date
        ? live
        : null;

    return cell.entries.length === 0 && liveHere === null
      ? []
      : [{ cell, live: liveHere, row }];
  });

  return (
    <section
      className="flex flex-col gap-4 rounded-md border bg-card p-4"
      data-date={day.date}
      data-testid="week-day-list"
    >
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="font-heading font-semibold text-foreground-hi text-lg first-letter:uppercase">
          {weekdayDateLabel(model.locale, day.date)}
        </h2>
        <span
          className="whitespace-nowrap font-mono text-primary-text text-sm tabular-nums"
          data-testid="week-day-list-total"
        >
          <span className="sr-only">{m.week_day_total()} </span>
          {model.dayTotals[columnIndex]}
        </span>
      </header>

      <fieldset
        aria-label={m.week_day_picker_label()}
        className="m-0 grid min-w-0 grid-cols-7 gap-1.5 border-0 p-0"
      >
        {model.columns.flatMap((column, index) =>
          column.kind === "day"
            ? [
                <button
                  aria-pressed={column.date === day.date}
                  className={cn(
                    "relative flex h-13 flex-col items-center justify-center gap-0.5 rounded-sm border font-mono outline-none focus-visible:outline-2 focus-visible:outline-primary-text",
                    column.date === day.date
                      ? "border-primary-text bg-primary/10 text-primary-text"
                      : "bg-muted text-muted-foreground-2",
                    column.isToday &&
                      column.date !== day.date &&
                      "text-foreground-hi",
                  )}
                  data-date={column.date}
                  data-testid="week-day-tab"
                  key={column.date}
                  onClick={() => setChosen(column.date)}
                  type="button"
                >
                  <span className="sr-only">
                    {weekdayDateLabel(model.locale, column.date)}
                  </span>
                  <span aria-hidden className="text-2xs uppercase">
                    {column.weekdayLabel.charAt(0)}
                  </span>
                  <span aria-hidden className="text-sm tabular-nums">
                    {Number(column.date.slice(-2))}
                  </span>
                  {model.rows.some(
                    (row) => row.cells[index].entries.length > 0,
                  ) && (
                    <span
                      aria-hidden
                      className="absolute top-1 right-1 size-1 rounded-full bg-primary-text"
                    />
                  )}
                </button>,
              ]
            : column.dates.map((date) => (
                <span
                  aria-hidden
                  className="flex h-13 items-center justify-center rounded-sm bg-muted font-mono text-muted-foreground-5 text-xs uppercase"
                  key={date}
                >
                  {weekdayShortLabel(model.locale, date).charAt(0)}
                </span>
              )),
        )}
      </fieldset>

      <div className="flex flex-col gap-2.5">
        {entries.length === 0 && (
          <p className="py-2 text-center text-muted-foreground-2 text-sm">
            {m.week_day_empty()}
          </p>
        )}
        {entries.map(({ cell, live: liveHere, row }) => (
          <div
            className="flex flex-col gap-2"
            data-mission={row.missionId}
            data-testid="week-day-entry"
            key={row.missionId}
          >
            {cell.entries.length > 0 && (
              <Popover
                onOpenChange={(open) => setOpenKey(open ? cell.key : null)}
                open={openKey === cell.key}
              >
                <PopoverTrigger
                  className={cn(
                    "relative flex min-h-14 w-full flex-col gap-1 rounded-sm border px-3 py-2.5 text-left outline-none focus-visible:outline-2 focus-visible:outline-primary-text",
                    PILL_SKINS[skinOf(row, cell)].pill,
                  )}
                  data-minutes={cell.entries.reduce(
                    (total, entry) => total + entry.durationMinutes,
                    0,
                  )}
                  data-testid="week-day-entry-card"
                >
                  <span className="sr-only">{cell.ariaLabel}</span>
                  {cell.hasUninvoicedTime && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-1.5 right-1.5",
                        UNINVOICED_RING,
                      )}
                      title={m.week_uninvoiced_marker()}
                    />
                  )}
                  <span
                    aria-hidden
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden
                        className={cn(
                          "h-3.5 w-0.75 shrink-0 rounded-sm",
                          row.colorClass,
                        )}
                      />
                      <span className="truncate font-medium text-sm">
                        {row.name}
                      </span>
                    </span>
                    <span className="whitespace-nowrap font-mono text-sm tabular-nums">
                      {cell.billedLabel}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "flex min-w-0 items-center gap-2 text-xs",
                      PILL_SKINS[skinOf(row, cell)].note,
                    )}
                  >
                    <span className="truncate">
                      {cell.entries.length > 1
                        ? m.week_entries_count({ count: cell.entries.length })
                        : (cell.note ?? row.subtitle)}
                    </span>
                    {row.budget === null ? null : (
                      <BudgetShareBadge budget={row.budget} />
                    )}
                  </span>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  aria-label={cell.ariaLabel}
                  className="w-70"
                >
                  <ActivityPopover
                    canBill={row.hasRate}
                    cell={cell}
                    noteSuggestions={noteSuggestions}
                    onClose={() => setOpenKey(null)}
                    onDeleteEntry={(entryId) =>
                      onDelete({ cellKey: cell.key, entryIds: [entryId] })
                    }
                    onUpdateEntry={(entryId, patch) =>
                      onUpdate({ cellKey: cell.key, entryId, ...patch })
                    }
                  />
                </PopoverContent>
              </Popover>
            )}
            {liveHere !== null && <LivePill live={liveHere} />}
          </div>
        ))}

        <Button
          className="w-full"
          data-testid="week-day-add"
          onClick={() => onAddEntry(day.date)}
          size="2xl"
          type="button"
          variant="outline"
        >
          <PlusIcon aria-hidden data-icon="inline-start" />
          {m.week_add_entry()}
        </Button>
      </div>
    </section>
  );
}
