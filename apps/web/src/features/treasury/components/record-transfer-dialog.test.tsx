import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { RecordTransferDialog } from "./record-transfer-dialog";

function renderDialog(onSubmit = vi.fn()) {
  render(
    <RecordTransferDialog
      accountToday="2026-08-13"
      coveredThrough="2026-08-10"
      error={null}
      isSaving={false}
      onOpenChange={() => {}}
      onSubmit={onSubmit}
      open
    />,
  );

  return onSubmit;
}

it("says the transfer is the user's to make, not the app's", () => {
  renderDialog();

  expect(
    screen.getByText(/Opusline n'exécute pas le virement/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Le solde connu couvre jusqu'au 10\/08\/2026/),
  ).toBeInTheDocument();
});

it("cannot be saved before an amount is typed", () => {
  renderDialog();

  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
});

it("reports the amount in cents with its date and note", () => {
  const onSubmit = renderDialog();

  fireEvent.change(screen.getByLabelText("Montant"), {
    target: { value: "1200" },
  });
  fireEvent.change(screen.getByLabelText("Note"), {
    target: { value: "Salaire août" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith({
    amountCents: 120_000,
    transferredOn: "2026-08-13",
    note: "Salaire août",
  });
});

it("reports a blank note as none rather than an empty string", () => {
  const onSubmit = renderDialog();

  fireEvent.change(screen.getByLabelText("Montant"), {
    target: { value: "300" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith({
    amountCents: 30_000,
    transferredOn: "2026-08-13",
    note: null,
  });
});

it("cannot be saved once the date is cleared", () => {
  renderDialog();

  fireEvent.change(screen.getByLabelText("Montant"), {
    target: { value: "1200" },
  });
  fireEvent.change(screen.getByLabelText("Date"), { target: { value: "" } });

  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
});

it("refuses to post-date a transfer already made", () => {
  renderDialog();

  expect(screen.getByLabelText("Date")).toHaveAttribute("max", "2026-08-13");
});
