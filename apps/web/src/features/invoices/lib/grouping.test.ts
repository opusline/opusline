import { describe, expect, it } from "vitest";

import { clientTotals, invoiceItem, secondClient } from "./fixtures";
import { countByScope, groupByClient, matchesScope } from "./grouping";

const draft = invoiceItem({ id: 1, status: 0 });
const open = invoiceItem({ id: 2, status: 1, isLate: false });
const late = invoiceItem({ id: 3, status: 1, isLate: true });
const paid = invoiceItem(
  { id: 4, status: 2, issuedOn: "2026-07-01", paidOn: "2026-07-21" },
  { client: secondClient, mission: null },
);

const items = [draft, open, late, paid];

describe("matchesScope", () => {
  it("counts an overdue invoice as open and as late", () => {
    expect(matchesScope(late, "open")).toBe(true);
    expect(matchesScope(late, "late")).toBe(true);
  });

  it("keeps a punctual open invoice out of the late scope", () => {
    expect(matchesScope(open, "late")).toBe(false);
  });
});

describe("countByScope", () => {
  it("counts the overlapping scopes in one pass", () => {
    expect(countByScope(items)).toEqual({
      all: 4,
      open: 2,
      late: 1,
      paid: 1,
      draft: 1,
    });
  });
});

describe("groupByClient", () => {
  const totals = [
    clientTotals(1, {
      all: { amount: 111_000, currency: "EUR" },
      open: { amount: 90_000, currency: "EUR" },
    }),
    clientTotals(2, {
      all: { amount: 300_000, currency: "EUR" },
      paid: { amount: 300_000, currency: "EUR" },
    }),
  ];

  it("groups rows by client, ordered by name", () => {
    const groups = groupByClient(items, totals, "all");

    expect(groups.map((group) => group.client.name)).toEqual([
      "HartPrint",
      "OGF",
    ]);
    expect(groups[0]?.items).toHaveLength(3);
    expect(groups[1]?.items).toHaveLength(1);
  });

  it("reads the total for the shown scope from the API verbatim", () => {
    const groups = groupByClient(items, totals, "open");

    // The frontend never sums money: 90 000 is the API's figure, not a re-addition.
    expect(groups[0]?.total).toBe(90_000);
  });

  it("derives the average days to pay from the paid rows", () => {
    const groups = groupByClient([paid], totals, "paid");

    expect(groups[0]?.averageDaysToPay).toBe(20);
  });
});
