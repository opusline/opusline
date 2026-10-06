import { signIn } from "../../support/sign-in";
import { expect, test } from "../../support/test";

test.beforeEach(async ({ account: _registered, context }) => {
  await context.clearCookies();
});

test("the right password opens the week", async ({ page, account }) => {
  await page.goto("/login");
  await signIn(page, account.email, account.password);

  await expect(page).toHaveURL(/\/week/);
  await expect(page.getByTestId("account-menu")).toContainText(account.email);
});

test("a wrong password is refused on the login screen", async ({
  page,
  account,
}) => {
  await page.goto("/login");
  await signIn(page, account.email, `${account.password}-wrong`);

  await expect(page.getByTestId("login-email-error")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test("a deep link survives the detour through the login screen", async ({
  page,
  account,
}) => {
  await page.goto("/clients");
  await expect(page).toHaveURL(/\/login\?redirect=/);

  await signIn(page, account.email, account.password);

  await expect(page).toHaveURL(/\/clients$/);
  await expect(page.getByTestId("page-heading")).toBeVisible();
});
