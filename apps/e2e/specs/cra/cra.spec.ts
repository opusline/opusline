import type { MissionData } from "@opusline/api-client";
import type { Page } from "@playwright/test";
import { ANCHOR_TRACKED_DAYS } from "../../support/dates";
import { pdfFile } from "../../support/files";
import {
  createClient,
  createMission,
  logTime,
  WORKDAY_MINUTES,
} from "../../support/provision";
import { expect, test } from "../../support/test";

let mission: MissionData;

async function openMarchCra(page: Page) {
  await page.goto("/cra");
  await page.getByRole("button", { name: /March 2026$/ }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "March 2026" }),
  ).toBeVisible();
}

async function goToSendStep(page: Page) {
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await page.getByRole("button", { name: "View the document" }).click();
}

test.beforeEach(async ({ api, account: _registered }) => {
  const client = await createClient(api, { name: "Nordlys" });
  mission = await createMission(api, client, {
    name: "Callisto front",
    craRequired: true,
  });

  for (const date of ANCHOR_TRACKED_DAYS) {
    await logTime(api, {
      missionId: mission.id,
      date,
      durationMinutes: WORKDAY_MINUTES,
    });
  }
});

test("a month owed opens pre-filled from the tracked days", async ({
  page,
}) => {
  await openMarchCra(page);

  await expect(page.getByText("pre-filled from your entries")).toBeVisible();
  await expect(
    page.getByRole("gridcell", { name: "Monday, March 2, 1 d" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Enter the days 3 d reported" }),
  ).toBeVisible();
});

test("a day added by hand is flagged as a drift before sending", async ({
  page,
}) => {
  await openMarchCra(page);
  await page.getByRole("gridcell", { name: /^Thursday, March 5,/ }).click();

  await expect(
    page.getByRole("gridcell", { name: "Thursday, March 5, 1 d" }),
  ).toBeVisible();
  await expect(page.getByText("edited by hand")).toBeVisible();

  await page.getByRole("button", { name: "Review", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "Before sending" }),
  ).toBeVisible();
  await expect(page.getByText("+1 d versus tracked time")).toBeVisible();
});

test("the document step serves the PDF it previews", async ({
  page,
  context,
  api,
}) => {
  // The first render loads the fonts dompdf embeds.
  test.slow();

  await openMarchCra(page);
  await goToSendStep(page);
  await expect(
    page.getByRole("heading", { name: "Compte rendu d'activité" }),
  ).toBeVisible();

  // The PDF opens in a new tab, which a headless browser turns into a download
  // it never shows: the request the tab makes is fetched again instead.
  const pdfRequest = context.waitForEvent("request", (request) =>
    /\/api\/cras\/\d+\/pdf/.test(request.url()),
  );
  await page.getByRole("button", { name: "Download the PDF" }).click();
  const pdf = await api.download((await pdfRequest).url());

  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("a sent CRA is filed with the mission and waits for its signature", async ({
  page,
}) => {
  test.slow();

  await openMarchCra(page);
  await goToSendStep(page);
  await page.getByRole("button", { name: "Mark as sent" }).click();

  await expect(page.getByText("Sent", { exact: true }).first()).toBeVisible();

  await page.goto(`/clients/nordlys/missions/${mission.slug}?tab=documents`);
  await expect(
    page.getByRole("link", {
      name: `Download CRA-${mission.slug}-2026-03.pdf`,
    }),
  ).toBeVisible();
});

test("the client's signed return closes the month", async ({ page }) => {
  test.slow();

  await openMarchCra(page);
  await goToSendStep(page);
  await page.getByRole("button", { name: "Mark as sent" }).click();
  await page.getByRole("button", { name: "Record the signed return" }).click();

  const dialog = page.getByRole("dialog", { name: "Record the signed return" });
  await dialog
    .locator('input[type="file"]')
    .setInputFiles(pdfFile("cra-signe.pdf"));
  await dialog.getByRole("button", { name: "Record the return" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText("Signed", { exact: true }).first()).toBeVisible();
});

test("a sent CRA can be reopened as a draft", async ({ page }) => {
  test.slow();

  await openMarchCra(page);
  await goToSendStep(page);
  await page.getByRole("button", { name: "Mark as sent" }).click();
  await page.getByRole("button", { name: "Reopen" }).click();

  await expect(page.getByText("Draft", { exact: true }).first()).toBeVisible();
});
