import { expect, test } from "../../support/test";

test("the trade name is saved with the identity", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/settings?tab=identite");
  await page.getByLabel("Trade name").fill("Aubrac Conseil");
  await page.getByRole("button", { name: "Save" }).click();
  // The save bar only exists while the form differs from what the server holds.
  await expect(page.getByRole("button", { name: "Save" })).toBeHidden();

  await page.reload();
  await expect(page.getByLabel("Trade name")).toHaveValue("Aubrac Conseil");
});

test("switching the interface to French translates the app for good", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/settings?tab=regional");
  await page.getByLabel("Interface language").selectOption("Français");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByRole("link", { name: /^Semaine/ })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("link", { name: /^Semaine/ })).toBeVisible();
});

test("a business outside France loses the French fiscal screens", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/settings?tab=regional");
  await page.getByLabel("Country of business").selectOption("Belgium");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByRole("link", { name: /^Filings/ })).toBeHidden();

  await page.goto("/revenue");
  await expect(page).toHaveURL(/\/week/);
});

test("a changed password is the one that signs in afterwards", async ({
  page,
  context,
  account,
}) => {
  const newPassword = "staple-battery-correct";

  await page.goto("/settings?tab=securite");
  await page.getByLabel("New password").fill(newPassword);
  await page.getByLabel("Confirm password").fill(newPassword);
  await page.getByRole("button", { name: "Change password" }).click();

  const confirmation = page.getByRole("dialog");
  await confirmation.getByLabel("Password").fill(account.password);
  await confirmation.getByRole("button", { name: "Confirm" }).click();
  await expect(confirmation).toBeHidden();

  await context.clearCookies();
  await page.goto("/login");
  await page.getByLabel("Email address").fill(account.email);
  await page.getByLabel("Password").fill(newPassword);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();

  await expect(page).toHaveURL(/\/week/);
});
