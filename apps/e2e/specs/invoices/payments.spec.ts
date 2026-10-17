import { parisToday } from "../../support/dates";
import {
  addInvoice,
  createClient,
  INVOICE_STATUS_SENT,
  joinInvoicingBeta,
} from "../../support/provision";
import { expect, test } from "../../support/test";

// A fresh account is under the franchise: the TTC is the HT.
const INVOICE_HT_CENTS = 100_000;
const DEPOSIT_CENTS = 60_000;

test("an invoice paid in two transfers, the first one taken back", async ({
  page,
  api,
  account: _registered,
}) => {
  await joinInvoicingBeta(api);
  const client = await createClient(api, { name: "Nordlys" });
  const invoice = await addInvoice(api, {
    clientId: client.id,
    number: "2026-040",
    status: INVOICE_STATUS_SENT,
    issuedOn: parisToday(),
    amountHt: { amount: INVOICE_HT_CENTS, currency: "EUR" },
  });

  await page.goto(`/invoicing/invoices/${invoice.id}`);
  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "sent",
  );

  await page.getByTestId("invoice-amount-received").fill("600");
  await page.getByTestId("invoice-mark-collected").click();

  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "partial",
  );
  await expect(page.getByTestId("invoice-balance-due")).toHaveAttribute(
    "data-amount-cents",
    String(INVOICE_HT_CENTS - DEPOSIT_CENTS),
  );
  await expect(page.getByTestId("invoice-payment")).toHaveCount(1);

  // The amount field now opens on the balance: the next click settles it.
  await page.getByTestId("invoice-mark-collected").click();

  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "paid",
  );
  await expect(page.getByTestId("invoice-payment")).toHaveCount(2);

  await page.getByTestId("invoice-payment-remove").last().click();
  await page.getByTestId("invoice-payment-remove-confirm").click();

  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "partial",
  );
  await expect(page.getByTestId("invoice-payment")).toHaveCount(1);
});
