import type { MissionData } from "@opusline/api-client";
import type { Page } from "@playwright/test";
import { ANCHOR_MONDAY, ANCHOR_WEEK } from "../../support/dates";
import {
  createClient,
  createMission,
  logTime,
  WORKDAY_MINUTES,
} from "../../support/provision";
import { expect, test } from "../../support/test";

const MISSION = "Callisto front";

const mondayCell = (page: Page) =>
  page.getByRole("gridcell", { name: new RegExp(`^${MISSION}, Monday`) });

let mission: MissionData;

test.beforeEach(async ({ api, account: _registered }) => {
  const client = await createClient(api, { name: "Nordlys" });
  mission = await createMission(api, client, { name: MISSION });
});

test("a day typed into a cell is saved and totalled", async ({ page }) => {
  await page.goto(`/week?week=${ANCHOR_WEEK}`);
  await mondayCell(page).click();
  await page.getByRole("textbox", { name: /^Duration/ }).fill("1");
  await page.keyboard.press("Enter");

  await expect(mondayCell(page)).toHaveAccessibleName(/: 1 d, Not invoiced$/);
  await expect(
    page.getByRole("gridcell", { name: `Total for ${MISSION}` }),
  ).toHaveText("1 d");
  await expect(page.getByRole("gridcell", { name: "Week total" })).toHaveText(
    "1 d",
  );

  await page.reload();
  await expect(mondayCell(page)).toHaveAccessibleName(/: 1 d, Not invoiced$/);
});

test("a draft the grid cannot read is refused in place", async ({ page }) => {
  await page.goto(`/week?week=${ANCHOR_WEEK}`);
  await mondayCell(page).click();
  await page.getByRole("textbox", { name: /^Duration/ }).fill("soon");
  await page.keyboard.press("Enter");

  await expect(page.getByRole("alert")).toBeVisible();
  await expect(mondayCell(page)).toHaveAccessibleName(/: no entries$/);
});

test("the arrows and Today move between weeks", async ({ page }) => {
  await page.goto(`/week?week=${ANCHOR_WEEK}`);

  await page.getByRole("button", { name: "Previous week" }).click();
  await expect(page).toHaveURL(/week=2026-W09/);

  await page.getByRole("button", { name: "Next week" }).click();
  await page.getByRole("button", { name: "Next week" }).click();
  await expect(page).toHaveURL(/week=2026-W11/);

  await page.getByRole("button", { name: "Today", exact: true }).click();
  await expect(page).not.toHaveURL(/week=2026-W11/);
  await expect(
    page.getByRole("button", { name: "Today", exact: true }),
  ).toBeDisabled();
});

test("the weekend unfolds on demand", async ({ page }) => {
  await page.goto(`/week?week=${ANCHOR_WEEK}`);
  await expect(page.getByRole("columnheader", { name: "Sat 7" })).toBeHidden();

  await page.getByRole("button", { name: "Show the weekend" }).click();
  await expect(page.getByRole("columnheader", { name: "Sat 7" })).toBeVisible();

  await page.getByRole("button", { name: "Hide the weekend" }).click();
  await expect(page.getByRole("columnheader", { name: "Sat 7" })).toBeHidden();
});

test("typing zero over a logged day clears it", async ({ page, api }) => {
  await logTime(api, {
    missionId: mission.id,
    date: ANCHOR_MONDAY,
    durationMinutes: WORKDAY_MINUTES,
  });

  await page.goto(`/week?week=${ANCHOR_WEEK}`);
  await expect(mondayCell(page)).toHaveAccessibleName(/: 1 d, Not invoiced$/);

  await mondayCell(page).click();
  await page.getByRole("textbox", { name: /^Duration/ }).fill("0");
  await page.keyboard.press("Enter");

  await expect(mondayCell(page)).toHaveAccessibleName(/: no entries$/);
});
