import { midLastMonth, parisYesterday } from "../../support/dates";
import { byTestId } from "../../support/locators";
import {
  addInvoice,
  createClient,
  INVOICE_STATUS_SENT,
} from "../../support/provision";
import { bankStatementCsv } from "../../support/statements";
import { expect, test } from "../../support/test";

const REFERENCE = "2026-036";

test("an imported payment is matched to its invoice, and validating it marks the invoice paid", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Vesterhus" });
  await addInvoice(api, {
    clientId: client.id,
    number: REFERENCE,
    status: INVOICE_STATUS_SENT,
    issuedOn: midLastMonth(),
    amountHt: { amount: 122_400, currency: "EUR" },
  });

  await page.goto("/bank-account");
  await page.getByTestId("bank-import-open").click();

  await page.getByTestId("bank-import-file").setInputFiles(
    bankStatementCsv("releve.csv", [
      {
        bookedOn: parisYesterday(),
        label: `VIR VESTERHUS FACT ${REFERENCE}`,
        amount: "1224.00",
      },
    ]),
  );
  await page.getByTestId("bank-import-balance").fill("5000");
  await page.getByTestId("bank-import-submit").click();
  await expect(page.getByTestId("bank-import-dialog")).toBeHidden();

  const reconciliation = page.getByTestId("bank-reconciliation");
  await expect(reconciliation).toHaveAttribute("data-state", "to-validate");
  await byTestId(reconciliation, "bank-match", { reference: REFERENCE })
    .getByTestId("bank-match-validate")
    .click();
  await expect(reconciliation).toHaveAttribute("data-state", "reconciled");

  await page.goto("/invoices");
  await expect(
    byTestId(page, "invoice-row", { reference: REFERENCE }),
  ).toHaveAttribute("data-status", "paid");
});
