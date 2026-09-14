import type { InvoiceData } from "@opusline/api-client";
import { expect, it } from "vitest";

import { INVOICE_FIXTURE } from "@/test/fixtures";

import { invoiceRowDetail } from "./labels";

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
