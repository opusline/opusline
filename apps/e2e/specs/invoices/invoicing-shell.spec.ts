import { byTestId } from "../../support/locators";
import { joinInvoicingBeta } from "../../support/provision";
import { expect, test } from "../../support/test";

test.beforeEach(async ({ api, account: _registered }) => {
  await joinInvoicingBeta(api);
});

test("the Facturation section has its own navigation and a way back", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/week");
  await byTestId(page, "nav-link", { route: "/invoicing/invoices" }).click();
  await expect(page).toHaveURL(/\/invoicing\/invoices$/);

  await byTestId(page, "invoicing-nav-link", {
    route: "/invoicing/settings",
  }).click();
  await expect(page).toHaveURL(/\/invoicing\/settings$/);

  await page.getByTestId("invoicing-exit").click();
  await expect(page).toHaveURL(/\/week/);
});

test("the old invoices address still opens the list", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/invoices");

  await expect(page).toHaveURL(/\/invoicing\/invoices$/);
});

test("the New menu records an invoice issued elsewhere", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/invoicing/invoices");
  await page.getByTestId("invoicing-new").click();
  await byTestId(page, "invoicing-new-item", {
    kind: "external-invoice",
  }).click();

  await expect(page.getByTestId("invoice-add-dialog")).toBeVisible();
});
