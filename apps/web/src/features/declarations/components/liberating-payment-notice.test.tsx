import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { eur } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";

import { liberatingPaymentOutlook } from "../lib/fixtures";
import { LiberatingPaymentNotice } from "./liberating-payment-notice";

function renderNotice(
  outlook = liberatingPaymentOutlook(),
  today = "2026-09-17",
) {
  return render(
    <StoryRouter>
      <LiberatingPaymentNotice outlook={outlook} today={today} />
    </StoryRouter>,
  );
}

it("announces the coming end with the income and the limit behind it", async () => {
  renderNotice();

  const notice = await screen.findByRole("alert");

  expect(notice).toHaveTextContent(
    "Le versement libératoire prend fin le 1 janvier 2027",
  );
  expect(notice).toHaveTextContent(
    /revenu fiscal de référence 2025 \(34\s200\s€\) dépasse la limite de 29\s579\s€ pour 1 part\./,
  );
  expect(notice).toHaveTextContent(
    "Désactivez-le dans les réglages à cette date.",
  );
});

it("reads the limit for fractional parts", async () => {
  renderNotice(
    liberatingPaymentOutlook({
      referenceTaxIncomeLimit: eur(4_436_850),
      taxHouseholdQuarterParts: 6,
    }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(/pour 1,5 part\./);
});

it("asks to act now once the end has passed", async () => {
  renderNotice(
    liberatingPaymentOutlook({
      endsOn: "2026-01-01",
      reason: 1,
      referenceTaxIncome: null,
      referenceTaxIncomeYear: null,
      referenceTaxIncomeLimit: null,
      taxHouseholdQuarterParts: null,
      ceiling: eur(7_770_000),
    }),
  );

  const notice = await screen.findByRole("alert");

  expect(notice).toHaveTextContent(
    "Le versement libératoire ne s'applique plus depuis le 1 janvier 2026",
  );
  expect(notice).toHaveTextContent(
    /plafond micro-BNC \(77\s700\s€\) deux années de suite/,
  );
  expect(notice).toHaveTextContent("Désactivez-le dans les réglages.");
});

it("links to the tax settings", async () => {
  renderNotice();

  expect(
    await screen.findByRole("link", { name: "Réglages fiscaux" }),
  ).toHaveAttribute("href", "/settings?tab=fiscalite");
});

it("only nudges for the avis figures when nothing announces an end", async () => {
  renderNotice(
    liberatingPaymentOutlook({
      endsOn: null,
      reason: null,
      needsReferenceTaxIncome: true,
    }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    /Recopiez le revenu fiscal de référence/,
  );
});

it("says nothing when the avis vouches for the option", async () => {
  render(
    <StoryRouter>
      <LiberatingPaymentNotice
        outlook={liberatingPaymentOutlook({
          endsOn: null,
          reason: null,
          needsReferenceTaxIncome: false,
        })}
        today="2026-09-17"
      />
      <p>page</p>
    </StoryRouter>,
  );

  await screen.findByText("page");

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
