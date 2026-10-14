import { byTestId } from "../../support/locators";
import { expect, test } from "../../support/test";

test("invoicing stays hidden until the account joins its beta", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/invoicing/catalog");
  await expect(page).toHaveURL(/\/invoicing\/invoices$/);
  await expect(page.getByTestId("invoice-add-open")).toBeVisible();
  await expect(page.getByTestId("invoicing-beta")).toHaveCount(0);

  await page.goto("/settings?tab=beta");
  const invoicing = byTestId(page, "beta-feature-switch", {
    feature: "invoicing",
  });
  await expect(invoicing).toHaveAttribute("data-active", "false");
  await invoicing.click();
  await expect(invoicing).toHaveAttribute("data-active", "true");

  await page.goto("/invoicing/catalog");
  await expect(page).toHaveURL(/\/invoicing\/catalog$/);
  await expect(page.getByTestId("invoicing-beta")).toBeVisible();
});
