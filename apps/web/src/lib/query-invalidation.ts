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
