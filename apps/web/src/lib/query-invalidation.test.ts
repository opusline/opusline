import {
  listMissionDocumentsQueryKey,
  listTimeEntriesQueryKey,
} from "@opusline/api-client/react-query";
import type { Query } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import { operationFilter } from "./query-invalidation";

function queryWithKey(queryKey: unknown): Query {
  return { queryKey } as Query;
}

/**
 * Built with the real generated builders on purpose: operationFilter leans on
 * hey-api putting `{ _id }` first in the key, and this is the test that fails
 * if a regeneration moves it.
 */
describe("operationFilter", () => {
  it("matches the operation whatever parameters it was fetched with", () => {
    const filter = operationFilter("listTimeEntries");

    expect(
      filter.predicate(
        queryWithKey(
          listTimeEntriesQueryKey({
            query: { from: "2026-01-05", to: "2026-01-11" },
          }),
        ),
      ),
    ).toBe(true);
    expect(
      filter.predicate(
        queryWithKey(
          listTimeEntriesQueryKey({
            query: { from: "2026-08-03", to: "2026-08-09" },
          }),
        ),
      ),
    ).toBe(true);
  });

  it("matches an operation whose key carries path parameters", () => {
    expect(
      operationFilter("listMissionDocuments").predicate(
        queryWithKey(
          listMissionDocumentsQueryKey({
            path: { client: "vesterhus", mission: "refonte" },
          }),
        ),
      ),
    ).toBe(true);
  });

  it("leaves other operations alone", () => {
    expect(
      operationFilter("listMissionDocuments").predicate(
        queryWithKey(
          listTimeEntriesQueryKey({
            query: { from: "2026-08-03", to: "2026-08-09" },
          }),
        ),
      ),
    ).toBe(false);
    expect(operationFilter("listTimeEntries").predicate(queryWithKey([]))).toBe(
      false,
    );
  });
});
