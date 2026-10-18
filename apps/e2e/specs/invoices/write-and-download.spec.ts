import type { CatalogItemData } from "@opusline/api-client";

import { byTestId } from "../../support/locators";
import {
  createBillableClient,
  fillInvoicingIdentity,
  joinInvoicingBeta,
} from "../../support/provision";
import { expect, test } from "../../support/test";

// A new account is under the franchise en base: the TTC is the HT.
const WORKSHOP_CENTS = 30_000;

test("an invoice is written from the catalogue, validated and downloaded", async ({
  page,
  api,
  account: _registered,
}) => {
  await joinInvoicingBeta(api);
  await fillInvoicingIdentity(api);
  const client = await createBillableClient(api, { name: "Orvella" });
  const workshop = await api.post<CatalogItemData>("/api/invoicing/catalog", {
    label: "Atelier de cadrage",
    unit: 2,
    unitPrice: { amount: WORKSHOP_CENTS, currency: "EUR" },
    vatRateBp: 0,
  });

  await page.goto("/invoicing/invoices/new");
  await page.getByTestId("editor-client").selectOption(String(client.id));
  await page.getByTestId("editor-add-catalog").click();
  await byTestId(page, "editor-catalog-item", { item: workshop.id }).click();
  await expect(page.getByTestId("editor-line-label")).toHaveValue(
    workshop.label,
  );

  await page.getByTestId("editor-validate").click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+$/);
  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "sent",
  );
  await expect(page.getByTestId("document-amount")).toHaveAttribute(
    "data-amount-cents",
    String(WORKSHOP_CENTS),
  );
  const number = await page
    .getByTestId("page-heading")
    .getAttribute("data-reference");

  await page.getByTestId("document-download").click();
  const download = page.waitForEvent("download");
  await byTestId(page, "document-download-item", { language: "en" }).click();

  expect((await download).suggestedFilename()).toBe(`Invoice-${number}.pdf`);
});
