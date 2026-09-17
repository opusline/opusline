import { midLastMonth } from "../../support/dates";
import { byTestId } from "../../support/locators";
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

  const collected = byTestId(page, "declaration-card", {
    kind: "urssaf",
  }).getByTestId("declaration-collected");
  await expect(collected).toHaveAttribute("data-amount-cents", "122400");
  await expect(collected).toHaveAttribute("data-invoice-count", "1");
});

test("a filing is marked filed, then undone", async ({ page }) => {
  await page.goto("/declarations");

  const urssaf = byTestId(page, "declaration-card", { kind: "urssaf" });
  await urssaf.getByTestId("declaration-mark-filed").click();
  await expect(urssaf).toHaveAttribute("data-filed", "true");

  await urssaf.getByTestId("declaration-undo-filed").click();
  await expect(urssaf).toHaveAttribute("data-filed", "false");
  await expect(urssaf.getByTestId("declaration-mark-filed")).toBeVisible();
});
