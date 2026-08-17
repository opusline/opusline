import type { Locale, TimeEntryData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import { useDateFormat, useLocale } from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { billedQuantityLabel, formatWorkedTime } from "@/lib/durations";
import { m } from "@/paraglide/messages.js";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

const ROW_GRID = "grid grid-cols-[7rem_5rem_minmax(0,1fr)_7.25rem] gap-x-3";

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

/**
 * The entry in the unit its mission bills in — days on a TJM mission, hours on
 * an hourly one — already rounded to the mission's increment by the API, so the
 * row reads as the quantity an invoice would carry.
 *
 * A mission that prices no time (fixed price, or no rate) values nothing, and
 * falls back to the duration actually tracked.
 */
function quantityLabel(locale: Locale, entry: TimeEntryData): string {
  return (
    billedQuantityLabel(locale, {
      valuedDays: entry.valuedDayFraction,
      valuedMinutes: entry.valuedMinutes,
    }) ?? formatWorkedTime(entry.durationMinutes)
  );
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
  const dateFormat = useDateFormat();

  return (
    <div className="overflow-hidden rounded-md border bg-card">
      {/*
        Scrolls on both axes in its own box. Vertically, because a long-running
        mission has hundreds of entries and the page should keep the header
        tiles and the tab bar in view; horizontally, because the columns are
        fixed tracks and the card clips its overflow for its rounded corners,
        which would drop the state column off the edge with nothing to say it
        is there. The column header sticks, since a scrolled row with no header
        above it is unreadable.
      */}
      <div className="max-h-160 overflow-auto">
        <div className="min-w-124">
          <div
            className={cn(
              EYEBROW_CLASSES,
              ROW_GRID,
              "sticky top-0 z-10 border-b bg-card px-5 py-3",
            )}
          >
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
                    {calendarDateNumericLabel(dateFormat, entry.date)}
                  </div>
                  <div className="font-mono text-foreground-hi text-sm tabular-nums">
                    {quantityLabel(locale, entry)}
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
