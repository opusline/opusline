import type { Page } from "@playwright/test";
import { resetPathEmailedTo } from "../../support/mailbox";
import { signIn } from "../../support/sign-in";
import { expect, test } from "../../support/test";

const NEW_PASSWORD = "a-password-chosen-by-email";

async function requestResetLink(page: Page, email: string) {
  await page.getByTestId("forgot-password-email").fill(email);
  await page.getByTestId("forgot-password-submit").click();
  await expect(page.getByTestId("forgot-password-sent")).toBeVisible();
}

async function chooseNewPassword(page: Page, password: string) {
  await page.getByTestId("reset-password-new").fill(password);
  await page.getByTestId("reset-password-confirmation").fill(password);
  await page.getByTestId("reset-password-submit").click();
}

test.beforeEach(async ({ account: _registered, context }) => {
  await context.clearCookies();
});

test("a forgotten password is replaced through the emailed link", async ({
  page,
  request,
  account,
}) => {
  await page.goto("/login");
  await page.getByTestId("login-forgot-password").click();
  await requestResetLink(page, account.email);

  await page.goto(await resetPathEmailedTo(request, account.email));
  await chooseNewPassword(page, NEW_PASSWORD);
  await expect(page.getByTestId("reset-password-done")).toBeVisible();

  await page.getByTestId("reset-password-sign-in").click();
  await signIn(page, account.email, NEW_PASSWORD);

  await expect(page).toHaveURL(/\/week/);
});

test("a reset link works only once", async ({ page, request, account }) => {
  await page.goto("/forgot-password");
  await requestResetLink(page, account.email);
  const resetPath = await resetPathEmailedTo(request, account.email);

  await page.goto(resetPath);
  await chooseNewPassword(page, NEW_PASSWORD);
  await expect(page.getByTestId("reset-password-done")).toBeVisible();

  await page.goto(resetPath);
  await chooseNewPassword(page, `${NEW_PASSWORD}-again`);

  await expect(page.getByTestId("reset-password-error")).toBeVisible();
});
