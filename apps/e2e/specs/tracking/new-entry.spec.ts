import type { Page } from "@playwright/test";
import { createClient, createMission } from "../../support/provision";
import { expect, test } from "../../support/test";

const MISSION = "Callisto front";

async function addTodayEntry(page: Page, duration: string, activity: string) {
  await page.getByRole("button", { name: /^New entry/ }).click();

  const dialog = page.getByRole("dialog", { name: "New entry" });
  await dialog.getByRole("button", { name: new RegExp(`^${MISSION}`) }).click();
  await dialog.getByLabel("Duration").fill(duration);
  await dialog.getByLabel("Activity").fill(activity);
  await dialog.getByRole("button", { name: "Save" }).click();

  return dialog;
}

test.beforeEach(async ({ api, account: _registered }) => {
  const client = await createClient(api, { name: "Nordlys" });
  await createMission(api, client, { name: MISSION });
});

test("an entry added for today lands in today's cell with its activity", async ({
  page,
}) => {
  await page.goto("/week");
  const dialog = await addTodayEntry(page, "0.5", "Sprint review");

  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("gridcell", {
      name: new RegExp(`^${MISSION}, .*: 0\\.5 d`),
    }),
  ).toContainText("Sprint review");
});

test("a second entry on the same day and mission is refused", async ({
  page,
}) => {
  await page.goto("/week");
  await expect(await addTodayEntry(page, "0.5", "Sprint review")).toBeHidden();

  const dialog = await addTodayEntry(page, "0.5", "Pairing");

  await expect(dialog.getByText(/already exists on that day/)).toBeVisible();
});
