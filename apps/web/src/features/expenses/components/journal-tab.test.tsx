import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { emptyExpensesMonth } from "../lib/fixtures";
import { JournalTab } from "./journal-tab";

function renderJournal(isRefreshing: boolean) {
  return render(
    <JournalTab
      isRefreshing={isRefreshing}
      month={emptyExpensesMonth()}
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

it("marks the journal busy while another month loads", () => {
  renderJournal(true);

  expect(
    screen.getByText("TVA à déduire").closest("[aria-busy]"),
  ).toHaveAttribute("aria-busy", "true");
});

it("drops the busy mark once the month is there", () => {
  const { container } = renderJournal(false);

  expect(container.querySelector("[aria-busy]")).toBeNull();
});
