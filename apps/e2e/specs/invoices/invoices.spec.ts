import type { MissionData } from "@opusline/api-client";
import type { Page } from "@playwright/test";
import { ANCHOR_TRACKED_DAYS } from "../../support/dates";
import { byTestId } from "../../support/locators";
import {
  createClient,
  createMission,
  logTime,
  WORKDAY_MINUTES,
} from "../../support/provision";
import { expect, test } from "../../support/test";

const REFERENCE = "2026-036";
const THREE_DAYS_AT_550_CENTS = "165000";

let mission: MissionData;

const unbilledWork = (page: Page) =>
  byTestId(page, "invoice-todo-item", {
    kind: "to-invoice",
    "mission-id": mission.id,
  });

const invoiceFilter = (page: Page, filter: string) =>
  byTestId(page, "invoice-filter", { filter });

async function invoiceUnbilledTime(page: Page, reference: string) {
  await page.goto("/invoices");
  await unbilledWork(page).getByTestId("invoice-todo-create").click();

  const dialog = page.getByTestId("invoice-create-dialog");
  // The next free reference is suggested once it has loaded, and an empty
  // field takes it: a reference cleared before it lands comes back filled.
  await expect(dialog.getByTestId("invoice-create-reference")).toHaveValue(
    /\S/,
  );
  await dialog.getByTestId("invoice-create-reference").fill(reference);
  await dialog.getByTestId("invoice-create-submit").click();
  await expect(dialog).toBeHidden();
}

async function openInvoice(page: Page, reference: string) {
  await byTestId(page, "invoice-row", { reference })
    .getByTestId("invoice-open")
    .click();

  const drawer = page.getByTestId("invoice-drawer");
  await expect(drawer.getByTestId("invoice-drawer-title")).toHaveAttribute(
    "data-reference",
    reference,
  );

  return drawer;
}

test.beforeEach(async ({ api, account: _registered }) => {
  const client = await createClient(api, { name: "Nordlys" });
  mission = await createMission(api, client, { name: "Callisto front" });

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

  await expect(unbilledWork(page)).toContainText(mission.name);
  await expect(unbilledWork(page)).toHaveAttribute(
    "data-amount-cents",
    THREE_DAYS_AT_550_CENTS,
  );
});

test("invoicing the tracked days leaves nothing to handle", async ({
  page,
}) => {
  await invoiceUnbilledTime(page, REFERENCE);

  await expect(page.getByTestId("invoices-all-handled")).toBeVisible();

  const row = byTestId(page, "invoice-row", { reference: REFERENCE });
  await expect(row).toHaveAttribute("data-status", "sent");
  await expect(row).toHaveAttribute(
    "data-amount-cents",
    THREE_DAYS_AT_550_CENTS,
  );
  await expect(invoiceFilter(page, "open")).toHaveAttribute("data-count", "1");
});

test("a collected invoice is paid", async ({ page }) => {
  await invoiceUnbilledTime(page, REFERENCE);
  const drawer = await openInvoice(page, REFERENCE);
  await drawer.getByTestId("invoice-mark-collected").click();

  await expect(drawer.getByTestId("invoice-drawer-title")).toHaveAttribute(
    "data-status",
    "paid",
  );

  // The open drawer keeps the list behind it out of reach.
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(invoiceFilter(page, "paid")).toHaveAttribute("data-count", "1");
  await expect(invoiceFilter(page, "open")).toHaveAttribute("data-count", "0");
});

test("a reminder is kept in the invoice's history", async ({ page }) => {
  await invoiceUnbilledTime(page, REFERENCE);
  const drawer = await openInvoice(page, REFERENCE);
  await drawer.getByTestId("invoice-remind").click();

  await expect(
    byTestId(drawer, "invoice-history-item", { event: "reminded" }),
  ).toBeVisible();
});

test("an invoice without a reference is a draft, and deleting it frees the days", async ({
  page,
}) => {
  await invoiceUnbilledTime(page, "");
  await expect(invoiceFilter(page, "draft")).toHaveAttribute("data-count", "1");

  const drawer = await openInvoice(page, "");
  await drawer.getByTestId("invoice-delete-draft").click();
  await page.getByTestId("confirm-delete-submit").click();

  await expect(invoiceFilter(page, "draft")).toHaveAttribute("data-count", "0");
  await expect(unbilledWork(page)).toHaveAttribute(
    "data-amount-cents",
    THREE_DAYS_AT_550_CENTS,
  );
});

test("an invoice issued elsewhere is added by hand", async ({ page }) => {
  await page.goto("/invoices");
  await page.getByTestId("invoice-add-open").click();

  const dialog = page.getByTestId("invoice-add-dialog");
  await dialog.getByTestId("invoice-add-reference").fill("2026-037");
  await dialog.getByTestId("invoice-add-amount").fill("1200");
  await dialog.getByTestId("invoice-add-submit").click();

  await expect(dialog).toBeHidden();
  await expect(
    byTestId(page, "invoice-row", { reference: "2026-037" }),
  ).toHaveAttribute("data-amount-cents", "120000");
});
