import { createClient } from "../../support/provision";
import { expect, test } from "../../support/test";

test("the first client is created from the empty portfolio", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/clients");
  await expect(page.getByText("Create your first client")).toBeVisible();

  await page.getByRole("link", { name: "Create a client" }).click();
  await page.getByLabel("Company name").fill("Nordlys");
  await page.getByRole("button", { name: "Create the client" }).click();

  await expect(page).toHaveURL(/\/clients$/);
  await page.getByRole("link", { name: "Nordlys" }).click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Nordlys" }),
  ).toBeVisible();
});

test("editing a client renames it everywhere", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Nordlys" });

  await page.goto(`/clients/${client.slug}`);
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Company name").fill("Nordlys Conseil");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Nordlys Conseil" }),
  ).toBeVisible();
});

test("an archived client leaves the active portfolio", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Studio Lorem" });

  await page.goto(`/clients/${client.slug}`);
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByRole("menuitem", { name: "Archive this client" }).click();
  await expect(page.getByText("Archived", { exact: true })).toBeVisible();

  await page.goto("/clients");
  await expect(page.getByRole("button", { name: "Active (0)" })).toBeVisible();
  await page.getByRole("button", { name: "Archived (1)" }).click();
  await expect(page.getByRole("link", { name: "Studio Lorem" })).toBeVisible();
});

test("a deleted client is gone for good", async ({
  page,
  api,
  account: _registered,
}) => {
  const client = await createClient(api, { name: "Ateliers Ruche" });

  await page.goto(`/clients/${client.slug}`);
  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByRole("menuitem", { name: "Delete this client" }).click();
  await page
    .getByRole("alertdialog", { name: "Delete this client?" })
    .getByRole("button", { name: "Delete the client" })
    .click();

  await expect(page.getByText("Client deleted")).toBeVisible();
  await expect(page).toHaveURL(/\/clients$/);
  await expect(page.getByText("Create your first client")).toBeVisible();
});
