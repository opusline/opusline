import {
  createBillableClient,
  fillInvoicingIdentity,
  issueInvoice,
  joinInvoicingBeta,
} from "../../support/provision";
import { expect, test } from "../../support/test";

// issueInvoice bills two days at 600 € with no VAT: the TTC is the HT.
const INVOICE_TTC_CENTS = 120_000;
const DEPOSIT_CENTS = 60_000;

test("an invoice paid in two transfers, the second one taken back", async ({
  page,
  api,
  account: _registered,
}) => {
  await joinInvoicingBeta(api);
  await fillInvoicingIdentity(api);
  const client = await createBillableClient(api, { name: "Nordlys" });
  const issued = await issueInvoice(api, client);

  // The document page is the one an invoice written in Opusline opens on.
  await page.goto(`/invoicing/invoices/${issued.invoice.id}`);
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
    String(INVOICE_TTC_CENTS - DEPOSIT_CENTS),
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
