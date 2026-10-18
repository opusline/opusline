import {
  createBillableClient,
  fillInvoicingIdentity,
  issueQuote,
  joinInvoicingBeta,
} from "../../support/provision";
import { expect, test } from "../../support/test";

test("a refused quote is reopened, waiting for the client again", async ({
  page,
  api,
  account: _registered,
}) => {
  await joinInvoicingBeta(api);
  await fillInvoicingIdentity(api);
  const client = await createBillableClient(api, { name: "Callisto" });
  const { quote } = await issueQuote(api, client);

  await page.goto(`/invoicing/quotes/${quote.id}`);
  await page.getByTestId("quote-refuse").click();
  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "refused",
  );

  await page.getByTestId("quote-reopen").click();
  await expect(page.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "sent",
  );
  await expect(page.getByTestId("quote-accept")).toBeVisible();
});
