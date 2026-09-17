import { midLastMonth, parisYesterday } from "../../support/dates";
import {
  addInvoice,
  createClient,
  INVOICE_STATUS_SENT,
} from "../../support/provision";
import { bankStatementCsv } from "../../support/statements";
import { expect, test } from "../../support/test";

test("an imported payment is matched to its invoice, and validating it marks the invoice paid", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Vesterhus" });
  await addInvoice(api, {
    clientId: client.id,
    number: "2026-036",
    status: INVOICE_STATUS_SENT,
    issuedOn: midLastMonth(),
    amountHt: { amount: 122_400, currency: "EUR" },
  });

  await page.goto("/bank-account");
  await page
    .getByRole("button", { name: "Import a statement" })
    .first()
    .click();

  const dialog = page.getByRole("dialog", { name: "Import a statement" });
  await dialog.locator('input[type="file"]').setInputFiles(
    bankStatementCsv("releve.csv", [
      {
        bookedOn: parisYesterday(),
        label: "VIR VESTERHUS FACT 2026-036",
        amount: "1224.00",
      },
    ]),
  );
  await dialog
    .getByLabel("Business account balance at the statement date")
    .fill("5000");
  await dialog.getByRole("button", { name: "Analyse the statement" }).click();
  await expect(dialog).toBeHidden();

  const reconciliation = page.getByRole("region", { name: "Reconciliation" });
  await expect(reconciliation).toContainText("2026-036");
  await reconciliation
    .getByRole("button", { name: "Validate", exact: true })
    .click();
  await expect(reconciliation).toContainText("Everything is reconciled");

  await page.goto("/invoices");
  await expect(page.getByRole("button", { name: "Paid (1)" })).toBeVisible();
});
