import { pdfFile } from "../../support/files";
import { expect, test } from "../../support/test";

test("an expense typed in with its receipt joins the month's journal", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/expenses");
  await page.getByRole("button", { name: "Add an expense" }).click();

  const dialog = page.getByRole("dialog", { name: "Add an expense" });
  await dialog.getByRole("button", { name: "Type it" }).click();
  await dialog.getByLabel("Supplier").fill("Lunaprint");
  await dialog.getByLabel("Category").selectOption("Equipment");
  await dialog.getByLabel("Amount TTC").fill("49.90");
  await dialog
    .getByRole("group", { name: "Receipt" })
    .locator('input[type="file"]')
    .setInputFiles(pdfFile("lunaprint-recu.pdf"));
  await dialog.getByRole("button", { name: "Save" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByRole("main")).toContainText("Lunaprint");
  await expect(page.getByRole("button", { name: "All 1" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "No receipt 0" }),
  ).toBeVisible();
});
