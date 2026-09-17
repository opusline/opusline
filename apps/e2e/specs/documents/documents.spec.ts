import { pdfFile } from "../../support/files";
import { expect, test } from "../../support/test";

test("an administrative piece is filed, served back and deleted", async ({
  page,
  api,
  account: _registered,
}) => {
  await page.goto("/documents");
  await page
    .getByRole("main")
    .locator('input[type="file"]')
    .setInputFiles(pdfFile("attestation-urssaf.pdf"));
  await page
    .getByLabel("Type of attestation-urssaf.pdf")
    .selectOption("Certificate");
  await page.getByRole("button", { name: "Send 1 document" }).click();

  const download = page.getByRole("link", {
    name: "Download attestation-urssaf.pdf",
  });
  await expect(download).toBeVisible();

  const href = await download.getAttribute("href");
  expect(href).not.toBeNull();
  // The file is moved to the media disk by a queued job; it is readable from
  // the first disk until then, but not during the move itself.
  await expect(async () => {
    expect((await api.download(href as string)).status()).toBe(200);
  }).toPass();

  await page
    .getByRole("button", { name: "Delete attestation-urssaf.pdf" })
    .click();
  await expect(page.getByText(/^No administrative piece yet\./)).toBeVisible();
});
