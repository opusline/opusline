import type { Locator, Page } from "@playwright/test";
import { expect, test } from "../../support/test";

type Screen = {
  link: string;
  path: string;
  landmark: (page: Page) => Locator;
};

const pageHeading = (name: string | RegExp) => (page: Page) =>
  page.getByRole("heading", { level: 1, name, exact: true });

const screens: Screen[] = [
  { link: "Week", path: "/week", landmark: pageHeading("Week") },
  { link: "Clients", path: "/clients", landmark: pageHeading("Clients") },
  {
    // The CRA screen titles itself after the open report, and a new account has none.
    link: "CRA",
    path: "/cra",
    landmark: (page) => page.getByText("No mission requires a CRA"),
  },
  { link: "Invoices", path: "/invoices", landmark: pageHeading("Invoices") },
  {
    // Followed by the period on show, which moves with the calendar.
    link: "Revenue",
    path: "/revenue",
    landmark: pageHeading(/^Revenue /),
  },
  { link: "Expenses", path: "/expenses", landmark: pageHeading("Expenses") },
  {
    link: "Transfer",
    path: "/treasury",
    landmark: pageHeading("How much can I pay myself?"),
  },
  {
    link: "Business account",
    path: "/bank-account",
    landmark: pageHeading("Business account"),
  },
  { link: "Deadlines", path: "/deadlines", landmark: pageHeading("Deadlines") },
  { link: "Filings", path: "/declarations", landmark: pageHeading("Filings") },
  {
    link: "Documents",
    path: "/documents",
    landmark: pageHeading("My documents"),
  },
  { link: "Settings", path: "/settings", landmark: pageHeading("Settings") },
];

for (const screen of screens) {
  test(`the ${screen.link} screen renders for a new account`, async ({
    page,
    account: _registered,
  }) => {
    await page.goto("/release-notes");
    await page
      .getByRole("link", { name: new RegExp(`^${screen.link}`) })
      .click();

    await expect(page).toHaveURL(new RegExp(`${screen.path}(\\?|$)`));
    await expect(screen.landmark(page)).toBeVisible();
  });
}
