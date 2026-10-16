import { byTestId } from "../../support/locators";
import { joinInvoicingBeta } from "../../support/provision";
import { expect, test } from "../../support/test";

test.beforeEach(async ({ api, account: _registered }) => {
  await joinInvoicingBeta(api);
});

test("the invoicing defaults are saved for the next documents", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/invoicing/settings");
  await byTestId(page, "invoicing-mode", { mode: "opusline" }).click();
  await page.getByTestId("invoicing-payment-term").selectOption("45fm");
  await page.getByTestId("invoicing-quote-validity").selectOption("60");
  await page.getByTestId("invoicing-penalty-rate").fill("12.4");
  await page.getByTestId("invoicing-settings-save").click();
  // The save bar only exists while the draft differs from the stored settings.
  await expect(page.getByTestId("invoicing-settings-save")).toBeHidden();

  await page.reload();
  await expect(page.getByTestId("invoicing-payment-term")).toHaveValue("45fm");
  await expect(page.getByTestId("invoicing-quote-validity")).toHaveValue("60");
  await expect(page.getByTestId("invoicing-penalty-rate")).toHaveValue("12.4");
});

test("a penalty rate below the legal minimum is flagged before saving", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/invoicing/settings");
  await page.getByTestId("invoicing-penalty-rate").fill("5");

  await expect(
    byTestId(page, "invoicing-penalty-hint", { "below-floor": "true" }),
  ).toBeVisible();
});
