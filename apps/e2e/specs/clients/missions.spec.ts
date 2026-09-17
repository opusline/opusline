import { byTestId } from "../../support/locators";
import { createClient } from "../../support/provision";
import { expect, test } from "../../support/test";

test("a client and its first mission are created in one go, and the mission becomes a week row", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/clients/new");
  await page.getByTestId("client-form-name").fill("Nordlys");
  await page.getByTestId("client-form-submit-and-chain").click();

  await expect(
    byTestId(page, "mission-form-client", { client: "nordlys" }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.getByTestId("mission-form-name").fill("Callisto front");
  await page.getByTestId("mission-form-rate").fill("550");
  await page.getByTestId("mission-form-submit").click();

  await expect(page.getByTestId("mission-detail-name")).toHaveText(
    "Callisto front",
  );

  await page.goto("/week");
  await expect(page.getByTestId("week-mission-row")).toHaveCount(1);
  await expect(page.getByTestId("week-mission-row")).toContainText(
    "Callisto front",
  );
});

test("a mission without a rate is refused", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Lunaprint" });

  await page.goto(`/missions/new?client=${client.slug}`);
  await page.getByTestId("mission-form-name").fill("Lunaprint maintenance");
  await page.getByTestId("mission-form-submit").click();

  await expect(page.getByTestId("mission-rate-error")).toBeVisible();
  await expect(page).toHaveURL(/\/missions\/new/);
});
