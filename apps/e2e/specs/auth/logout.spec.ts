import { expect, test } from "../../support/test";

test("logging out closes the session", async ({ page, account }) => {
  await page.goto("/week");
  await page.getByRole("button", { name: account.email }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();

  await expect(page).toHaveURL(/\/login/);

  await page.goto("/week");
  await expect(page).toHaveURL(/\/login\?redirect=/);
});
