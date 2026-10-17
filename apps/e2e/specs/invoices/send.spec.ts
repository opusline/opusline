import { pdfFile } from "../../support/files";
import { byTestId } from "../../support/locators";
import { emailCountFor } from "../../support/mailbox";
import {
  addInvoice,
  createClient,
  createMission,
  INVOICE_STATUS_SENT,
  joinInvoicingBeta,
} from "../../support/provision";
import { expect, test } from "../../support/test";

test.beforeEach(async ({ api, account: _registered }) => {
  await joinInvoicingBeta(api);
});

test("an invoice is e-mailed to the client with its PDF, and the history says so", async ({
  page,
  api,
  request,
  account,
}) => {
  const client = await createClient(api, {
    name: "Nordlys",
    billingEmail: "compta@nordlys.test",
  });
  const mission = await createMission(api, client, { name: "Refonte du site" });
  const invoice = await addInvoice(api, {
    clientId: client.id,
    missionId: mission.id,
    number: "2026-041",
    status: INVOICE_STATUS_SENT,
    issuedOn: "2026-08-01",
    amountHt: { amount: 120_000, currency: "EUR" },
  });

  // Recorded from another tool: its fiche is the drawer on the list.
  await page.goto(`/invoicing/invoices?invoice=${invoice.id}`);
  await page
    .getByTestId("filed-document-picker")
    .setInputFiles(pdfFile("facture-2026-041.pdf"));
  await expect(page.getByTestId("document-download")).toBeVisible();

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
      response.url().endsWith(`/api/invoicing/invoices/${invoice.id}/email`) &&
      response.request().method() === "POST",
  );
  await page.getByTestId("send-submit").click();
  expect((await sent).status()).toBe(201);
  await expect(page).toHaveURL(/\/invoicing\/invoices\?invoice=\d+$/);
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
