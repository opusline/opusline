import type { InvoiceDetailData } from "@opusline/api-client";

import { byTestId } from "../../support/locators";
import {
  createBillableClient,
  fillInvoicingIdentity,
  issueInvoice,
  joinInvoicingBeta,
} from "../../support/provision";
import { expect, test } from "../../support/test";

test.beforeEach(async ({ api, account: _registered }) => {
  await joinInvoicingBeta(api);
  await fillInvoicingIdentity(api);
});

test("a partial credit note lowers what an unpaid invoice asks", async ({
  page,
  api,
}) => {
  const client = await createBillableClient(api, { name: "Nordlys" });
  const issued = await issueInvoice(api, client);
  const due = issued.invoice.amountDue.amount;

  await page.goto(`/invoicing/invoices/${issued.invoice.id}`);
  await page.getByTestId("document-credit-note").click();
  await byTestId(page, "document-credit-note-item", {
    action: "partial",
  }).click();
  await expect(page).toHaveURL(/\/credit-note/);

  await page.getByTestId("credit-note-take-line").first().click();
  await page.getByTestId("credit-note-line-price").fill("100");
  await byTestId(page, "credit-note-reason", { reason: 2 }).click();
  await expect(page.getByTestId("credit-note-total")).toBeVisible();
  await page.getByTestId("credit-note-issue").click();

  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+$/);
  await expect(page.getByTestId("credit-note-row")).toHaveCount(1);
  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "sent",
  );
  // Both days taken back at 100 € instead of 600 €, no VAT: 200 € off.
  const credited = await api.get<InvoiceDetailData>(
    `/api/invoices/${issued.invoice.id}`,
  );
  expect(credited.invoice.amountDue.amount).toBe(due - 20_000);
});

test("cancelling an invoice by a credit note leaves nothing to collect", async ({
  page,
  api,
}) => {
  const client = await createBillableClient(api, { name: "Callisto" });
  const issued = await issueInvoice(api, client);

  await page.goto(`/invoicing/invoices/${issued.invoice.id}`);
  await page.getByTestId("document-credit-note").click();
  await byTestId(page, "document-credit-note-item", {
    action: "cancel",
  }).click();
  await byTestId(page, "credit-note-reason", { reason: 1 }).click();
  await page.getByTestId("credit-note-issue").click();

  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "cancelled",
  );
  await expect(
    byTestId(page, "credit-note-row", { settlement: "cancels" }),
  ).toBeVisible();
  await expect(page.getByTestId("document-collect")).toBeHidden();
  await expect(page.getByTestId("document-credit-note")).toBeHidden();
});
