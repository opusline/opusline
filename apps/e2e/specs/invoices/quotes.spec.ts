import { pdfFile } from "../../support/files";
import { byTestId } from "../../support/locators";
import { createClient, joinInvoicingBeta } from "../../support/provision";
import { expect, test } from "../../support/test";

test.beforeEach(async ({ api, account: _registered }) => {
  await joinInvoicingBeta(api);
});

const TWO_DAYS_AT_600_CENTS = 120_000;

test("a quote is drafted with its deposit, saved, listed, opened and resumed", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Lunaprint" });

  await page.goto("/invoicing/quotes");
  await expect(page.getByTestId("quotes-empty")).toBeVisible();

  await page.getByTestId("invoicing-new").click();
  await byTestId(page, "invoicing-new-item", { kind: "quote" }).click();
  await expect(page).toHaveURL(/\/invoicing\/quotes\/new$/);

  await page.getByTestId("editor-client").selectOption(String(client.id));
  await page.getByTestId("editor-add-free").click();
  await page.getByTestId("editor-line-label").fill("Audit de performance");
  await page.getByTestId("editor-line-quantity").fill("2");
  await page.getByTestId("editor-line-price").fill("600");
  await page.getByTestId("editor-validity").selectOption("60");
  await page.getByTestId("editor-deposit").selectOption("3000");
  await expect(page.getByTestId("invoice-paper-signature")).toBeVisible();

  const saved = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/invoicing/quotes") &&
      response.request().method() === "POST",
  );
  await page.getByTestId("editor-save").click();
  expect((await saved).status()).toBe(201);
  await expect(page).toHaveURL(/\/invoicing\/quotes\/\d+\/edit$/);

  await page.goto("/invoicing/quotes");
  const draft = byTestId(page, "quote-row", {
    status: "draft",
    "amount-cents": TWO_DAYS_AT_600_CENTS,
  });
  await expect(draft).toBeVisible();
  await expect(
    byTestId(page, "quote-filter", { filter: "draft" }),
  ).toHaveAttribute("data-count", "1");

  await draft.click();
  await expect(page).toHaveURL(/\/invoicing\/quotes\/\d+$/);
  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "draft",
  );
  await expect(page.getByTestId("document-amount")).toHaveAttribute(
    "data-amount-cents",
    String(TWO_DAYS_AT_600_CENTS),
  );
  await expect(page.getByTestId("invoice-paper-signature")).toBeVisible();

  await page.getByTestId("document-resume-draft").click();
  await expect(page).toHaveURL(/\/invoicing\/quotes\/\d+\/edit$/);
  await expect(page.getByTestId("editor-deposit")).toHaveValue("3000");
  await expect(page.getByTestId("editor-validity")).toHaveValue("60");
});

test("a quote issued elsewhere is recorded, its PDF filed, and invoiced whole", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Orvella" });

  await page.goto("/invoicing/quotes");
  await page.getByTestId("invoicing-new").click();
  await byTestId(page, "invoicing-new-item", {
    kind: "external-quote",
  }).click();
  await expect(page).toHaveURL(/\/invoicing\/quotes\/external$/);

  await page
    .getByTestId("external-quote-client")
    .selectOption(String(client.id));
  await page.getByTestId("external-quote-title").fill("Refonte du back-office");
  await page.getByTestId("external-quote-reference").fill("DEV-118");
  await page.getByTestId("external-quote-amount").fill("4800");
  await byTestId(page, "external-quote-status", { status: 2 }).click();
  await page
    .getByTestId("external-quote-file")
    .setInputFiles(pdfFile("devis-118.pdf"));
  await expect(page.getByTestId("external-quote-file-chosen")).toBeVisible();

  const recorded = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/invoicing/quotes/external") &&
      response.request().method() === "POST",
  );
  await page.getByTestId("external-quote-submit").click();
  expect((await recorded).status()).toBe(201);

  await expect(page).toHaveURL(/\/invoicing\/quotes\/\d+$/);
  await expect(page.getByTestId("page-heading")).toHaveAttribute(
    "data-reference",
    "DEV-118",
  );
  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "accepted",
  );
  // A new account is under the franchise en base: nothing is added to the HT.
  await expect(page.getByTestId("document-amount")).toHaveAttribute(
    "data-amount-cents",
    "480000",
  );
  await expect(page.getByTestId("document-source")).toBeVisible();
  await expect(page.getByTestId("invoice-paper-signature")).toBeHidden();
  await expect(page.getByTestId("quote-document-download")).toBeVisible();

  await page.getByTestId("quote-invoice-full").click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+\/edit$/);
  await expect(page.getByTestId("editor-line-label")).toHaveValue(
    "Refonte du back-office",
  );
});
