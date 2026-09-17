import { byTestId } from "../../support/locators";
import { expect, test } from "../../support/test";

const FISCAL_KIND_CFE = 3;

test("the timeline filters down to one kind of deadline", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/deadlines");
  await expect(
    byTestId(page, "deadline-item", { category: "urssaf" }).first(),
  ).toBeVisible();

  await byTestId(page, "deadline-filter", { filter: "other" }).click();

  await expect(
    byTestId(page, "deadline-item", { "fiscal-kind": FISCAL_KIND_CFE }),
  ).toHaveCount(1);
  await expect(
    byTestId(page, "deadline-item", { category: "urssaf" }),
  ).toHaveCount(0);
});

test("a deadline marked as done can be reopened", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/deadlines");

  const cfe = byTestId(page, "deadline-item", {
    "fiscal-kind": FISCAL_KIND_CFE,
  });
  await cfe.getByTestId("deadline-toggle").click();
  await expect(cfe).toHaveAttribute("data-done", "true");
  await expect(cfe.getByTestId("deadline-toggle")).toBeEnabled();
});

test("the calendar subscription hands out a private webcal address", async ({
  page,
  account: _registered,
}) => {
  await page.goto("/deadlines");
  await page.getByTestId("calendar-subscribe-open").click();

  await expect(page.getByTestId("calendar-address")).toHaveValue(
    /^webcal:\/\/.+\/api\/calendar\/.+\.ics$/,
  );
});
