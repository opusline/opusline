import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import { creditNoteFixture } from "../lib/invoice-document-fixture";
import { CreditNotesPanel } from "./credit-notes-panel";

function renderPanel(
  creditNotes = [creditNoteFixture],
  onRefund?: (creditNote: number, refundedOn: string) => void,
) {
  render(
    <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
      <CreditNotesPanel
        accountToday="2026-08-14"
        creditNotes={creditNotes}
        isPending={false}
        onRefund={onRefund}
      />
    </MoneyFormatProvider>,
  );
}

it("marks the refund a credit note owes as done, on the day chosen", () => {
  const onRefund = vi.fn();
  renderPanel([creditNoteFixture], onRefund);

  expect(screen.getByTestId("credit-note-row")).toHaveAttribute(
    "data-status",
    "issued",
  );
  fireEvent.click(screen.getByTestId("credit-note-mark-refunded"));

  expect(onRefund).toHaveBeenCalledWith(7, "2026-08-14");
});

it("offers nothing more on a settled credit note", () => {
  renderPanel(
    [{ ...creditNoteFixture, status: 1, settledOn: "2026-08-12" }],
    vi.fn(),
  );

  expect(screen.queryByTestId("credit-note-mark-refunded")).toBeNull();
  expect(
    screen.getByTestId("credit-note-download").getAttribute("href"),
  ).toContain("/invoicing/credit-notes/7/pdf");
});
