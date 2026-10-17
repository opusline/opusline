import { byTestId } from "../../support/locators";
import { emailCountFor } from "../../support/mailbox";
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

test("an invoice is e-mailed to the client with its PDF, and the history says so", async ({
  page,
  api,
  request,
  account,
}) => {
  const client = await createBillableClient(api, {
    name: "Nordlys",
    billingEmail: "compta@nordlys.test",
  });
  const issued = await issueInvoice(api, client);

  await page.goto(`/invoicing/invoices/${issued.invoice.id}`);
  const before = await emailCountFor(request, "compta@nordlys.test");
  const copies = await emailCountFor(request, account.email);

  await page.getByTestId("document-send").click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+\/send$/);
  await expect(
    byTestId(page, "send-recipient", { address: "compta@nordlys.test" }),
  ).toHaveAttribute("data-checked", "true");

  await page.getByTestId("send-add-address").fill("sophie@nordlys.test");
  await page.getByTestId("send-add-address-submit").click();
  await page.getByTestId("send-copy-me").click();
  await expect(page.getByTestId("send-preview")).toBeVisible();

  const sent = page.waitForResponse(
    (response) =>
      response
        .url()
        .endsWith(`/api/invoicing/invoices/${issued.invoice.id}/email`) &&
      response.request().method() === "POST",
  );
  await page.getByTestId("send-submit").click();
  expect((await sent).status()).toBe(201);
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+$/);
  await expect(
    byTestId(page, "invoice-history-item", { event: "emailed" }),
  ).toBeVisible();

  await expect
    .poll(() => emailCountFor(request, "compta@nordlys.test"), {
      timeout: 30_000,
    })
    .toBe(before + 1);
  await expect
    .poll(() => emailCountFor(request, account.email), { timeout: 30_000 })
    .toBe(copies + 1);
});
