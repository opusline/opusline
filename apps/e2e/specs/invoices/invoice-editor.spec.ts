import { ANCHOR_TRACKED_DAYS } from "../../support/dates";
import { byTestId } from "../../support/locators";
import {
  createClient,
  createMission,
  logTime,
  WORKDAY_MINUTES,
} from "../../support/provision";
import { expect, test } from "../../support/test";

const THREE_DAYS_AT_550_CENTS = 165_000;

test("tracked time is imported into a draft, saved, opened and resumed", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, {
    name: "Lunaprint",
    billingAddressLine1: "8 quai des Tanneurs",
    billingPostalCode: "67000",
    billingCity: "Strasbourg",
  });
  const mission = await createMission(api, client, { name: "Refonte vitrine" });

  for (const date of ANCHOR_TRACKED_DAYS) {
    await logTime(api, {
      missionId: mission.id,
      date,
      durationMinutes: WORKDAY_MINUTES,
    });
  }

  await page.goto("/invoicing/invoices");
  await page.getByTestId("invoicing-new").click();
  await byTestId(page, "invoicing-new-item", { kind: "invoice" }).click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/new$/);

  await page.getByTestId("editor-client").selectOption(String(client.id));
  await page.getByTestId("editor-mission").selectOption(String(mission.id));
  await expect(page.getByTestId("invoice-paper")).toBeVisible();

  await page.getByTestId("editor-import-time").click();
  await expect(page.getByTestId("editor-line-quantity")).toHaveValue("3");
  await expect(page.getByTestId("editor-time-linked")).toHaveAttribute(
    "data-entries",
    String(ANCHOR_TRACKED_DAYS.length),
  );

  const saved = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/invoicing/invoices") &&
      response.request().method() === "POST",
  );
  await page.getByTestId("editor-save").click();
  expect((await saved).status()).toBe(201);

  await page.goto("/invoicing/invoices");
  const draft = byTestId(page, "invoice-row", {
    status: "draft",
    "amount-cents": THREE_DAYS_AT_550_CENTS,
  });
  await expect(draft).toBeVisible();

  await draft.click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+$/);
  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "draft",
  );
  await expect(page.getByTestId("document-amount")).toHaveAttribute(
    "data-amount-cents",
    String(THREE_DAYS_AT_550_CENTS),
  );
  await expect(page.getByTestId("invoice-paper")).toBeVisible();

  await page.getByTestId("document-resume-draft").click();
  await expect(page).toHaveURL(/\/invoicing\/invoices\/\d+\/edit$/);
  await expect(page.getByTestId("editor-time-linked")).toHaveAttribute(
    "data-entries",
    String(ANCHOR_TRACKED_DAYS.length),
  );
});
