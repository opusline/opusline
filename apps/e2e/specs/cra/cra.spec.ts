import type { MissionData } from "@opusline/api-client";
import type { Page } from "@playwright/test";
import { ANCHOR_TRACKED_DAYS } from "../../support/dates";
import { pdfFile } from "../../support/files";
import { byTestId } from "../../support/locators";
import {
  createClient,
  createMission,
  logTime,
  WORKDAY_MINUTES,
} from "../../support/provision";
import { expect, test } from "../../support/test";

const ANCHOR_MONTH = "2026-03";
const FULL_DAY_BP = "10000";

let mission: MissionData;

async function openMarchCra(page: Page) {
  await page.goto("/cra");
  await byTestId(page, "cra-picker-item", {
    mission: mission.slug,
    month: ANCHOR_MONTH,
  }).click();
  await expect(page.getByTestId("cra-title")).toHaveAttribute(
    "data-month",
    ANCHOR_MONTH,
  );
}

async function goToSendStep(page: Page) {
  await byTestId(page, "cra-advance", { step: "days" }).click();
  await byTestId(page, "cra-advance", { step: "review" }).click();
}

async function markAsSent(page: Page) {
  await byTestId(page, "cra-advance", { step: "document" }).click();
  await expect(page.getByTestId("cra-status")).toHaveAttribute(
    "data-status",
    "sent",
  );
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

  await expect(page.getByTestId("cra-origin")).toHaveAttribute(
    "data-origin",
    "prefilled",
  );
  await expect(
    byTestId(page, "cra-day", { date: "2026-03-02" }),
  ).toHaveAttribute("data-fraction-bp", FULL_DAY_BP);
  await expect(page.getByTestId("cra-reported-days")).toHaveAttribute(
    "data-days",
    String(ANCHOR_TRACKED_DAYS.length),
  );
});

test("a day added by hand is flagged as a drift before sending", async ({
  page,
}) => {
  await openMarchCra(page);
  await byTestId(page, "cra-day", { date: "2026-03-05" }).click();

  await expect(
    byTestId(page, "cra-day", { date: "2026-03-05" }),
  ).toHaveAttribute("data-fraction-bp", FULL_DAY_BP);
  await expect(page.getByTestId("cra-origin")).toHaveAttribute(
    "data-origin",
    "edited",
  );

  await byTestId(page, "cra-advance", { step: "days" }).click();

  await expect(byTestId(page, "cra-check", { check: "days" })).toHaveAttribute(
    "data-tone",
    "attention",
  );
  await expect(page.getByTestId("cra-drift")).toHaveAttribute(
    "data-drift-days",
    "1",
  );
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
  await expect(page.getByTestId("cra-document-preview")).toHaveAttribute(
    "data-month",
    ANCHOR_MONTH,
  );

  // The PDF opens in a new tab, which a headless browser turns into a download
  // it never shows: the request the tab makes is fetched again instead.
  const pdfRequest = context.waitForEvent("request", (request) =>
    /\/api\/cras\/\d+\/pdf/.test(request.url()),
  );
  await page.getByTestId("cra-download-pdf").click();
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
  await markAsSent(page);

  await page.goto(`/clients/nordlys/missions/${mission.slug}?tab=documents`);
  await expect(
    byTestId(page, "document-row", {
      name: `CRA-${mission.slug}-${ANCHOR_MONTH}.pdf`,
    }).getByTestId("document-download"),
  ).toBeVisible();
});

test("the client's signed return closes the month", async ({ page }) => {
  test.slow();

  await openMarchCra(page);
  await goToSendStep(page);
  await markAsSent(page);
  await page.getByTestId("cra-signed-return-open").click();

  const dialog = page.getByTestId("cra-signed-return-dialog");
  await dialog
    .getByTestId("cra-signed-return-file")
    .setInputFiles(pdfFile("cra-signe.pdf"));
  await dialog.getByTestId("cra-signed-return-submit").click();

  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("cra-status")).toHaveAttribute(
    "data-status",
    "signed",
  );
});

test("a sent CRA can be reopened as a draft", async ({ page }) => {
  test.slow();

  await openMarchCra(page);
  await goToSendStep(page);
  await markAsSent(page);
  await page.getByTestId("cra-reopen").click();

  await expect(page.getByTestId("cra-status")).toHaveAttribute(
    "data-status",
    "draft",
  );
});
