import { expect, test } from "../../support/test";

test("a monthly subscription is listed with its yearly cost", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/expenses?tab=subscriptions");
  await expect(page.getByText("No subscriptions")).toBeVisible();

  await page.getByRole("button", { name: "Add a subscription" }).click();
  const dialog = page.getByRole("dialog", { name: "Add a subscription" });
  await dialog.getByLabel("Supplier").fill("Orvella");
  await dialog.getByLabel("HT amount").fill("20");
  await dialog.getByRole("button", { name: "Save" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByRole("main")).toContainText("Orvella");
  await expect(page.getByRole("main")).toContainText("1 monthly subscription");
});
