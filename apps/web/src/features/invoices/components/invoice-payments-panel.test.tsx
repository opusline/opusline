import type { InvoicePaymentData } from "@opusline/api-client";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import { eur } from "@/test/fixtures";
import { InvoicePaymentsPanel } from "./invoice-payments-panel";

const PAYMENTS: InvoicePaymentData[] = [
  {
    id: 1,
    amount: eur(100_000),
    paidOn: "2026-08-10",
    bankMovementId: null,
    creditNoteId: null,
    note: null,
  },
  {
    id: 2,
    amount: eur(98_000),
    paidOn: "2026-09-02",
    bankMovementId: 55,
    creditNoteId: null,
    note: null,
  },
];

function renderPanel(onRemove?: (payment: number) => void) {
  render(
    <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
      <InvoicePaymentsPanel
        isPending={false}
        onRemove={onRemove}
        payments={PAYMENTS}
      />
    </MoneyFormatProvider>,
  );
}

it("lists each payment with its day, and says which came from the bank", () => {
  renderPanel();

  const rows = screen.getAllByTestId("invoice-payment");
  expect(rows).toHaveLength(2);
  expect(rows[0]).toHaveAttribute("data-amount-cents", "100000");
  expect(rows[0]).toHaveTextContent("10/08/2026");
  expect(rows[1]).toHaveTextContent("Banque");
  expect(rows[0]).not.toHaveTextContent("Banque");
});

it("offers no removal where the screen cannot take a payment back", () => {
  renderPanel();

  expect(screen.queryByTestId("invoice-payment-remove")).toBeNull();
});

it("removes a payment only after the confirmation", async () => {
  const onRemove = vi.fn();
  renderPanel(onRemove);

  fireEvent.click(screen.getAllByTestId("invoice-payment-remove")[1]);

  const dialog = await screen.findByRole("alertdialog");
  expect(onRemove).not.toHaveBeenCalled();

  fireEvent.click(
    dialog.querySelector("[data-slot=alert-dialog-action]") as HTMLElement,
  );

  await waitFor(() => expect(onRemove).toHaveBeenCalledWith(2));
});
