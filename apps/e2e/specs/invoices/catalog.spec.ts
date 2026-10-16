import { byTestId } from "../../support/locators";
import { expect, test } from "../../support/test";

test("a service is added to the catalogue, edited and removed", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/invoicing/catalog");
  await expect(page.getByTestId("catalog-empty")).toBeVisible();

  await page.getByTestId("catalog-add").click();
  await page.getByTestId("catalog-form-label").fill("Atelier de cadrage");
  await page.getByTestId("catalog-form-unit").selectOption("2");
  await page.getByTestId("catalog-form-price").fill("300");
  await page.getByTestId("catalog-form-save").click();

  const item = page.getByTestId("catalog-item");
  await expect(item).toHaveCount(1);
  await expect(
    byTestId(item, "catalog-item-price", { "amount-cents": 30000 }),
  ).toBeVisible();

  await page.getByTestId("catalog-item-edit").click();
  await page.getByTestId("catalog-form-price").fill("350");
  await page.getByTestId("catalog-form-save").click();
  await expect(
    byTestId(item, "catalog-item-price", { "amount-cents": 35000 }),
  ).toBeVisible();

  await page.getByTestId("catalog-item-remove").click();
  await expect(page.getByTestId("catalog-empty")).toBeVisible();
});
