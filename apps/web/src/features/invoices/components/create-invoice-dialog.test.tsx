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

it("offers no rate under the franchise en base, and leaves it to the API", () => {
  const onSubmit = renderDialog({
    vatLiable: false,
    todo: unbilledTodoRow({ vatRateBp: 0 }),
  });

  expect(screen.queryByLabelText("TVA")).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Créer la facture" }));

  // Null, not a hard-coded 0: a cached regime must never decide a fiscal number.
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ vatRateBp: null }),
  );
});

it("explains a rate it cannot read instead of silently doing nothing", () => {
  const onSubmit = renderDialog();
  const field = screen.getByLabelText("TVA");

  fireEvent.change(field, { target: { value: "beaucoup" } });

  expect(field).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Indiquez un taux entre 0 et 100.")).toBeVisible();

  const submit = screen.getByRole("button", { name: "Créer la facture" });

  expect(submit).toBeDisabled();

  fireEvent.click(submit);

  expect(onSubmit).not.toHaveBeenCalled();
});
