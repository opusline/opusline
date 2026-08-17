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
 * Three things read a time entry: the week grid's date-range list, the mission
 * page's own history, and the revenue figures, whose month totals are derived
 * from tracked time. Writing one entry invalidates all of them, so a mission
 * opened right after an edit in the grid shows neither a pre-edit history nor
 * pre-edit tiles.
 *
 * Keep every time-entry write going through this rather than invalidating
 * listTimeEntries directly, or those surfaces silently go stale again.
 */
export async function invalidateTimeEntries(
  queryClient: QueryClient,
  weekFilter: QueryFilters = operationFilter("listTimeEntries"),
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries(weekFilter),
    queryClient.invalidateQueries(operationFilter("listMissionTimeEntries")),
    queryClient.invalidateQueries(revenueFilter()),
  ]);
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
