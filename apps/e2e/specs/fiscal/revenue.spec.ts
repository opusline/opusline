import { parisToday } from "../../support/dates";
import { byTestId } from "../../support/locators";
import {
  addInvoice,
  createClient,
  INVOICE_STATUS_PAID,
  INVOICE_STATUS_SENT,
} from "../../support/provision";
import { expect, test } from "../../support/test";

test.beforeEach(async ({ api, account: _registered }) => {
  const client = await createClient(api, { name: "Vesterhus" });

  await addInvoice(api, {
    clientId: client.id,
    number: "2026-036",
    status: INVOICE_STATUS_PAID,
    issuedOn: parisToday(),
    paidOn: parisToday(),
    amountHt: { amount: 122_400, currency: "EUR" },
  });
  await addInvoice(api, {
    clientId: client.id,
    number: "2026-037",
    status: INVOICE_STATUS_SENT,
    issuedOn: parisToday(),
    amountHt: { amount: 80_000, currency: "EUR" },
  });
});

test("invoiced revenue counts every invoice issued this month", async ({
  page,
}) => {
  await page.goto("/revenue");

  await expect(
    byTestId(page, "revenue-total", { basis: "invoiced" }),
  ).toHaveAttribute("data-amount-cents", "202400");
});

test("collected revenue only counts what was paid", async ({ page }) => {
  await page.goto("/revenue");
  await byTestId(page, "revenue-basis", { basis: "collected" }).click();

  await expect(
    byTestId(page, "revenue-total", { basis: "collected" }),
  ).toHaveAttribute("data-amount-cents", "122400");
});
