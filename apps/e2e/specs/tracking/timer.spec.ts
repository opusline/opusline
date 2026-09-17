import type { Page } from "@playwright/test";
import { createClient, createMission } from "../../support/provision";
import { expect, test } from "../../support/test";

const MISSION = "Callisto front";

const timerChip = (page: Page) => page.getByRole("main").locator("header");

async function startTracking(page: Page) {
  await page.getByRole("button", { name: "Start tracking" }).click();
  await page
    .getByRole("dialog", { name: "Track which mission?" })
    .getByRole("button", { name: new RegExp(`^${MISSION}`) })
    .click();
  await expect(timerChip(page).getByText("Tracking in progress")).toBeVisible();
}

test.beforeEach(async ({ page, api, account: _registered }) => {
  const client = await createClient(api, { name: "Nordlys" });
  await createMission(api, client, { name: MISSION });
  await page.goto("/week");
});

test("a tracking can be paused and resumed", async ({ page }) => {
  await startTracking(page);

  await page.getByRole("button", { name: "Pause" }).click();
  await expect(
    timerChip(page).getByText("Paused", { exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Resume" }).click();
  await expect(timerChip(page).getByText("Tracking in progress")).toBeVisible();
});

test("a stopped tracking becomes today's entry", async ({ page }) => {
  await startTracking(page);
  await page.getByRole("button", { name: "Stop", exact: true }).click();

  const dialog = page.getByRole("dialog", { name: "Save the entry" });
  await dialog.getByLabel("Activity").fill("Scoping call");
  await dialog.getByRole("button", { name: "Save" }).click();

  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Start tracking" }),
  ).toBeVisible();
  await expect(
    page.getByRole("gridcell", { name: new RegExp(`^${MISSION}, .* d, `) }),
  ).toContainText("Scoping call");
});

test("a discarded tracking leaves no entry behind", async ({ page }) => {
  await startTracking(page);
  await page.getByRole("button", { name: "Details" }).click();
  await page.getByRole("button", { name: "Discard without saving" }).click();
  await page.getByRole("button", { name: "Confirm discard" }).click();

  await expect(
    page.getByRole("button", { name: "Start tracking" }),
  ).toBeVisible();
  await expect(
    page.getByRole("gridcell", { name: new RegExp(`^${MISSION}, .*: \\d`) }),
  ).toHaveCount(0);
});
