import type { InvoiceDetailData } from "@opusline/api-client";

import { parisToday } from "../../support/dates";
import { byTestId } from "../../support/locators";
import { emailCountFor } from "../../support/mailbox";
import {
  createBillableClient,
  fillInvoicingIdentity,
  issueQuote,
  joinInvoicingBeta,
} from "../../support/provision";
import { bankStatementCsv } from "../../support/statements";
import { expect, test } from "../../support/test";

// issueQuote prices two days at 600 € with no VAT: the TTC is the HT.
const QUOTE_TTC_CENTS = 120_000;
const DEPOSIT_RATE_BP = 3_000;
const DEPOSIT_CENTS = 36_000;
const CREDITED_CENTS = 10_000;

function invoiceIdIn(url: string): string {
  const id = url.match(/\/invoicing\/invoices\/(\d+)/)?.[1];

  if (id === undefined) {
    throw new Error(`No invoice id in ${url}`);
  }

  return id;
}

test("a quote becomes a paid deposit, a balance invoice e-mailed and reminded, then credited", async ({
  page,
  api,
  request,
  account: _registered,
}) => {
  await joinInvoicingBeta(api);
  await fillInvoicingIdentity(api);
  const client = await createBillableClient(api, {
    name: "Ateliers Ruche",
    billingEmail: "compta@ateliers-ruche.test",
  });
  const { quote } = await issueQuote(api, client, {
    depositRateBp: DEPOSIT_RATE_BP,
  });

  await page.goto(`/invoicing/quotes/${quote.id}`);
  await page.getByTestId("quote-accept").click();
  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "accepted",
  );

  await page.getByTestId("quote-invoice-deposit").click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+\/edit$/);
  await page.getByTestId("editor-validate").click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+$/);
  await expect(page.getByTestId("document-amount")).toHaveAttribute(
    "data-amount-cents",
    String(DEPOSIT_CENTS),
  );
  const depositNumber = await page
    .getByTestId("page-heading")
    .getAttribute("data-reference");
  expect(depositNumber).toBeTruthy();

  await page.goto("/bank-account");
  await page.getByTestId("bank-import-open").click();
  await page.getByTestId("bank-import-file").setInputFiles(
    bankStatementCsv("releve.csv", [
      {
        bookedOn: parisToday(),
        label: `VIR ATELIERS RUCHE ACOMPTE ${depositNumber}`,
        amount: (DEPOSIT_CENTS / 100).toFixed(2),
      },
    ]),
  );
  await page.getByTestId("bank-import-balance").fill("5000");
  await page.getByTestId("bank-import-submit").click();
  await expect(page.getByTestId("bank-import-dialog")).toBeHidden();
  const reconciliation = page.getByTestId("bank-reconciliation");
  await byTestId(reconciliation, "bank-match", {
    reference: depositNumber ?? "",
  })
    .getByTestId("bank-match-validate")
    .click();
  await expect(reconciliation).toHaveAttribute("data-state", "reconciled");

  await page.goto(`/invoicing/quotes/${quote.id}`);
  await page.getByTestId("quote-invoice-balance").click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+\/edit$/);
  await page.getByTestId("editor-validate").click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+$/);
  const balanceId = invoiceIdIn(page.url());
  await expect(page.getByTestId("document-amount")).toHaveAttribute(
    "data-amount-cents",
    String(QUOTE_TTC_CENTS - DEPOSIT_CENTS),
  );

  const before = await emailCountFor(request, "compta@ateliers-ruche.test");
  await page.getByTestId("document-send").click();
  await page.getByTestId("send-submit").click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+$/);
  // The e-mail leaves through the queue: count it once it has landed, or the
  // reminder's arrival would be mistaken for it.
  await expect
    .poll(() => emailCountFor(request, "compta@ateliers-ruche.test"), {
      timeout: 30_000,
    })
    .toBe(before + 1);

  await page.getByTestId("invoice-reminders-toggle").click();
  await page.getByTestId("invoice-remind-now").click();
  await expect(
    byTestId(page, "invoice-history-item", { event: "reminded" }),
  ).toBeVisible();
  await expect
    .poll(() => emailCountFor(request, "compta@ateliers-ruche.test"), {
      timeout: 30_000,
    })
    .toBe(before + 2);

  await page.getByTestId("document-credit-note").click();
  await byTestId(page, "document-credit-note-item", {
    action: "partial",
  }).click();
  await page.getByTestId("credit-note-free-line").click();
  await page.getByTestId("credit-note-line-label").fill("Geste commercial");
  await page.getByTestId("credit-note-line-price").fill("100");
  await byTestId(page, "credit-note-reason", { reason: 2 }).click();
  await page.getByTestId("credit-note-issue").click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+$/);
  await expect(page.getByTestId("credit-note-row")).toHaveCount(1);

  const credited = await api.get<InvoiceDetailData>(
    `/api/invoices/${balanceId}`,
  );
  expect(credited.invoice.amountDue.amount).toBe(
    QUOTE_TTC_CENTS - DEPOSIT_CENTS - CREDITED_CENTS,
  );
});
