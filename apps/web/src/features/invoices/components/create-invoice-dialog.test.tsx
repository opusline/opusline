import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { forfaitPrefill, unbilledPrefill } from "../lib/fixtures";
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
      prefill={unbilledPrefill()}
      vatLiable
      {...props}
    />,
  );

  return onSubmit;
}

it("starts on the rate the client is billed at", () => {
  renderDialog({ prefill: unbilledPrefill({ vatRateBp: 550 }) });

  expect(screen.getByLabelText("TVA")).toHaveValue("5,5");
});

it("bills a client outside the scope of TVA at zero", () => {
  renderDialog({ prefill: unbilledPrefill({ vatRateBp: 0 }) });

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
    prefill: unbilledPrefill({ vatRateBp: 0 }),
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

it("bills a fixed price without consuming any tracked time", () => {
  const onSubmit = renderDialog({ prefill: forfaitPrefill() });

  fireEvent.change(screen.getByLabelText("Montant HT"), {
    target: { value: "2400" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer la facture" }));

  // A forfait bills a price, not the time behind it: linking entries here would
  // mark them invoiced and quietly retire them from the mission's own history.
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      amountHtCents: 240_000,
      timeEntryIds: [],
      periodStart: null,
      periodEnd: null,
    }),
  );
});

it("opens a fixed price on an empty amount rather than a guess", () => {
  renderDialog({ prefill: forfaitPrefill() });

  const amount = screen.getByLabelText("Montant HT");

  expect(amount).toHaveValue("");
  // Empty is not wrong yet — flagging it red before the user has typed would
  // read as a rejection of something they never entered.
  expect(amount).not.toHaveAttribute("aria-invalid", "true");
  expect(
    screen.getByRole("button", { name: "Créer la facture" }),
  ).toBeDisabled();
});

it("shows what a fixed price still has to bill", () => {
  renderDialog({ prefill: forfaitPrefill() });

  expect(screen.getByText("Reste à facturer")).toBeVisible();
  // The value of tracked time is a figure a forfait does not have.
  expect(screen.queryByText("Valeur du temps")).toBeNull();
});
