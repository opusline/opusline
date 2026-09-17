import { pdfFile } from "../../support/files";
import { byTestId } from "../../support/locators";
import { expect, test } from "../../support/test";

const FILE_NAME = "attestation-urssaf.pdf";
const CATEGORY_CERTIFICATE = "7";

test("an administrative piece is filed, served back and deleted", async ({
  page,
  api,
  account: _registered,
}) => {
  await page.goto("/documents");
  await page.getByTestId("documents-upload").setInputFiles(pdfFile(FILE_NAME));
  await byTestId(page, "documents-pending-item", { name: FILE_NAME })
    .getByTestId("documents-pending-type")
    .selectOption(CATEGORY_CERTIFICATE);
  await page.getByTestId("documents-send").click();

  const document = byTestId(page, "document-row", { name: FILE_NAME });
  await expect(document).toBeVisible();

  const href = await document
    .getByTestId("document-download")
    .getAttribute("href");
  expect(href).not.toBeNull();
  // The file is moved to the media disk by a queued job; it is readable from
  // the first disk until then, but not during the move itself.
  await expect(async () => {
    expect((await api.download(href as string)).status()).toBe(200);
  }).toPass();

  await document.getByTestId("document-delete").click();
  await expect(page.getByTestId("documents-empty")).toBeVisible();
});
