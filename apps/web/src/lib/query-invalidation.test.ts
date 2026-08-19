import {
  listClientRevenueQueryKey,
  listInvoicesQueryKey,
  listMissionDocumentsQueryKey,
  listMissionTimeEntriesQueryKey,
  listTimeEntriesQueryKey,
  showClientRevenueQueryKey,
  showInvoiceSummaryQueryKey,
  showMissionRevenueQueryKey,
} from "@opusline/api-client/react-query";
import { type Query, QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import {
  missionTimeEntriesFilter,
  operationFilter,
  revenueFilter,
} from "./query-invalidation";

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

/**
 * Pins revenueFilter to the real generated query keys, so a regeneration that
 * renames one of the three operations fails here. It cannot catch a *new*
 * revenue read being added without being listed — nothing in the generated
 * surface distinguishes those from showRevenue, which deliberately stays out.
 */
describe("revenueFilter", () => {
  it("matches every revenue read", () => {
    expect(
      revenueFilter().predicate(queryWithKey(listClientRevenueQueryKey())),
    ).toBe(true);
    expect(
      revenueFilter().predicate(
        queryWithKey(
          showClientRevenueQueryKey({ path: { client: "vesterhus" } }),
        ),
      ),
    ).toBe(true);
    expect(
      revenueFilter().predicate(
        queryWithKey(
          showMissionRevenueQueryKey({
            path: { client: "vesterhus", mission: "refonte" },
          }),
        ),
      ),
    ).toBe(true);
  });

  it("leaves the other invoice reads alone", () => {
    expect(
      revenueFilter().predicate(queryWithKey(showInvoiceSummaryQueryKey())),
    ).toBe(false);
  });
});

describe("missionTimeEntriesFilter", () => {
  it("matches a mission's entry history whichever mission it was fetched for", () => {
    expect(
      missionTimeEntriesFilter().predicate(
        queryWithKey(
          listMissionTimeEntriesQueryKey({
            path: { client: "vesterhus", mission: "refonte" },
          }),
        ),
      ),
    ).toBe(true);
  });

  it("leaves the week's own entry list alone", () => {
    expect(
      missionTimeEntriesFilter().predicate(
        queryWithKey(
          listTimeEntriesQueryKey({
            query: { from: "2026-08-03", to: "2026-08-09" },
          }),
        ),
      ),
    ).toBe(false);
  });
});

/**
 * `invalidateInvoiceWrites` invalidates the invoice list by its bare key rather
 * than a filter, which only reaches the client and mission fiches because the
 * cache matches keys partially. That is the property it leans on.
 */
describe("the bare listInvoices key", () => {
  it("reaches every parameterisation of the list", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(listInvoicesQueryKey(), { invoices: [] });
    queryClient.setQueryData(listInvoicesQueryKey({ query: { clientId: 3 } }), {
      invoices: [],
    });
    queryClient.setQueryData(
      listInvoicesQueryKey({ query: { missionId: 10 } }),
      {
        invoices: [],
      },
    );
    queryClient.setQueryData(showInvoiceSummaryQueryKey(), {});

    expect(
      queryClient.getQueryCache().findAll({ queryKey: listInvoicesQueryKey() }),
    ).toHaveLength(3);
  });
});
