import type { TimeEntryData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import { useLocale } from "@/components/money-format-provider";
import { calendarDateLabel } from "@/lib/dates";
import { formatWorkedTime } from "@/lib/durations";
import { m } from "@/paraglide/messages.js";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

const ROW_GRID = "grid grid-cols-[5.5rem_5.75rem_minmax(0,1fr)_7.25rem]";

type EntryState = "invoiced" | "billable" | "nonBillable";

/**
 * Invoiced outranks billable: once a bill covers the entry, whether it *could*
 * have been billed is no longer the useful thing to read.
 */
function entryStateOf(entry: TimeEntryData): EntryState {
  if (entry.invoiced) {
    return "invoiced";
  }

  return entry.billable ? "billable" : "nonBillable";
}

const STATE_MESSAGES: Record<EntryState, () => string> = {
  invoiced: m.missions_entry_state_invoiced,
  billable: m.missions_entry_state_billable,
  nonBillable: m.missions_entry_state_non_billable,
};

const STATE_VARIANTS: Record<
  EntryState,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  invoiced: "success",
  billable: "brand",
  nonBillable: "quiet",
};

type MissionEntriesTableProps = {
  entries: TimeEntryData[];
  isPending?: boolean;
  isError?: boolean;
};

export function MissionEntriesTable({
  entries,
  isPending,
  isError,
}: MissionEntriesTableProps) {
  const locale = useLocale();

  return (
    <div className="overflow-hidden rounded-md border bg-card">
      {/*
        The columns are fixed tracks, so on a narrow viewport the row is wider
        than the card. It has to scroll here: the card clips its overflow for
        its rounded corners, and clipping a table drops the state column off
        the right edge with nothing to say it is there.
      */}
      <div className="overflow-x-auto">
        <div className="min-w-124">
          <div className={cn(EYEBROW_CLASSES, ROW_GRID, "border-b px-5 py-3")}>
            <div>{m.common_date_label()}</div>
            <div>{m.common_duration()}</div>
            <div>{m.common_note_label()}</div>
            <div className="text-right">
              {m.missions_entries_header_state()}
            </div>
          </div>

          {!isPending &&
            !isError &&
            entries.map((entry) => {
              const state = entryStateOf(entry);

              return (
                <div
                  key={entry.id}
                  className={cn(
                    ROW_GRID,
                    "items-center border-secondary border-b px-5 py-3 last:border-0",
                  )}
                >
                  <div className="font-mono text-foreground-3 text-sm tabular-nums">
                    {calendarDateLabel(locale, entry.date)}
                  </div>
                  <div className="font-mono text-foreground-hi text-sm tabular-nums">
                    {formatWorkedTime(entry.durationMinutes)}
                  </div>
                  <div className="min-w-0 truncate pr-3 text-muted-foreground text-sm">
                    {entry.note ?? ""}
                  </div>
                  <div className="text-right">
                    <Badge variant={STATE_VARIANTS[state]}>
                      {STATE_MESSAGES[state]()}
                    </Badge>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {isPending && (
        <div className="flex flex-col gap-2 px-5 py-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      )}

      {isError && (
        <div className="px-5 py-6 text-center text-destructive text-sm">
          {m.missions_entries_load_failed()}
        </div>
      )}

      {!isPending && !isError && entries.length === 0 && (
        <div className="px-5 py-6 text-center text-muted-foreground-3 text-sm">
          {m.missions_entries_empty()}
        </div>
      )}

      <div className="flex items-center justify-between bg-muted px-5 py-3.5">
        <span className="text-muted-foreground-3 text-sm">
          {m.missions_entries_from_week()}
        </span>
        <Link
          className="text-link text-sm transition-colors hover:text-link-hover"
          to="/week"
        >
          {m.missions_open_week()}
        </Link>
      </div>
    </div>
  );
}
