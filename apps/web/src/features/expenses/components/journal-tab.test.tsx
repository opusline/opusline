import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";

import { declaredExpensesMonth, expensesMonth } from "../lib/fixtures";
import { JournalTab } from "./journal-tab";

function renderJournal(
  overrides: Partial<Parameters<typeof JournalTab>[0]> = {},
) {
  const props = {
    month: expensesMonth(),
    unit: "ht" as const,
    isRefreshing: false,
    uploadingExpenseId: null,
    onAttachReceipt: vi.fn(),
    onDetachReceipt: vi.fn(),
    onEdit: vi.fn(),
    onDuplicate: vi.fn(),
    onDeferVat: vi.fn(),
    onReintegrateVat: vi.fn(),
    onDelete: vi.fn(),
    onRecategorize: vi.fn(),
    onDeferSelectedVat: vi.fn(),
    onLinkReceiptHint: vi.fn(),
    onUndoDeclared: vi.fn(),
    onCreateFromDebit: vi.fn(),
    isBulkBusy: false,
    isUndoBusy: false,
    ...overrides,
  };

  render(
    <StoryRouter>
      <JournalTab {...props} />
    </StoryRouter>,
  );

  return props;
}

it("counts each filter and keeps only its rows", async () => {
  renderJournal();

  const blocked = await screen.findByRole("button", {
    name: /Sans justificatif/,
  });
  expect(blocked).toHaveTextContent("2");

  fireEvent.click(blocked);

  expect(
    within(screen.getByRole("table")).getAllByText("Bloquée"),
  ).toHaveLength(2);
  expect(screen.queryByText("À déduire")).not.toBeInTheDocument();
});

it("says so when the filter keeps nothing", async () => {
  renderJournal({
    month: expensesMonth({ expenses: expensesMonth().expenses.slice(1, 2) }),
  });

  fireEvent.click(await screen.findByRole("button", { name: /Reportées/ }));

  expect(screen.getByText("Aucune dépense dans ce filtre")).toBeInTheDocument();
});

it("swaps the chips for the bulk bar and defers the selection", async () => {
  const props = renderJournal();

  fireEvent.click(await screen.findByLabelText("Sélectionner Lunaprint"));
  fireEvent.click(screen.getByLabelText("Sélectionner Orvella Cloud"));

  expect(screen.getByRole("status")).toHaveTextContent("2 sélectionnées");

  fireEvent.click(screen.getByRole("button", { name: "Reporter" }));

  // The reverse-charged row has no deduction to move: only Lunaprint goes.
  expect(props.onDeferSelectedVat).toHaveBeenCalledWith([1]);
  expect(screen.getByRole("status")).toBeEmptyDOMElement();
});

it("spells out what the TVA figure leaves aside", async () => {
  renderJournal();

  expect(
    await screen.findByText(/\+ 18,18 € bloqués · 2 factures à lier/),
  ).toBeInTheDocument();
  expect(screen.getByText(/\+ 9,60 € autoliquidés/)).toBeInTheDocument();
  expect(
    screen.getByText(/\+ 3,38 € reportés · CA3 septembre/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/TVA collectée 550,00 € → solde à payer 478,50 €/),
  ).toBeInTheDocument();
});

it("recategorises the selection and puts the chips back", async () => {
  const props = renderJournal();

  fireEvent.click(await screen.findByLabelText("Sélectionner Lunaprint"));
  fireEvent.click(screen.getByRole("button", { name: "Catégorie" }));
  fireEvent.click(await screen.findByRole("menuitem", { name: "Logiciel" }));

  expect(props.onRecategorize).toHaveBeenCalledWith([1], 1);
  expect(
    await screen.findByRole("button", { name: /Sans justificatif/ }),
  ).toBeInTheDocument();
});

it("hands an unmatched debit over to a prefilled sheet", async () => {
  const props = renderJournal();

  fireEvent.click(
    await screen.findByRole("button", { name: "Créer la dépense" }),
  );

  expect(props.onCreateFromDebit).toHaveBeenCalledWith(
    expect.objectContaining({ kind: 1, bankMovementId: 210 }),
  );
});

it("shows the filed month's banner and hands the undo over", async () => {
  const props = renderJournal({ month: declaredExpensesMonth() });

  expect(
    await screen.findByText(
      /CA3 août déclarée le 09\/09\/2026 · 71,50 € déduits/,
    ),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Annuler le marquage" }));

  expect(props.onUndoDeclared).toHaveBeenCalled();
});

it("lists what is left to handle next to the journal", async () => {
  renderJournal();

  expect(
    await screen.findByText("Vesterhus Énergie · facture attendue"),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /Prélèvement du 12\/08\/2026 passé, la facture n'a pas été liée\. 14,00 € de TVA bloqués\./,
    ),
  ).toBeInTheDocument();
});
