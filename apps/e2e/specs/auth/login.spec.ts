import type { Page } from "@playwright/test";
import type { Account } from "../../support/provision";
import { expect, test } from "../../support/test";

async function signIn(page: Page, account: Account, password: string) {
  await page.getByTestId("login-email").fill(account.email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();
}

test.beforeEach(async ({ account: _registered, context }) => {
  await context.clearCookies();
});

test("the right password opens the week", async ({ page, account }) => {
  await page.goto("/login");
  await signIn(page, account, account.password);

  await expect(page).toHaveURL(/\/week/);
  await expect(page.getByTestId("account-menu")).toContainText(account.email);
});

test("a wrong password is refused on the login screen", async ({
  page,
  account,
}) => {
  await page.goto("/login");
  await signIn(page, account, `${account.password}-wrong`);

  await expect(page.getByTestId("login-email-error")).toBeVisible();
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
  await expect(page.getByTestId("page-heading")).toBeVisible();
});
