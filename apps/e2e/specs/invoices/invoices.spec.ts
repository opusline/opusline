import type { Page } from "@playwright/test";
import { ANCHOR_TRACKED_DAYS } from "../../support/dates";
import {
  createClient,
  createMission,
  logTime,
  WORKDAY_MINUTES,
} from "../../support/provision";
import { expect, test } from "../../support/test";

const REFERENCE = "2026-036";

async function invoiceUnbilledTime(page: Page, reference: string) {
  await page.goto("/invoices");
  await page.getByRole("button", { name: "Create the invoice" }).click();

  const dialog = page.getByRole("dialog", { name: "Create the invoice" });
  // The next free reference is suggested once it has loaded, and would
  // overwrite anything typed before it lands.
  await expect(dialog.getByLabel("Reference")).toHaveValue(/\S/);
  await dialog.getByLabel("Reference").fill(reference);
  await dialog.getByRole("button", { name: "Create the invoice" }).click();
  await expect(dialog).toBeHidden();
}

async function openInvoice(page: Page, reference: string) {
  await page
    .getByRole("button", { name: `Open the invoice ${reference}` })
    .click();

  return page.getByRole("dialog", { name: new RegExp(`^${reference}`) });
}

test.beforeEach(async ({ api, account: _registered }) => {
  const client = await createClient(api, { name: "Nordlys" });
  const mission = await createMission(api, client, { name: "Callisto front" });

  for (const date of ANCHOR_TRACKED_DAYS) {
    await logTime(api, {
      missionId: mission.id,
      date,
      durationMinutes: WORKDAY_MINUTES,
    });
  }
});

test("tracked days wait to be invoiced at the mission's rate", async ({
  page,
}) => {
  await page.goto("/invoices");

  const toHandle = page.getByRole("listitem").filter({ hasText: "To invoice" });
  await expect(toHandle).toContainText("3 d on Callisto front");
  await expect(toHandle).toContainText("€1,650 HT");
});

test("invoicing the tracked days leaves nothing to handle", async ({
  page,
}) => {
  await invoiceUnbilledTime(page, REFERENCE);

  await expect(
    page.getByText("Everything is invoiced and collected."),
  ).toBeVisible();
  await expect(
    page.getByRole("row", { name: new RegExp(`${REFERENCE}.*€1,650 Sent$`) }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "To collect (1)" }),
  ).toBeVisible();
});

test("a collected invoice is paid", async ({ page }) => {
  await invoiceUnbilledTime(page, REFERENCE);
  const drawer = await openInvoice(page, REFERENCE);
  await drawer.getByRole("button", { name: "Mark as collected" }).click();

  const paidDrawer = page.getByRole("dialog", { name: `${REFERENCE} Paid` });
  await expect(paidDrawer).toBeVisible();

  await paidDrawer.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("button", { name: "Paid (1)" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "To collect (0)" }),
  ).toBeVisible();
});

test("a reminder is kept in the invoice's history", async ({ page }) => {
  await invoiceUnbilledTime(page, REFERENCE);
  const drawer = await openInvoice(page, REFERENCE);
  await drawer.getByRole("button", { name: "Note a reminder" }).click();

  await expect(
    drawer.getByRole("listitem").filter({ hasText: "Reminder" }),
  ).toBeVisible();
});

test("an invoice without a reference is a draft, and deleting it frees the days", async ({
  page,
}) => {
  await invoiceUnbilledTime(page, "");
  await expect(page.getByRole("button", { name: "Drafts (1)" })).toBeVisible();

  await page.getByRole("button", { name: /^Open the invoice/ }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete the draft" })
    .click();
  await page
    .getByRole("alertdialog", { name: "Delete this draft?" })
    .getByRole("button", { name: "Delete the draft" })
    .click();

  await expect(page.getByRole("button", { name: "Drafts (0)" })).toBeVisible();
  await expect(
    page.getByRole("listitem").filter({ hasText: "To invoice" }),
  ).toContainText("3 d on Callisto front");
});

test("an invoice issued elsewhere is added by hand", async ({ page }) => {
  await page.goto("/invoices");
  await page.getByRole("button", { name: "Add an invoice" }).click();

  const dialog = page.getByRole("dialog", { name: "Add an invoice" });
  await dialog.getByLabel("Reference").fill("2026-037");
  await dialog.getByLabel("Amount HT").fill("1200");
  await dialog.getByRole("button", { name: "Save" }).click();

  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Open the invoice 2026-037" }),
  ).toBeVisible();
});
