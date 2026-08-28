import type { Locale, TimeEntryData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { Skeleton } from "@opusline/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@opusline/ui/components/table";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import { useDateFormat, useLocale } from "@/components/money-format-provider";
import { REVENUE_PLACEHOLDER } from "@/lib/client-revenue";
import { calendarDateNumericLabel } from "@/lib/dates";
import { billedQuantityLabel } from "@/lib/durations";
import { m } from "@/paraglide/messages.js";

const HEAD_CLASSES = "sticky top-0 z-10 border-b bg-card px-3 py-3 font-normal";

const CELL_CLASSES = "border-secondary border-b px-3 py-3 align-middle";

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
 * The entry in the unit its mission bills in — days on a day-billed mission,
 * hours on an hourly one — already rounded to the mission's increment by the
 * API, so the row reads as the quantity an invoice would carry.
 */
function quantityLabel(locale: Locale, entry: TimeEntryData): string {
  return (
    billedQuantityLabel(locale, {
      valuedDays: entry.valuedDayFraction,
      valuedMinutes: entry.valuedMinutes,
    }) ?? REVENUE_PLACEHOLDER
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
        Scrolls in its own box so a long mission's history does not push the
        header tiles and tabs off the page.
      */}
      <Table
        aria-label={m.missions_entries_table_label()}
        className="min-w-124 table-fixed border-separate border-spacing-0"
        containerClassName="max-h-160 overflow-auto"
      >
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead
              className={cn(eyebrowVariants(), HEAD_CLASSES, "w-28 pl-5")}
            >
              {m.common_date_label()}
            </TableHead>
            <TableHead className={cn(eyebrowVariants(), HEAD_CLASSES, "w-20")}>
              {m.missions_entries_header_quantity()}
            </TableHead>
            <TableHead className={cn(eyebrowVariants(), HEAD_CLASSES)}>
              {m.common_note_label()}
            </TableHead>
            <TableHead
              className={cn(
                eyebrowVariants(),
                HEAD_CLASSES,
                "w-29 pr-5 text-right",
              )}
            >
              {m.missions_entries_header_state()}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isPending &&
            !isError &&
            entries.map((entry) => {
              const state = entryStateOf(entry);

              return (
                <TableRow className="hover:bg-transparent" key={entry.id}>
                  <TableCell
                    className={cn(
                      CELL_CLASSES,
                      "pl-5 font-mono text-foreground-3 text-sm tabular-nums",
                    )}
                  >
                    {calendarDateNumericLabel(dateFormat, entry.date)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      CELL_CLASSES,
                      "font-mono text-foreground-hi text-sm tabular-nums",
                    )}
                  >
                    {quantityLabel(locale, entry)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      CELL_CLASSES,
                      "max-w-0 truncate pr-3 text-muted-foreground text-sm",
                    )}
                  >
                    {entry.note ?? ""}
                  </TableCell>
                  <TableCell className={cn(CELL_CLASSES, "pr-5 text-right")}>
                    <Badge variant={STATE_VARIANTS[state]}>
                      {STATE_MESSAGES[state]()}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

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
