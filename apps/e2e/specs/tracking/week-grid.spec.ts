import type { MissionData } from "@opusline/api-client";
import type { Page } from "@playwright/test";
import { ANCHOR_MONDAY, ANCHOR_WEEK } from "../../support/dates";
import { byTestId } from "../../support/locators";
import {
  createClient,
  createMission,
  logTime,
  WORKDAY_MINUTES,
} from "../../support/provision";
import { expect, test } from "../../support/test";

const ANCHOR_SATURDAY = "2026-03-07";

let mission: MissionData;

const mondayCell = (page: Page) =>
  byTestId(page, "week-cell", { mission: mission.id, date: ANCHOR_MONDAY });

async function typeIntoMondayCell(page: Page, draft: string) {
  await mondayCell(page).click();
  await page.getByTestId("week-cell-input").fill(draft);
  await page.getByTestId("week-cell-input").press("Enter");
}

test.beforeEach(async ({ api, account: _registered }) => {
  const client = await createClient(api, { name: "Nordlys" });
  mission = await createMission(api, client, { name: "Callisto front" });
});

test("a day typed into a cell is saved and totalled", async ({ page }) => {
  await page.goto(`/week?week=${ANCHOR_WEEK}`);
  await typeIntoMondayCell(page, "1");

  await expect(mondayCell(page)).toHaveAttribute(
    "data-minutes",
    String(WORKDAY_MINUTES),
  );
  await expect(
    byTestId(page, "week-mission-total", { mission: mission.id }),
  ).toHaveAttribute("data-minutes", String(WORKDAY_MINUTES));
  await expect(page.getByTestId("week-total")).toHaveAttribute(
    "data-minutes",
    String(WORKDAY_MINUTES),
  );

  await page.reload();
  await expect(mondayCell(page)).toHaveAttribute(
    "data-minutes",
    String(WORKDAY_MINUTES),
  );
});

test("a draft the grid cannot read is refused in place", async ({ page }) => {
  await page.goto(`/week?week=${ANCHOR_WEEK}`);
  await typeIntoMondayCell(page, "soon");

  await expect(page.getByTestId("week-cell-error")).toBeVisible();
  await expect(mondayCell(page)).toHaveAttribute("data-minutes", "0");
});

test("the arrows and Today move between weeks", async ({ page }) => {
  await page.goto(`/week?week=${ANCHOR_WEEK}`);

  await page.getByTestId("week-previous").click();
  await expect(page).toHaveURL(/week=2026-W09/);

  await page.getByTestId("week-next").click();
  await page.getByTestId("week-next").click();
  await expect(page).toHaveURL(/week=2026-W11/);

  await page.getByTestId("week-today").click();
  await expect(page).not.toHaveURL(/week=2026-W11/);
  await expect(page.getByTestId("week-today")).toBeDisabled();
});

test("the weekend unfolds on demand", async ({ page }) => {
  const saturday = byTestId(page, "week-column", { date: ANCHOR_SATURDAY });
  const weekendToggle = page.getByTestId("week-weekend-toggle");

  await page.goto(`/week?week=${ANCHOR_WEEK}`);
  await expect(weekendToggle).toHaveAttribute("data-expanded", "false");
  await expect(saturday).toHaveCount(0);

  await weekendToggle.click();
  await expect(weekendToggle).toHaveAttribute("data-expanded", "true");
  await expect(saturday).toBeVisible();

  await weekendToggle.click();
  await expect(saturday).toHaveCount(0);
});

test("typing zero over a logged day clears it", async ({ page, api }) => {
  await logTime(api, {
    missionId: mission.id,
    date: ANCHOR_MONDAY,
    durationMinutes: WORKDAY_MINUTES,
  });

  await page.goto(`/week?week=${ANCHOR_WEEK}`);
  await expect(mondayCell(page)).toHaveAttribute(
    "data-minutes",
    String(WORKDAY_MINUTES),
  );

  await typeIntoMondayCell(page, "0");

  await expect(mondayCell(page)).toHaveAttribute("data-minutes", "0");
});
