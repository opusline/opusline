import type { InvoiceData } from "@opusline/api-client";
import { expect, it } from "vitest";

import { INVOICE_FIXTURE } from "@/test/fixtures";

import { averageDaysToPay, invoiceRowDetail } from "./labels";

const TODAY = "2026-08-20";

function invoice(overrides: Partial<InvoiceData> = {}): InvoiceData {
  return { ...INVOICE_FIXTURE, ...overrides };
}

function detail(overrides: Partial<InvoiceData> = {}): string {
  return invoiceRowDetail("fr-FR", 0, invoice(overrides), TODAY);
}

it("counts lateness against the account's today, not the browser's", () => {
  expect(detail({ isLate: true, dueOn: "2026-08-15" })).toContain("5 j");
});

it("says how fast a paid invoice was paid", () => {
  expect(
    detail({ status: 2, paidOn: "2026-07-21", issuedOn: "2026-07-01" }),
  ).toContain("20 j");
});

it("marks a draft as one rather than dating it", () => {
  const line = detail({ status: 0 });

  expect(line).not.toContain("15/08/2026");
});

it("dates an open invoice in the account's layout", () => {
  expect(detail()).toContain("15/08/2026");
  expect(invoiceRowDetail("fr-FR", 1, invoice(), TODAY)).toContain(
    "2026-08-15",
  );
});

it("averages only the invoices that were actually paid", () => {
  const average = averageDaysToPay([
    invoice({ id: 1, status: 2, issuedOn: "2026-07-01", paidOn: "2026-07-11" }),
    invoice({ id: 2, status: 2, issuedOn: "2026-07-01", paidOn: "2026-07-31" }),
    // A draft carrying a payment date is not a payment.
    invoice({ id: 3, status: 0, issuedOn: "2026-07-01", paidOn: "2026-07-02" }),
    invoice({ id: 4, status: 1, paidOn: null }),
  ]);

  expect(average).toBe(20);
});

it("has no average until something has been paid", () => {
  expect(averageDaysToPay([invoice({ paidOn: null })])).toBeNull();
  expect(averageDaysToPay([])).toBeNull();
});
