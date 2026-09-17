import type { Page } from "@playwright/test";
import { expect, test } from "../../support/test";

async function enterBalance(page: Page, balance: string) {
  await page.goto("/bank-account");
  await page.getByRole("button", { name: "Edit the balance" }).click();

  const dialog = page.getByRole("dialog", { name: "Business account balance" });
  await dialog.getByLabel("Balance").fill(balance);
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toBeHidden();
}

test("without a balance there is nothing to work a transfer out from", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/treasury");

  await expect(page.getByText("No business account balance yet")).toBeVisible();
});

test("a recorded transfer joins the past transfers, and can be deleted", async ({
  page,
  account: _registered,
}) => {
  await enterBalance(page, "5000");

  await page.goto("/treasury");
  await page.getByRole("button", { name: "Record a transfer" }).click();
  const dialog = page.getByRole("dialog", { name: "Record a transfer" });
  await dialog.getByLabel("Amount").fill("1500");
  await dialog.getByLabel("Note").fill("Septembre");
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toBeHidden();

  const transfer = page
    .getByRole("main")
    .getByRole("listitem")
    .filter({ hasText: "Septembre" });
  await expect(transfer).toContainText("1,500");

  await transfer
    .getByRole("button", { name: /^Delete the transfer of/ })
    .click();
  await page
    .getByRole("alertdialog", { name: "Delete this transfer?" })
    .getByRole("button", { name: "Delete the transfer" })
    .click();
  await expect(page.getByText("No transfer recorded yet.")).toBeVisible();
});
