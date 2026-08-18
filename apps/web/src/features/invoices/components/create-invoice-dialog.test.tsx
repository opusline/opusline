import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { unbilledTodoRow } from "../lib/fixtures";
import {
  CreateInvoiceDialog,
  type CreateInvoiceSubmit,
} from "./create-invoice-dialog";

function renderDialog(
  props: Partial<React.ComponentProps<typeof CreateInvoiceDialog>> = {},
) {
  const onSubmit = vi.fn<(input: CreateInvoiceSubmit) => void>();

  render(
    <CreateInvoiceDialog
      error={null}
      isSaving={false}
      onOpenChange={() => {}}
      onSubmit={onSubmit}
      suggestedNumber="2026-021"
      todo={unbilledTodoRow()}
      vatLiable
      {...props}
    />,
  );

  return onSubmit;
}

it("starts on the rate the client is billed at", () => {
  renderDialog({ todo: unbilledTodoRow({ vatRateBp: 550 }) });

  expect(screen.getByLabelText("TVA")).toHaveValue("5,5");
});

it("bills a client outside the scope of TVA at zero", () => {
  renderDialog({ todo: unbilledTodoRow({ vatRateBp: 0 }) });

  expect(screen.getByLabelText("TVA")).toHaveValue("0");
});

it("sends the rate the field was left on", () => {
  const onSubmit = renderDialog();

  fireEvent.click(screen.getByRole("button", { name: "Créer la facture" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ vatRateBp: 2000 }),
  );
});

it("sends an edited rate rather than the client's", () => {
  const onSubmit = renderDialog();
  const field = screen.getByLabelText("TVA");

  fireEvent.change(field, { target: { value: "0" } });
  fireEvent.click(screen.getByRole("button", { name: "Créer la facture" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ vatRateBp: 0 }),
  );
});

it("refuses to submit a rate that is not one", () => {
  const onSubmit = renderDialog();
  const field = screen.getByLabelText("TVA");

  fireEvent.change(field, { target: { value: "beaucoup" } });
  fireEvent.click(screen.getByRole("button", { name: "Créer la facture" }));

  expect(onSubmit).not.toHaveBeenCalled();
});

it("offers no rate under the franchise en base, and invoices at zero", () => {
  const onSubmit = renderDialog({
    vatLiable: false,
    todo: unbilledTodoRow({ vatRateBp: 0 }),
  });

  expect(screen.queryByLabelText("TVA")).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Créer la facture" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ vatRateBp: 0 }),
  );
});
