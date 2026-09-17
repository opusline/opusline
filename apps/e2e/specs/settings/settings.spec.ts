import { byTestId } from "../../support/locators";
import { expect, test } from "../../support/test";

const LOCALE_FRENCH = "fr-FR";
const COUNTRY_BELGIUM = "BE";

test("the trade name is saved with the identity", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/settings?tab=identite");
  await page.getByTestId("settings-trade-name").fill("Aubrac Conseil");
  await page.getByTestId("settings-save").click();
  // The save bar only exists while the form differs from what the server holds.
  await expect(page.getByTestId("settings-save")).toBeHidden();

  await page.reload();
  await expect(page.getByTestId("settings-trade-name")).toHaveValue(
    "Aubrac Conseil",
  );
});

test("switching the interface to French translates the app for good", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/settings?tab=regional");
  await page.getByTestId("settings-language").selectOption(LOCALE_FRENCH);
  await page.getByTestId("settings-save").click();

  await expect(page.locator("html")).toHaveAttribute("lang", "fr");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.getByTestId("settings-language")).toHaveValue(
    LOCALE_FRENCH,
  );
});

test("a business outside France loses the French fiscal screens", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/settings?tab=regional");
  await expect(
    byTestId(page, "nav-link", { route: "/declarations" }),
  ).toBeVisible();

  await page.getByTestId("settings-country").selectOption(COUNTRY_BELGIUM);
  await page.getByTestId("settings-save").click();

  await expect(
    byTestId(page, "nav-link", { route: "/declarations" }),
  ).toBeHidden();

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
  await page.getByTestId("settings-new-password").fill(newPassword);
  await page.getByTestId("settings-confirm-password").fill(newPassword);
  await page.getByTestId("settings-change-password").click();

  await page.getByTestId("confirm-password-input").fill(account.password);
  await page.getByTestId("confirm-password-submit").click();
  await expect(page.getByTestId("confirm-password-form")).toBeHidden();

  await context.clearCookies();
  await page.goto("/login");
  await page.getByTestId("login-email").fill(account.email);
  await page.getByTestId("login-password").fill(newPassword);
  await page.getByTestId("login-submit").click();

  await expect(page).toHaveURL(/\/week/);
});
