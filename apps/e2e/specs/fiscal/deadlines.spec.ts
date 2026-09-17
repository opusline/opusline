import { expect, test } from "../../support/test";

test("the timeline filters down to one kind of deadline", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/deadlines");
  await page.getByRole("button", { name: /^Other \(/ }).click();

  const deadlines = page.getByRole("main").getByRole("listitem");
  await expect(deadlines.filter({ hasText: "CFE" })).toHaveCount(1);
  await expect(deadlines.filter({ hasText: "Déclaration URSSAF" })).toHaveCount(
    0,
  );
});

test("a deadline marked as done can be reopened", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/deadlines");
  await page.getByRole("button", { name: /^Mark as done — CFE/ }).click();

  await expect(
    page.getByRole("button", { name: /^Mark as not done — CFE/ }),
  ).toBeVisible();
});

test("the calendar subscription hands out a private webcal address", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/deadlines");
  await page.getByRole("button", { name: "Subscribe to the calendar" }).click();

  await expect(
    page
      .getByRole("dialog", { name: "Subscribe to the calendar" })
      .getByLabel("Subscription address"),
  ).toHaveValue(/^webcal:\/\/.+\/api\/calendar\/.+\.ics$/);
});
