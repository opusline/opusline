import { parisToday } from "../../support/dates";
import { byTestId } from "../../support/locators";
import {
  createBillableClient,
  fillInvoicingIdentity,
  issueInvoice,
  joinInvoicingBeta,
} from "../../support/provision";
import { expect, test } from "../../support/test";

test("a credit note on a paid invoice is refunded, then marked refunded", async ({
  page,
  api,
  account: _registered,
}) => {
  await joinInvoicingBeta(api);
  await fillInvoicingIdentity(api);
  const client = await createBillableClient(api, { name: "Vesterhus" });
  const issued = await issueInvoice(api, client);
  await api.post(`/api/invoices/${issued.invoice.id}/pay`, {
    paidOn: parisToday(),
  });

  await page.goto(`/invoicing/invoices/${issued.invoice.id}`);
  await page.getByTestId("document-credit-note").click();
  await byTestId(page, "document-credit-note-item", {
    action: "partial",
  }).click();
  await page.getByTestId("credit-note-take-line").first().click();
  await page.getByTestId("credit-note-line-quantity").fill("1");
  await byTestId(page, "credit-note-reason", { reason: 2 }).click();
  await byTestId(page, "credit-note-settlement", { settlement: "refund" }).click();
  await page.getByTestId("credit-note-issue").click();

  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+$/);
  const row = page.getByTestId("credit-note-row");
  await expect(row).toHaveAttribute("data-status", "issued");
  await expect(row).toHaveAttribute("data-settlement", "refund");

  await page.getByTestId("credit-note-mark-refunded").click();

  await expect(row).toHaveAttribute("data-status", "settled");
  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "paid",
  );
});
