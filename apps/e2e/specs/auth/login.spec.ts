import type { Page } from "@playwright/test";
import type { Account } from "../../support/provision";
import { expect, test } from "../../support/test";

async function signIn(page: Page, account: Account, password: string) {
  await page.getByLabel("Email address").fill(account.email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
}

test.beforeEach(async ({ account: _registered, context }) => {
  await context.clearCookies();
});

test("the right password opens the week", async ({ page, account }) => {
  await page.goto("/login");
  await signIn(page, account, account.password);

  await expect(page).toHaveURL(/\/week/);
  await expect(page.getByRole("heading", { name: "Week" })).toBeVisible();
});

test("a wrong password is refused on the login screen", async ({
  page,
  account,
}) => {
  await page.goto("/login");
  await signIn(page, account, `${account.password}-wrong`);

  await expect(page.getByRole("alert")).toContainText(
    "These credentials do not match our records.",
  );
  await expect(page).toHaveURL(/\/login/);
});

test("a deep link survives the detour through the login screen", async ({
  page,
  account,
}) => {
  await page.goto("/clients");
  await expect(page).toHaveURL(/\/login\?redirect=/);

  await signIn(page, account, account.password);

  await expect(page).toHaveURL(/\/clients$/);
  await expect(page.getByRole("heading", { name: "Clients" })).toBeVisible();
});
