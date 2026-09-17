import type { MissionData } from "@opusline/api-client";
import type { Page } from "@playwright/test";
import { byTestId } from "../../support/locators";
import {
  createClient,
  createMission,
  WORKDAY_MINUTES,
} from "../../support/provision";
import { expect, test } from "../../support/test";

let mission: MissionData;

/** The dialog opens on today, which is the day these specs leave it on. */
async function openNewEntry(page: Page) {
  await page.getByTestId("new-entry-open").click();
  await byTestId(page, "new-entry-mission", { mission: mission.id }).click();
}

async function saveEntry(page: Page, duration: string, activity: string) {
  await page.getByTestId("new-entry-duration").fill(duration);
  await page.getByTestId("new-entry-note").fill(activity);
  await page.getByTestId("new-entry-submit").click();
  await expect(page.getByTestId("new-entry-dialog")).toBeHidden();
}

/** Every column is asked for, so today has a cell even on a weekend. */
const WEEK_WITH_WEEKEND = "/week?weekend=true";

const todayCell = (page: Page) =>
  byTestId(page, "week-cell", { mission: mission.id, today: "true" });

test.beforeEach(async ({ page, api, account: _registered }) => {
  const client = await createClient(api, { name: "Nordlys" });
  mission = await createMission(api, client, { name: "Callisto front" });
  await page.goto(WEEK_WITH_WEEKEND);
});

test("an entry added for today lands in today's cell with its activity", async ({
  page,
}) => {
  await openNewEntry(page);
  await saveEntry(page, "0.5", "Sprint review");

  await expect(todayCell(page)).toHaveAttribute(
    "data-minutes",
    String(WORKDAY_MINUTES / 2),
  );
  await expect(todayCell(page).getByTestId("week-cell-note")).toHaveText(
    "Sprint review",
  );
});

test("a second entry on the same day can replace the first", async ({
  page,
}) => {
  await openNewEntry(page);
  await saveEntry(page, "0.5", "Sprint review");

  await openNewEntry(page);
  await expect(page.getByTestId("new-entry-existing")).toBeVisible();
  await page.getByTestId("new-entry-existing-replace").click();
  await saveEntry(page, "1", "Pairing");

  await expect(todayCell(page)).toHaveAttribute(
    "data-minutes",
    String(WORKDAY_MINUTES),
  );
  await expect(todayCell(page).getByTestId("week-cell-note")).toHaveText(
    "Pairing",
  );
});
