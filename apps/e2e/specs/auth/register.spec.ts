import { newAccount } from "../../support/provision";
import { expect, test } from "../../support/test";

test("a visitor who registers lands on an empty week, signed in", async ({
  page,
}) => {
  const account = newAccount();

  await page.goto("/register");
  await page.getByTestId("register-name").fill(account.name);
  await page.getByTestId("register-email").fill(account.email);
  await page.getByTestId("register-password").fill(account.password);
  await page
    .getByTestId("register-password-confirmation")
    .fill(account.password);
  await page.getByTestId("register-submit").click();

  await expect(page).toHaveURL(/\/week/);
  await expect(page.getByTestId("week-missions-empty")).toBeVisible();
  await expect(page.getByTestId("account-menu")).toContainText(account.email);
});

test("a mistyped password confirmation keeps the visitor on the form", async ({
  page,
}) => {
  const account = newAccount();

  await page.goto("/register");
  await page.getByTestId("register-name").fill(account.name);
  await page.getByTestId("register-email").fill(account.email);
  await page.getByTestId("register-password").fill(account.password);
  await page
    .getByTestId("register-password-confirmation")
    .fill(`${account.password}-typo`);
  await page.getByTestId("register-submit").click();

  await expect(
    page.getByTestId("register-password-confirmation-error"),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/register/);
});
