import { byTestId } from "../../support/locators";
import { expect, test } from "../../support/test";

const PAGE_HEADING = "page-heading";

const screens = [
  { route: "/week", landmark: PAGE_HEADING },
  { route: "/clients", landmark: PAGE_HEADING },
  // The CRA screen titles itself after the open report, and a new account has none.
  { route: "/cra", landmark: "cra-empty" },
  { route: "/invoices", landmark: PAGE_HEADING },
  { route: "/revenue", landmark: PAGE_HEADING },
  { route: "/expenses", landmark: PAGE_HEADING },
  { route: "/treasury", landmark: PAGE_HEADING },
  { route: "/bank-account", landmark: PAGE_HEADING },
  { route: "/deadlines", landmark: PAGE_HEADING },
  { route: "/declarations", landmark: PAGE_HEADING },
  { route: "/documents", landmark: PAGE_HEADING },
  { route: "/settings", landmark: PAGE_HEADING },
];

for (const screen of screens) {
  test(`the ${screen.route} screen renders for a new account`, async ({
    page,
    account: _registered,
  }) => {
    await page.goto("/release-notes");
    await byTestId(page, "nav-link", { route: screen.route }).click();

    await expect(page).toHaveURL(new RegExp(`${screen.route}(\\?|$)`));
    await expect(page.getByTestId(screen.landmark)).toBeVisible();
  });
}
