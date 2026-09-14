import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import {
  blockedExpense,
  deferredExpense,
  expense,
  expensesMonth,
  franchiseExpensesMonth,
} from "../lib/fixtures";
import { ExpenseCardList } from "./expense-card-list";

function renderCards(
  overrides: Partial<Parameters<typeof ExpenseCardList>[0]> = {},
) {
  const month = overrides.month ?? expensesMonth();
  const props = {
    month,
    expenses: month.expenses,
    unit: "ht" as const,
    uploadingExpenseId: null,
    onAttachReceipt: vi.fn(),
    onDetachReceipt: vi.fn(),
    onEdit: vi.fn(),
    onDuplicate: vi.fn(),
    onDelete: vi.fn(),
    ...overrides,
  };

  render(<ExpenseCardList {...props} />);

  return props;
}

const pdf = () =>
  new File(["%PDF-1.4"], "vesterhus.pdf", { type: "application/pdf" });

it("prints the rate under an HT amount", () => {
  renderCards({ expenses: [expense()] });

  expect(screen.getByText("357,50 €")).toBeInTheDocument();
  expect(screen.getByText(/^20\s%$/)).toBeInTheDocument();
});

it("prints the HT figure under a TTC amount", () => {
  renderCards({ expenses: [expense()], unit: "ttc" });

  expect(screen.getByText("429,00 €")).toBeInTheDocument();
  expect(screen.getByText("357,50 € HT")).toBeInTheDocument();
});

it("keeps TVA figures off the cards under the franchise", () => {
  const month = franchiseExpensesMonth();
  const [franchiseExpense] = month.expenses.filter((row) => row.id === 1);

  renderCards({ month, expenses: [franchiseExpense], unit: "ttc" });

  expect(screen.getByText("429,00 €")).toBeInTheDocument();
  expect(screen.queryByText(/ HT$/)).not.toBeInTheDocument();
});

it("shows a blocked expense's pill beside a place to link its receipt", () => {
  renderCards({ expenses: [blockedExpense()] });

  expect(screen.getByText("Bloquée")).toBeInTheDocument();
  expect(
    screen.getByLabelText("Lier la facture de Vesterhus Énergie"),
  ).toBeEnabled();
});

it("notes the later CA3 box a regularisation lands in", () => {
  renderCards({ expenses: [{ ...deferredExpense(), isRegularisation: true }] });

  expect(
    screen.getByText("modifiée après déclaration → case 21, CA3 septembre"),
  ).toBeInTheDocument();
});

it("hands a file dropped on a card to that expense", () => {
  const props = renderCards({ expenses: [expense(), blockedExpense()] });
  const [, blockedCard] = screen.getAllByRole("listitem");

  fireEvent.drop(blockedCard, { dataTransfer: { files: [pdf()] } });

  expect(props.onAttachReceipt).toHaveBeenCalledWith(
    expect.objectContaining({ id: 2 }),
    expect.objectContaining({ length: 1 }),
  );
});

it("hands a file picked on a card to that expense", () => {
  const props = renderCards({ expenses: [blockedExpense()] });

  fireEvent.change(
    screen.getByLabelText("Lier la facture de Vesterhus Énergie"),
    { target: { files: [pdf()] } },
  );

  expect(props.onAttachReceipt).toHaveBeenCalledWith(
    expect.objectContaining({ id: 2 }),
    expect.objectContaining({ length: 1 }),
  );
});

it("ignores a drop that carries no file", () => {
  const props = renderCards({ expenses: [blockedExpense()] });

  fireEvent.drop(screen.getByRole("listitem"), {
    dataTransfer: { files: [] },
  });

  expect(props.onAttachReceipt).not.toHaveBeenCalled();
});
