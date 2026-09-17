import { midLastMonth } from "../../support/dates";
import {
  addInvoice,
  createClient,
  INVOICE_STATUS_PAID,
} from "../../support/provision";
import { expect, test } from "../../support/test";

test.beforeEach(async ({ api, account: _registered }) => {
  const client = await createClient(api, { name: "Vesterhus" });
  await addInvoice(api, {
    clientId: client.id,
    number: "2026-036",
    status: INVOICE_STATUS_PAID,
    issuedOn: midLastMonth(),
    paidOn: midLastMonth(),
    amountHt: { amount: 122_400, currency: "EUR" },
  });
});

test("last month's collections are the URSSAF figure to declare", async ({
  page,
}) => {
  await page.goto("/declarations");

  const urssaf = page.getByRole("region", { name: /^URSSAF/ });
  await expect(
    urssaf.getByRole("link", { name: /1 invoice collected/ }),
  ).toContainText("1,224");
});

test("a filing is marked filed, then undone", async ({ page }) => {
  await page.goto("/declarations");

  const urssaf = page.getByRole("region", { name: /^URSSAF/ });
  await urssaf.getByRole("button", { name: "Mark as filed" }).click();
  await expect(urssaf.getByText(/^Filed on/)).toBeVisible();

  await urssaf.getByRole("button", { name: "Undo" }).click();
  await expect(
    urssaf.getByRole("button", { name: "Mark as filed" }),
  ).toBeVisible();
});
