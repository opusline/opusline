import {
  listInvoicesQueryKey,
  showInvoiceSummaryQueryKey,
  showNextInvoiceNumberQueryKey,
} from "@opusline/api-client/react-query";
import type { Query, QueryClient, QueryFilters } from "@tanstack/react-query";

/**
 * Filter matching every cached query of one generated operation, whatever
 * parameters it was fetched with — "all weeks of listTimeEntries", "every
 * mission's listMissionDocuments".
 *
 * The generated builders put `{ _id: operationId }` first in the key; that is
 * hey-api internals, so the shape is asserted in query-invalidation.test.ts
 * against the real builders — a regeneration that moves it fails the suite
 * instead of turning these invalidations into silent no-ops.
 */
export function operationFilter(...operationIds: string[]): {
  predicate: (query: Query) => boolean;
} {
  return {
    predicate: (query) => {
      const [first] = query.queryKey as unknown[];

      return (
        typeof first === "object" &&
        first !== null &&
        "_id" in first &&
        operationIds.includes((first as { _id: unknown })._id as string)
      );
    },
  };
}

/**
 * The week grid's own date-range list. Time-entry writes move it, and so does
 * invoicing — linking entries to an invoice flips the "to invoice" ring the grid
 * draws — so both reach for one name rather than the raw operation id.
 */
export function weekTimeEntriesFilter(): {
  predicate: (query: Query) => boolean;
} {
  return operationFilter("listTimeEntries");
}

/**
 * Four things read a time entry: the week grid's date-range list, the mission
 * page's own history, the revenue figures, and the week view's month workload —
 * the last three all derived from tracked time. Writing one entry invalidates
 * all of them, so a mission opened right after an edit in the grid shows neither
 * a pre-edit history nor pre-edit tiles.
 *
 * Keep every time-entry write going through this rather than invalidating
 * listTimeEntries directly, or those surfaces silently go stale again.
 */
export async function invalidateTimeEntries(
  queryClient: QueryClient,
  weekFilter: QueryFilters = weekTimeEntriesFilter(),
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries(weekFilter),
    queryClient.invalidateQueries(missionTimeEntriesFilter()),
    queryClient.invalidateQueries(revenueFilter()),
    queryClient.invalidateQueries(monthWorkloadFilter()),
  ]);
}

/**
 * The week view's "Mois en cours" tile. Every time-entry write moves the days
 * it counts, so it rides along with the rest rather than being refetched by
 * whichever page happens to remount.
 */
export function monthWorkloadFilter(): {
  predicate: (query: Query) => boolean;
} {
  return operationFilter("summarizeMonthWorkload");
}

/**
 * The mission page's own entry history. Time-entry writes move it, and so does
 * invoicing — linking entries to an invoice flips the state each row shows —
 * so both reach for one name rather than the raw operation id.
 */
export function missionTimeEntriesFilter(): {
  predicate: (query: Query) => boolean;
} {
  return operationFilter("listMissionTimeEntries");
}

/**
 * Every cached revenue read: the clients listing fold and the two detail
 * lookups. Any invoice write moves all three, and they are routinely written on
 * one page and read back on another — one name so no call site invents its own.
 */
export function revenueFilter(): { predicate: (query: Query) => boolean } {
  return operationFilter(
    "listClientRevenue",
    "showClientRevenue",
    "showMissionRevenue",
  );
}

/**
 * Everything an invoice write moves. Creating, issuing, paying or deleting one
 * shifts the list, the summary, the next free reference and every revenue figure
 * the other screens read — keep every invoice write going through this, or the
 * next derived query has to be remembered on two screens.
 */
export function invalidateInvoiceWrites(
  queryClient: QueryClient,
  extras: Promise<unknown>[] = [],
): Promise<unknown> {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: listInvoicesQueryKey() }),
    queryClient.invalidateQueries({ queryKey: showInvoiceSummaryQueryKey() }),
    // Derived from the numbers already taken: without this the next invoice is
    // prefilled with the reference just used and the save is refused.
    queryClient.invalidateQueries({
      queryKey: showNextInvoiceNumberQueryKey(),
    }),
    queryClient.invalidateQueries(revenueFilter()),
    // Linking time to an invoice flips the invoiced badge on the mission's
    // history and the "to invoice" ring on the week grid's cells.
    queryClient.invalidateQueries(missionTimeEntriesFilter()),
    queryClient.invalidateQueries(weekTimeEntriesFilter()),
    ...extras,
  ]);
}
