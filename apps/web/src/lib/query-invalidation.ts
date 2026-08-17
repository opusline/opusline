import type { Query } from "@tanstack/react-query";

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
