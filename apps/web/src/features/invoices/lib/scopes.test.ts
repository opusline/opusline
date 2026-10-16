import { expect, it } from "vitest";

import { quoteItem } from "./quote-fixtures";
import { countByQuoteScope, matchesQuoteSearch } from "./scopes";

it("partitions the sent quotes between open and expired", () => {
  const counts = countByQuoteScope([
    quoteItem(),
    quoteItem({ id: 2, isExpired: true }),
    quoteItem({ id: 3, status: 0, number: null }),
    quoteItem({ id: 4, status: 2 }),
    quoteItem({ id: 5, status: 3 }),
  ]);

  expect(counts).toEqual({
    all: 5,
    draft: 1,
    open: 1,
    expired: 1,
    accepted: 1,
    refused: 1,
  });
});

it("matches the number, the title and the client, whatever the case", () => {
  const item = quoteItem();

  expect(matchesQuoteSearch(item, "d-2026-003")).toBe(true);
  expect(matchesQuoteSearch(item, "ESPACE")).toBe(true);
  expect(matchesQuoteSearch(item, "vester")).toBe(true);
  expect(matchesQuoteSearch(item, "  ")).toBe(true);
  expect(matchesQuoteSearch(item, "lunaprint")).toBe(false);
});
