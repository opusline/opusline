import { byTestId } from "../../support/locators";
import { createClient, joinInvoicingBeta } from "../../support/provision";
import { expect, test } from "../../support/test";

test.beforeEach(async ({ api, account: _registered }) => {
  await joinInvoicingBeta(api);
});

// The sample names Nordlys, so an account with that client sees it picked.
const SAMPLE_LINES = 2;
const SAMPLE_TOTAL_HT_CENTS = 300_00 + 6 * 480_00;

test("a pasted block fills the client, the lines and the term of a new invoice", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, {
    name: "Nordlys",
    billingAddressLine1: "3 impasse des Potiers",
    billingPostalCode: "44100",
    billingCity: "Nantes",
  });

  await page.goto("/invoicing/invoices/new");
  await page.getByTestId("paste-fill-toggle").click();
  await page.getByTestId("paste-fill-sample").click();
  await page.getByTestId("paste-fill-apply").click();

  // Client, title, lines and term: the sample fills four things.
  await expect(page.getByTestId("paste-fill-filled")).toHaveAttribute(
    "data-count",
    "4",
  );
  await expect(
    byTestId(page, "paste-fill-chip", { kind: "client" }),
  ).toBeVisible();
  await expect(page.getByTestId("editor-client")).toHaveValue(
    String(client.id),
  );
  await expect(page.getByTestId("editor-line")).toHaveCount(SAMPLE_LINES);
  await expect(page.getByTestId("editor-term")).toHaveValue("30fm");

  const saved = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/invoicing/invoices") &&
      response.request().method() === "POST",
  );
  await page.getByTestId("editor-save").click();
  expect((await saved).status()).toBe(201);

  await page.goto("/invoicing/invoices");
  await expect(
    byTestId(page, "invoice-row", {
      status: "draft",
      "amount-cents": SAMPLE_TOTAL_HT_CENTS,
    }),
  ).toBeVisible();
});

test("a text outside the format fills nothing and says so", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/invoicing/invoices/new");
  await page.getByTestId("paste-fill-toggle").click();
  await page
    .getByTestId("paste-fill-text")
    .fill("Devis : 3 jours de conseil a 480 EUR");
  await page.getByTestId("paste-fill-apply").click();

  await expect(page.getByTestId("paste-fill-unrecognized")).toBeVisible();
  await expect(page.getByTestId("editor-line")).toHaveCount(0);
});
