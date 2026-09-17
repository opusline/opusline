import type { Page } from "@playwright/test";
import { expect, test } from "../../support/test";

async function enterBalance(page: Page, balance: string) {
  await page.goto("/bank-account");
  await page.getByTestId("bank-balance-edit").click();
  await page.getByTestId("bank-balance-input").fill(balance);
  await page.getByTestId("bank-balance-submit").click();
  await expect(page.getByTestId("bank-balance-dialog")).toBeHidden();
}

test("without a balance there is nothing to work a transfer out from", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/treasury");

  await expect(page.getByTestId("treasury-no-balance")).toBeVisible();
});

test("a recorded transfer joins the past transfers, and can be deleted", async ({
  page,
  account: _registered,
}) => {
  await enterBalance(page, "5000");

  await page.goto("/treasury");
  await page.getByTestId("transfer-add-open").click();
  await page.getByTestId("transfer-amount").fill("1500");
  await page.getByTestId("transfer-note").fill("Septembre");
  await page.getByTestId("transfer-submit").click();
  await expect(page.getByTestId("transfer-form")).toBeHidden();

  const transfer = page.getByTestId("transfer-row");
  await expect(transfer).toHaveAttribute("data-amount-cents", "150000");
  await expect(transfer).toContainText("Septembre");

  await transfer.getByTestId("transfer-delete").click();
  await page.getByTestId("confirm-delete-submit").click();
  await expect(page.getByTestId("transfers-empty")).toBeVisible();
});
