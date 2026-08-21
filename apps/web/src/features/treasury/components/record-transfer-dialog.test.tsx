import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { RecordTransferDialog } from "./record-transfer-dialog";

function renderDialog(onSubmit = vi.fn(), transferableCents = 851_300) {
  render(
    <RecordTransferDialog
      accountToday="2026-08-13"
      coveredThrough="2026-08-10"
      error={null}
      isSaving={false}
      onOpenChange={() => {}}
      onSubmit={onSubmit}
      open
      transferableCents={transferableCents}
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

it("opens on the whole safe amount, so confirming is one click", () => {
  renderDialog();

  // Raw comparison, so the grouping separator is the real U+202F Intl emits,
  // not the ASCII space Testing Library's text matchers normalise it to.
  expect(screen.getByLabelText("Montant")).toHaveValue("8\u202f513");
});

it("seeds whole units, never the odd cents on the figure", () => {
  renderDialog(vi.fn(), 788_404);

  expect(screen.getByLabelText("Montant")).toHaveValue("7\u202f884");
});

it("opens empty when the provisions already outgrow the account", () => {
  renderDialog(vi.fn(), -588_700);

  expect(screen.getByLabelText("Montant")).toHaveValue("");
  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
});

it("cannot be saved once the amount is cleared", () => {
  renderDialog();

  fireEvent.change(screen.getByLabelText("Montant"), { target: { value: "" } });

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
  const onSubmit = renderDialog();

  fireEvent.change(screen.getByLabelText("Date"), {
    target: { value: "14/08/2026" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).not.toHaveBeenCalled();
});

it("takes a date typed in the account's own layout", () => {
  const onSubmit = renderDialog();

  fireEvent.change(screen.getByLabelText("Date"), {
    target: { value: "09/08/2026" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ transferredOn: "2026-08-09" }),
  );
});
