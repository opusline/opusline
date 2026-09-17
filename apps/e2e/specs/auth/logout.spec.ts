import { expect, test } from "../../support/test";

test("logging out closes the session", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/week");
  await page.getByTestId("account-menu").click();
  await page.getByTestId("account-logout").click();

  await expect(page).toHaveURL(/\/login/);

  await page.goto("/week");
  await expect(page).toHaveURL(/\/login\?redirect=/);
});
