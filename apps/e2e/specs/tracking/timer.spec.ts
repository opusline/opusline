import type { MissionData } from "@opusline/api-client";
import type { Page } from "@playwright/test";
import { byTestId } from "../../support/locators";
import { createClient, createMission } from "../../support/provision";
import { expect, test } from "../../support/test";

let mission: MissionData;

/** Every column is asked for, so today has a cell even on a weekend. */
const WEEK_WITH_WEEKEND = "/week?weekend=true";

const todayCell = (page: Page) =>
  byTestId(page, "week-cell", { mission: mission.id, today: "true" });

async function startTracking(page: Page) {
  await page.getByTestId("timer-start").click();
  await byTestId(page, "timer-mission", { mission: mission.id }).click();
  await expect(page.getByTestId("timer-chip")).toHaveAttribute(
    "data-state",
    "running",
  );
}

test.beforeEach(async ({ page, api, account: _registered }) => {
  const client = await createClient(api, { name: "Nordlys" });
  mission = await createMission(api, client, { name: "Callisto front" });
  await page.goto(WEEK_WITH_WEEKEND);
});

test("a tracking can be paused and resumed", async ({ page }) => {
  await startTracking(page);

  await page.getByTestId("timer-pause-toggle").click();
  await expect(page.getByTestId("timer-chip")).toHaveAttribute(
    "data-state",
    "paused",
  );

  await page.getByTestId("timer-pause-toggle").click();
  await expect(page.getByTestId("timer-chip")).toHaveAttribute(
    "data-state",
    "running",
  );
});

test("a stopped tracking becomes today's entry", async ({ page }) => {
  await startTracking(page);
  await page.getByTestId("timer-stop").click();

  await page.getByTestId("timer-stop-note").fill("Scoping call");
  await page.getByTestId("timer-stop-submit").click();

  await expect(page.getByTestId("timer-stop-dialog")).toBeHidden();
  await expect(page.getByTestId("timer-start")).toBeVisible();
  await expect(todayCell(page)).not.toHaveAttribute("data-minutes", "0");
  await expect(todayCell(page).getByTestId("week-cell-note")).toHaveText(
    "Scoping call",
  );
});

test("a discarded tracking leaves no entry behind", async ({ page }) => {
  await startTracking(page);
  await page.getByTestId("timer-details").click();
  await page.getByTestId("timer-discard").click();
  await page.getByTestId("timer-discard-confirm").click();

  await expect(page.getByTestId("timer-start")).toBeVisible();
  await expect(todayCell(page)).toHaveAttribute("data-minutes", "0");
});
