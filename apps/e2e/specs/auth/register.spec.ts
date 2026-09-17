import { newAccount } from "../../support/provision";
import { expect, test } from "../../support/test";

test("a visitor who registers lands on an empty week, signed in", async ({
  page,
}) => {
  const account = newAccount();

  await page.goto("/register");
  await page.getByLabel("Name").fill(account.name);
  await page.getByLabel("Email address").fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByLabel("Confirm password").fill(account.password);
  await page.getByRole("button", { name: "Create the account" }).click();

  await expect(page).toHaveURL(/\/week/);
  await expect(page.getByText("Nothing to track yet")).toBeVisible();
  await expect(page.getByRole("button", { name: account.email })).toBeVisible();
});

test("a mistyped password confirmation keeps the visitor on the form", async ({
  page,
}) => {
  const account = newAccount();

  await page.goto("/register");
  await page.getByLabel("Name").fill(account.name);
  await page.getByLabel("Email address").fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByLabel("Confirm password").fill(`${account.password}-typo`);
  await page.getByRole("button", { name: "Create the account" }).click();

  await expect(page.getByText("The passwords do not match.")).toBeVisible();
  await expect(page).toHaveURL(/\/register/);
});
