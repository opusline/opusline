import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";

import { emptyExpenseDraft } from "../lib/expense-draft";
import { blockedExpense, expense } from "../lib/fixtures";
import { ExpenseSheet, type ExpenseSheetState } from "./expense-sheet";

function renderSheet(
  overrides: Partial<ComponentProps<typeof ExpenseSheet>> = {},
) {
  const props: ComponentProps<typeof ExpenseSheet> = {
    state: { mode: "create", initial: emptyExpenseDraft("2026-08-13") },
    isVatLiable: true,
    today: "2026-08-13",
    isSaving: false,
    error: null,
    fieldErrors: null,
    onOpenChange: vi.fn(),
    onSubmit: vi.fn(),
    ...overrides,
  };

  render(<ExpenseSheet {...props} />);

  return props;
}

it.each<[string, ExpenseSheetState]>([
  [
    "Ajouter une dépense",
    { mode: "create", initial: emptyExpenseDraft("2026-08-13") },
  ],
  ["Modifier la dépense", { mode: "edit", expense: expense() }],
])("titles the sheet « %s » for what it opens on", async (title, state) => {
  renderSheet({ state });

  expect(await screen.findByRole("dialog")).toHaveAccessibleName(title);
});

it("mounts no form while it is closed", () => {
  renderSheet({ state: null });

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Fournisseur")).not.toBeInTheDocument();
});

it("opens an edit on the row's values and its stored receipt", async () => {
  renderSheet({ state: { mode: "edit", expense: expense() } });

  expect(await screen.findByLabelText("Fournisseur")).toHaveValue("Lunaprint");
  expect(screen.getByLabelText("Montant TTC")).toHaveValue("429");
  expect(screen.getByText("lunaprint-facture-9921.pdf")).toBeInTheDocument();
  expect(screen.queryByLabelText("Saisie rapide")).not.toBeInTheDocument();
});

it("offers the receipt zone when the edited row has none", async () => {
  renderSheet({ state: { mode: "edit", expense: blockedExpense() } });

  expect(await screen.findByLabelText("Facture")).toHaveAttribute(
    "type",
    "file",
  );
  expect(
    screen.queryByRole("button", { name: "Remplacer" }),
  ).not.toBeInTheDocument();
});

it("closes from « Annuler »", async () => {
  const props = renderSheet();

  fireEvent.click(await screen.findByRole("button", { name: "Annuler" }));

  expect(props.onOpenChange).toHaveBeenCalledWith(false);
});
