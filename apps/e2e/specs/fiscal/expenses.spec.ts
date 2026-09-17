import { pdfFile } from "../../support/files";
import { byTestId } from "../../support/locators";
import { expect, test } from "../../support/test";

const CATEGORY_EQUIPMENT = "0";

test("an expense typed in with its receipt joins the month's journal", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/expenses");
  await page.getByTestId("expense-add-open").click();

  await byTestId(page, "expense-mode", { mode: "type" }).click();
  await page.getByTestId("expense-supplier").fill("Lunaprint");
  await page.getByTestId("expense-category").selectOption(CATEGORY_EQUIPMENT);
  await page.getByTestId("expense-amount").fill("49.90");
  await page
    .getByTestId("expense-receipt-file")
    .setInputFiles(pdfFile("lunaprint-recu.pdf"));
  await page.getByTestId("expense-submit").click();

  await expect(page.getByTestId("expense-form")).toBeHidden();
  await expect(
    byTestId(page, "expense-row", { supplier: "Lunaprint" }),
  ).toHaveAttribute("data-has-receipt", "true");
  await expect(
    byTestId(page, "expense-filter", { filter: "all" }),
  ).toHaveAttribute("data-count", "1");
  await expect(
    byTestId(page, "expense-filter", { filter: "blocked" }),
  ).toHaveAttribute("data-count", "0");
});
