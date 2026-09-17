import { byTestId } from "../../support/locators";
import { expect, test } from "../../support/test";

const PERIODICITY_MONTHLY = "0";

test("a monthly subscription is listed with its yearly cost", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/expenses?tab=subscriptions");
  await expect(page.getByTestId("subscriptions-empty")).toBeVisible();

  await page.getByTestId("subscription-add-open").click();
  await page.getByTestId("subscription-supplier").fill("Orvella");
  await page.getByTestId("subscription-amount").fill("20");
  await page.getByTestId("subscription-submit").click();

  await expect(page.getByTestId("subscription-form")).toBeHidden();
  await expect(
    byTestId(page, "subscription-row", { supplier: "Orvella" }),
  ).toHaveAttribute("data-periodicity", PERIODICITY_MONTHLY);
  await expect(page.getByTestId("subscriptions-empty")).toBeHidden();
});
