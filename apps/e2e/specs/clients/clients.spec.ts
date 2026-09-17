import { byTestId } from "../../support/locators";
import { createClient } from "../../support/provision";
import { expect, test } from "../../support/test";

test("the first client is created from the empty portfolio", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/clients");
  await expect(page.getByTestId("clients-empty-state")).toBeVisible();

  await page.getByTestId("clients-create-first").click();
  await page.getByTestId("client-form-name").fill("Nordlys");
  await page.getByTestId("client-form-submit").click();

  await expect(page).toHaveURL(/\/clients$/);
  await byTestId(page, "client-row-link", { client: "nordlys" }).click();

  await expect(page.getByTestId("client-detail-name")).toHaveText("Nordlys");
});

test("editing a client renames it everywhere", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Nordlys" });

  await page.goto(`/clients/${client.slug}`);
  await page.getByTestId("client-edit-toggle").click();
  await page.getByTestId("client-form-name").fill("Nordlys Conseil");
  await page.getByTestId("client-form-submit").click();

  await expect(page.getByTestId("client-detail-name")).toHaveText(
    "Nordlys Conseil",
  );
});

test("an archived client leaves the active portfolio", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Studio Lorem" });

  await page.goto(`/clients/${client.slug}`);
  await page.getByTestId("client-actions").click();
  await page.getByTestId("client-archive-toggle").click();
  await expect(page.getByTestId("client-detail-name")).toHaveAttribute(
    "data-archived",
    "true",
  );

  await page.goto("/clients");
  await expect(
    byTestId(page, "clients-scope", { scope: "active" }),
  ).toHaveAttribute("data-count", "0");

  const archivedScope = byTestId(page, "clients-scope", { scope: "archived" });
  await expect(archivedScope).toHaveAttribute("data-count", "1");
  await archivedScope.click();
  await expect(
    byTestId(page, "client-row-link", { client: client.slug }),
  ).toHaveAttribute("data-archived", "true");
});

test("a deleted client is gone for good", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Ateliers Ruche" });

  await page.goto(`/clients/${client.slug}`);
  await page.getByTestId("client-actions").click();
  await page.getByTestId("client-delete").click();
  await page.getByTestId("confirm-delete-submit").click();

  await expect(page).toHaveURL(/\/clients$/);
  await expect(page.getByTestId("clients-empty-state")).toBeVisible();
});
