import { createClient } from "../../support/provision";
import { expect, test } from "../../support/test";

test("a client and its first mission are created in one go, and the mission becomes a week row", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/clients/new");
  await page.getByLabel("Company name").fill("Nordlys");
  await page
    .getByRole("button", { name: "Create and go on to a mission" })
    .click();

  await expect(
    page.getByRole("heading", { level: 1, name: "New mission" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Nordlys" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByLabel("Mission name").fill("Callisto front");
  await page.getByLabel("Rate HT").fill("550");
  await page.getByRole("button", { name: "Create the mission" }).click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Callisto front" }),
  ).toBeVisible();

  await page.goto("/week");
  await expect(
    page.getByRole("rowheader", { name: /^Callisto front/ }),
  ).toContainText("€550 / d");
});

test("a mission without a rate is refused", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Lunaprint" });

  await page.goto(`/missions/new?client=${client.slug}`);
  await page.getByLabel("Mission name").fill("Lunaprint maintenance");
  await page.getByRole("button", { name: "Create the mission" }).click();

  await expect(page.getByText("Set a rate for this mission.")).toBeVisible();
  await expect(page).toHaveURL(/\/missions\/new/);
});
