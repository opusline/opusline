import type { ExpensesMonthData } from "@opusline/api-client";
import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { emptyExpensesMonth, expensesMonth } from "../lib/fixtures";
import { ExpenseList } from "./expense-list";

function renderList(month: ExpensesMonthData) {
  render(
    <ExpenseList
      month={month}
      onAttachReceipt={vi.fn()}
      onDelete={vi.fn()}
      onDetachReceipt={vi.fn()}
      onDuplicate={vi.fn()}
      onEdit={vi.fn()}
      unit="ht"
      uploadingExpenseId={null}
    />,
  );
}

it("names the month when nothing was spent in it", () => {
  renderList(emptyExpensesMonth());

  expect(screen.getByText("Aucune dépense en août")).toBeInTheDocument();
  expect(
    screen.getByText("Les abonnements seront créés à leur prélèvement."),
  ).toBeInTheDocument();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

it("lays every expense out both as a table row and as a card", () => {
  renderList(expensesMonth());

  expect(screen.getAllByRole("row")).toHaveLength(7);
  expect(screen.getAllByRole("listitem")).toHaveLength(6);
});
