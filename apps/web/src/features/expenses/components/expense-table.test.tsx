import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";

import {
  blockedExpense,
  declaredExpensesMonth,
  expense,
  expensesMonth,
  franchiseExpensesMonth,
  reverseChargedExpense,
} from "../lib/fixtures";
import { ExpenseTable } from "./expense-table";

function renderTable(
  overrides: Partial<Parameters<typeof ExpenseTable>[0]> = {},
) {
  const month = overrides.month ?? expensesMonth();
  const props = {
    month,
    expenses: month.expenses,
    unit: "ht" as const,
    uploadingExpenseId: null,
    onAttachReceipt: vi.fn(),
    onDetachReceipt: vi.fn(),
    onDelete: vi.fn(),
    ...overrides,
  };

  render(
    <StoryRouter>
      <ExpenseTable {...props} />
    </StoryRouter>,
  );

  return props;
}

it("prints each row's amounts and the rate under the TVA", async () => {
  renderTable({ expenses: [expense(), reverseChargedExpense()] });

  expect(await screen.findByText("357,50 €")).toBeInTheDocument();
  expect(screen.getByText("429,00 €")).toBeInTheDocument();
  expect(screen.getByText(/^20\s%$/)).toBeInTheDocument();
  expect(screen.getByText(/^autoliq\. 20\s%$/)).toBeInTheDocument();
});

it("names the CA3 each status points to", async () => {
  renderTable();

  expect(await screen.findByText("À déduire")).toBeInTheDocument();
  expect(screen.getByText("CA3 août")).toBeInTheDocument();
  expect(screen.getByText("Reportée")).toBeInTheDocument();
  expect(screen.getByText("CA3 septembre")).toBeInTheDocument();
  expect(screen.getByText("Autoliquidée")).toBeInTheDocument();
  expect(screen.getByText("hors UE · due et déduite")).toBeInTheDocument();
});

it("locks every deducted row once the month is filed", async () => {
  renderTable({ month: declaredExpensesMonth() });

  expect(await screen.findByText("Déduite")).toBeInTheDocument();
  expect(screen.getByText("CA3 du 09/09/2026")).toBeInTheDocument();
  expect(screen.getAllByText("Verrouillée · mois déclaré")).toHaveLength(1);
});

it("only tracks the receipt under the franchise", async () => {
  renderTable({ month: franchiseExpensesMonth() });

  expect((await screen.findAllByText("Facture liée")).length).toBeGreaterThan(
    0,
  );
  expect(screen.queryByText("À déduire")).not.toBeInTheDocument();
  expect(screen.getAllByText("Facture manquante").length).toBeGreaterThan(0);
});

it("links a receipt for download and offers a drop target without one", async () => {
  renderTable({ expenses: [expense(), blockedExpense()] });

  expect(
    await screen.findByRole("link", {
      name: "Ouvrir la facture lunaprint-facture-9921.pdf",
    }),
  ).toHaveAttribute("href", expect.stringContaining("/expenses/1/receipt"));
  expect(
    screen.getByLabelText("Lier la facture de Vesterhus Énergie"),
  ).toBeInTheDocument();
});

it("hands a file dropped on a row to that expense", async () => {
  const props = renderTable({ expenses: [blockedExpense()] });
  const file = new File(["%PDF-1.4"], "vesterhus.pdf", {
    type: "application/pdf",
  });
  const row = (
    await screen.findByRole("button", {
      name: "Actions pour Vesterhus Énergie",
    })
  ).closest("tr") as HTMLElement;

  fireEvent.drop(row, { dataTransfer: { files: [file] } });

  expect(props.onAttachReceipt).toHaveBeenCalledWith(
    expect.objectContaining({ id: 2 }),
    expect.objectContaining({ length: 1 }),
  );
});

it("says a receipt is on its way for the row being uploaded", async () => {
  renderTable({ expenses: [blockedExpense()], uploadingExpenseId: 2 });

  expect(await screen.findByText("Envoi…")).toBeInTheDocument();
  expect(
    screen.getByLabelText("Lier la facture de Vesterhus Énergie"),
  ).toBeDisabled();
});
