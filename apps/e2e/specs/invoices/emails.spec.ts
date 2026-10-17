import { byTestId } from "../../support/locators";
import { emailCountFor } from "../../support/mailbox";
import { joinInvoicingBeta } from "../../support/provision";
import { expect, test } from "../../support/test";

test.beforeEach(async ({ api, account: _registered }) => {
  await joinInvoicingBeta(api);
});

test("a template is reworded, kept, previewed and restored", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/invoicing/emails");
  await byTestId(page, "emails-kind", { kind: "new-quote" }).click();
  await expect(
    byTestId(page, "emails-kind", { kind: "new-quote" }),
  ).toHaveAttribute("data-modified", "false");

  await page.getByTestId("emails-subject").fill("Notre devis {numero}");
  await page.getByTestId("emails-body").fill("Bonjour {contact},");
  await byTestId(page, "emails-variable", { name: "montant" }).click();
  await expect(page.getByTestId("emails-body")).toHaveValue(
    "Bonjour {contact},{montant}",
  );

  const saved = page.waitForResponse(
    (response) =>
      response.url().includes("/api/invoicing/emails/1") &&
      response.request().method() === "PUT",
  );
  await page.getByTestId("emails-save").click();
  expect((await saved).status()).toBe(200);
  await expect(page.getByTestId("emails-save")).toBeHidden();
  await expect(
    byTestId(page, "emails-kind", { kind: "new-quote" }),
  ).toHaveAttribute("data-modified", "true");

  await page.reload();
  await byTestId(page, "emails-kind", { kind: "new-quote" }).click();
  await expect(page.getByTestId("emails-subject")).toHaveValue(
    "Notre devis {numero}",
  );
  // The preview fills the placeholders with the sample quote's figures.
  await expect(page.getByTestId("emails-preview-subject")).toContainText(
    "D-2026-003",
  );

  await page.getByTestId("emails-reset").click();
  await expect(
    byTestId(page, "emails-kind", { kind: "new-quote" }),
  ).toHaveAttribute("data-modified", "false");
  await expect(page.getByTestId("emails-subject")).not.toHaveValue(
    "Notre devis {numero}",
  );
});

test("the sample e-mail is sent to the account itself", async ({
  page,
  request,
  account,
}) => {
  await page.goto("/invoicing/emails");
  const before = await emailCountFor(request, account.email);

  const sent = page.waitForResponse(
    (response) =>
      response.url().includes("/api/invoicing/emails/0/test") &&
      response.request().method() === "POST",
  );
  await page.getByTestId("emails-send-test").click();
  expect((await sent).status()).toBe(204);

  await expect
    .poll(() => emailCountFor(request, account.email), { timeout: 30_000 })
    .toBe(before + 1);
});

test("the reminder defaults are kept for the next invoices", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/invoicing/emails");
  await byTestId(page, "emails-kind", { kind: "payment-reminder" }).click();

  const saved = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/invoicing/emails/reminders") &&
      response.request().method() === "PUT",
  );
  await page.getByTestId("emails-reminders-frequency").selectOption("2");
  expect((await saved).status()).toBe(200);
  await page.getByTestId("emails-reminders-toggle").click();

  await page.reload();
  await byTestId(page, "emails-kind", { kind: "payment-reminder" }).click();
  await expect(page.getByTestId("emails-reminders-frequency")).toHaveValue("2");
  await expect(page.getByTestId("emails-reminders-toggle")).toHaveAttribute(
    "aria-checked",
    "true",
  );
});
