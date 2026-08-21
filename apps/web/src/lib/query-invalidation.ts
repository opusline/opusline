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
 * The Virement figure and the sidebar tile that mirrors it. It is balance minus
 * provisions, so it moves with the bank account, with every invoice that gets
 * paid, and with the fiscal settings — three features that would otherwise each
 * invent their own key for it.
 */
export function treasuryFilter(): { predicate: (query: Query) => boolean } {
  return operationFilter("showTreasury");
}

/**
 * The fan-out every invoice write owes the rest of the app. Beyond the lists,
 * the open fiche and the summary: the next free reference is derived from the
 * numbers already taken, the revenue figures move with what is issued and
 * collected, and linking entries to an invoice flips the invoiced badge on the
 * mission's history and the "to invoice" ring on the week grid.
 *
 * The bare `listInvoices` key matches every parameterisation of it — the ledger
 * and the per-client and per-mission lists alike — so a write does not have to
 * know which ones happen to be mounted.
 */
export async function invalidateInvoiceWrites(
  queryClient: QueryClient,
): Promise<void> {
  // Not awaited: the sidebar's treasury observer is mounted on every screen, so
  // this is the one filter here that always issues a request — and it is the
  // most expensive one. Marking a background tile stale should not hold the
  // spinner on « Marquer payée ».
  void queryClient.invalidateQueries(treasuryFilter());

  await Promise.all([
    queryClient.invalidateQueries({ queryKey: listInvoicesQueryKey() }),
    queryClient.invalidateQueries(operationFilter("showInvoice")),
    queryClient.invalidateQueries({ queryKey: showInvoiceSummaryQueryKey() }),
    queryClient.invalidateQueries({
      queryKey: showNextInvoiceNumberQueryKey(),
    }),
    queryClient.invalidateQueries(revenueFilter()),
    queryClient.invalidateQueries(missionTimeEntriesFilter()),
    queryClient.invalidateQueries(weekTimeEntriesFilter()),
  ]);
}

/**
 * Three surfaces list the same documents: the client fiche, the mission fiche —
 * which merges its client's pieces in — and the global library on /documents. A
 * document filed or deleted on one of them moves all three.
 *
 * Keep every client- or mission-document write going through this rather than
 * invalidating one list directly, or the library shows a file that is gone (or
 * misses one that is not) for as long as its data stays fresh.
 */
export async function invalidateDocumentWrites(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.invalidateQueries(
    operationFilter(
      "listClientDocuments",
      "listMissionDocuments",
      "listDocumentLibrary",
    ),
  );
}
