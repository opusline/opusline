import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { stubClipboard } from "@/test/clipboard";
import { StoryRouter } from "@/test/story-router";

import {
  annualDeclarations,
  cfeReturn,
  incomeTaxReturn,
} from "../lib/fixtures";
import { AnnualReturnSheet } from "./annual-return-sheet";

const clipboard = stubClipboard();

function renderSheet(
  overrides: Partial<Parameters<typeof AnnualReturnSheet>[0]> = {},
) {
  const props = {
    open: "incomeTax" as const,
    annual: annualDeclarations(),
    today: "2026-08-20",
    isBusy: false,
    onOpenChange: vi.fn(),
    onMarkDone: vi.fn(),
    onUndo: vi.fn(),
    onSaveCfeAmount: vi.fn(async () => {}),
    ...overrides,
  };

  render(
    <StoryRouter>
      <AnnualReturnSheet {...props} />
    </StoryRouter>,
  );

  return props;
}

it("hands the receipts over with the box they go in", async () => {
  renderSheet();

  expect(await screen.findByText(/^66\s800$/)).toBeInTheDocument();
  expect(
    screen.getByText("case 5TE · versement libératoire opté"),
  ).toBeInTheDocument();
  expect(screen.getByText("Sans option : case 5HQ.")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Copier" }));
  expect(clipboard.writeText).toHaveBeenCalledWith("66800");
});

it("names box 5HQ without the versement libératoire", async () => {
  renderSheet({
    annual: annualDeclarations({
      incomeTaxReturn: incomeTaxReturn({ box: 1, liberatingPaymentPaid: null }),
    }),
  });

  expect(await screen.findByText("case 5HQ")).toBeInTheDocument();
  expect(screen.queryByText(/Impôt déjà réglé/)).not.toBeInTheDocument();
});

it("reconciles the year against each URSSAF declaration", async () => {
  renderSheet();

  const table = await screen.findByRole("table");

  expect(screen.getByText("12 déclarations URSSAF")).toBeInTheDocument();
  expect(
    within(table).getByRole("row", { name: /^Mars 2026/ }),
  ).toHaveTextContent(/8\s250\s€30\/04\/2026/);
  expect(
    within(table).getByRole("row", { name: /^Août 2026/ }),
  ).toHaveTextContent("—à venir");
  expect(within(table).getByRole("row", { name: /^Total/ })).toHaveTextContent(
    "provisoire jusqu'au 31 déc.",
  );
});

it("asks for a closed month left undeclared rather than calling it ahead", async () => {
  renderSheet({ today: "2026-10-05" });

  const table = await screen.findByRole("table");

  expect(
    within(table).getByRole("row", { name: /^Août 2026/ }),
  ).toHaveTextContent(/0\s€à déclarer/);
  expect(
    within(table).getByRole("row", { name: /^Octobre 2026/ }),
  ).toHaveTextContent("—à venir");
});

it("estimates the taxable income and what the versement libératoire settled", async () => {
  renderSheet();

  expect(
    (await screen.findByText("Revenu imposable après abattement 34 %"))
      .nextElementSibling,
  ).toHaveTextContent(/^44\s088\s€$/);
  expect(
    screen.getByText("Impôt déjà réglé · versement libératoire 2026")
      .nextElementSibling,
  ).toHaveTextContent(/^1\s470\s€$/);
});

it("offers to file the 2042 only once its year is over", async () => {
  renderSheet();

  expect(await screen.findByText(/^66\s800$/)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Marquer comme déclarée" }),
  ).not.toBeInTheDocument();

  const props = renderSheet({ today: "2027-06-02" });

  fireEvent.click(
    await screen.findByRole("button", { name: "Marquer comme déclarée" }),
  );
  expect(props.onMarkDone).toHaveBeenCalled();
});

it("offers to undo a filed 2042", async () => {
  const props = renderSheet({
    annual: annualDeclarations({
      incomeTaxReturn: incomeTaxReturn({
        completion: { declaredOn: "2027-05-02", paidOn: null },
      }),
    }),
  });

  expect(await screen.findByText("déclarée le 02/05/2027")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Annuler le marquage" }));
  expect(props.onUndo).toHaveBeenCalled();
});

it("shows the CFE's estimate, its twelfths and the gap", async () => {
  renderSheet({ open: "cfe" });

  expect(await screen.findByText("Montant estimé")).toBeInTheDocument();
  expect(screen.getByText(/^312$/)).toBeInTheDocument();
  expect(
    screen.getByText("Provisionné · 9 mois").nextElementSibling,
  ).toHaveTextContent(/^234\s€$/);
  expect(screen.getByText("Écart").nextElementSibling).toHaveTextContent(
    /^−78\s€$/,
  );
  expect(screen.getByText("Écart").nextElementSibling).toHaveClass(
    "text-attention",
  );
});

it("pays the CFE", async () => {
  const props = renderSheet({ open: "cfe" });

  fireEvent.click(
    await screen.findByRole("button", { name: "Marquer comme payée" }),
  );
  expect(props.onMarkDone).toHaveBeenCalled();
});

it("takes the avis amount in a dialog and hands it over in cents", async () => {
  const props = renderSheet({ open: "cfe" });

  fireEvent.click(
    await screen.findByRole("button", { name: "Saisir le montant de l'avis" }),
  );
  fireEvent.change(await screen.findByLabelText("Montant de l'avis"), {
    target: { value: "340" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(props.onSaveCfeAmount).toHaveBeenCalledWith(34_000);
});

it.each([
  [
    cfeReturn({ isEstimate: false }),
    "Montant de l'avis",
    "montant saisi depuis l'avis",
  ],
  [
    cfeReturn({
      expected: null,
      isEstimate: false,
      provisioned: null,
      gap: null,
    }),
    "Montant estimé",
    /aucune estimation possible/,
  ],
])("reads the CFE amount for what it is", async (cfe, eyebrow, note) => {
  renderSheet({ open: "cfe", annual: annualDeclarations({ cfe }) });

  expect(await screen.findByText(eyebrow)).toBeInTheDocument();
  expect(screen.getByText(note)).toBeInTheDocument();
});

it("keeps a past year's CFE read-only", async () => {
  renderSheet({
    open: "cfe",
    today: "2027-01-10",
    annual: annualDeclarations({
      cfe: cfeReturn({ expected: null, provisioned: null, gap: null }),
    }),
  });

  expect(
    await screen.findByText(/la cotisation d'une année passée/),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Saisir le montant de l'avis" }),
  ).not.toBeInTheDocument();
});
