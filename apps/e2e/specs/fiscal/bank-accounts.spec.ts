import { parisYesterday } from "../../support/dates";
import { joinBankAccountsBeta } from "../../support/provision";
import { bankStatementCsv } from "../../support/statements";
import { expect, test } from "../../support/test";

test("money moved between two of the user's accounts is marked internal on both sides", async ({
  page,
  api,
  account: _registered,
}) => {
  await joinBankAccountsBeta(api);
  const movedOn = parisYesterday();

  await page.goto("/bank-account");
  await page.getByTestId("bank-import-open").click();
  await page.getByTestId("bank-import-file").setInputFiles(
    bankStatementCsv("releve-orvella.csv", [
      {
        bookedOn: movedOn,
        label: "VIR EMIS COMPTE VESTERHUS",
        amount: "-500.00",
      },
    ]),
  );
  await page.getByTestId("bank-import-submit").click();
  await expect(page.getByTestId("bank-import-dialog")).toBeHidden();

  await page.getByTestId("bank-account-create").click();
  await page.getByTestId("bank-account-name").fill("Vesterhus");
  await page.getByTestId("bank-account-submit").click();
  await expect(page.getByTestId("bank-account-row")).toHaveCount(2);

  await page.getByTestId("bank-import-open").click();
  await page.getByTestId("bank-import-file").setInputFiles(
    bankStatementCsv("releve-vesterhus.csv", [
      {
        bookedOn: movedOn,
        label: "VIR RECU COMPTE ORVELLA",
        amount: "500.00",
      },
    ]),
  );
  // Accounts are listed oldest first, after the placeholder: the new one is third.
  await page.getByTestId("bank-import-account").selectOption({ index: 2 });
  await page.getByTestId("bank-import-submit").click();
  await expect(page.getByTestId("bank-import-dialog")).toBeHidden();

  await expect(page.getByTestId("bank-movement-internal-transfer")).toHaveCount(
    2,
  );
});
