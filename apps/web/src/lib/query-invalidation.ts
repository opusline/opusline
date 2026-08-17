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
export function operationFilter(operationId: string): {
  predicate: (query: Query) => boolean;
} {
  return {
    predicate: (query) => {
      const [first] = query.queryKey as unknown[];

      return (
        typeof first === "object" &&
        first !== null &&
        "_id" in first &&
        (first as { _id: unknown })._id === operationId
      );
    },
  };
}

/**
 * Two endpoints read the same entries — the week grid's date-range list and the
 * mission page's own history. Writing one entry invalidates both, so a mission
 * opened right after an edit in the grid does not show the pre-edit history.
 *
 * Keep every time-entry write going through this rather than invalidating
 * listTimeEntries directly, or the mission tab silently goes stale again.
 */
export function invalidateTimeEntries(
  queryClient: QueryClient,
  weekFilter: QueryFilters = operationFilter("listTimeEntries"),
): Promise<void> {
  return Promise.all([
    queryClient.invalidateQueries(weekFilter),
    queryClient.invalidateQueries(operationFilter("listMissionTimeEntries")),
  ]).then(() => undefined);
}
