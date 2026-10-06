import { byTestId } from "../../support/locators";
import { emailCountFor } from "../../support/mailbox";
import { signIn } from "../../support/sign-in";
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

test("an email preference turned off stays off", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/settings?tab=notifications");
  await expect(
    byTestId(page, "notifications-deadline-reminders", { enabled: "true" }),
  ).toBeVisible();

  await page.getByTestId("notifications-deadline-reminders").click();
  await expect(
    byTestId(page, "notifications-deadline-reminders", { enabled: "false" }),
  ).toBeVisible();

  await page.reload();
  await expect(
    byTestId(page, "notifications-deadline-reminders", { enabled: "false" }),
  ).toBeVisible();
  await expect(
    byTestId(page, "notifications-security-alerts", { enabled: "true" }),
  ).toBeVisible();
});

test("a mail test arrives twice: once directly, once through the queue", async ({
  page,
  request,
  account,
}) => {
  await page.goto("/settings?tab=notifications");
  await page.getByTestId("mail-delivery-send-test").click();
  await expect(page.getByTestId("mail-delivery-test-sent")).toBeVisible();

  await expect
    .poll(() => emailCountFor(request, account.email), { timeout: 30_000 })
    .toBe(2);
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
  await signIn(page, account.email, newPassword);

  await expect(page).toHaveURL(/\/week/);
});

test("a changed email is the one that signs in afterwards", async ({
  page,
  context,
  account,
}) => {
  const newEmail = `changed-${account.email}`;

  await page.goto("/settings?tab=securite");
  await page.getByTestId("settings-new-email").fill(newEmail);
  await page.getByTestId("settings-change-email").click();

  await page.getByTestId("confirm-password-input").fill(account.password);
  await page.getByTestId("confirm-password-submit").click();
  await expect(page.getByTestId("confirm-password-form")).toBeHidden();
  // The field empties only once the API has accepted the new address.
  await expect(page.getByTestId("settings-new-email")).toHaveValue("");

  await context.clearCookies();
  await page.goto("/login");
  await page.getByTestId("login-email").fill(newEmail);
  await page.getByTestId("login-password").fill(account.password);
  await page.getByTestId("login-submit").click();

  await expect(page).toHaveURL(/\/week/);
});
