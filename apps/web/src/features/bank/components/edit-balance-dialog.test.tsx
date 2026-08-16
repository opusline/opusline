import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";

import { EditBalanceDialog } from "./edit-balance-dialog";

const NARROW_NBSP = "\u202f";

function renderDialog(
  overrides: Partial<ComponentProps<typeof EditBalanceDialog>> = {},
) {
  const onSubmit = vi.fn();

  render(
    <EditBalanceDialog
      open
      balance={{ amount: 1_482_000, currency: "EUR" }}
      isSaving={false}
      error={null}
      onOpenChange={() => {}}
      onSubmit={onSubmit}
      {...overrides}
    />,
  );

  return { onSubmit };
}

it("seeds the field with the current balance", () => {
  renderDialog();

  expect(screen.getByLabelText("Solde")).toHaveValue(`14${NARROW_NBSP}820`);
});

it("submits the typed balance as cents", () => {
  const { onSubmit } = renderDialog();

  fireEvent.change(screen.getByLabelText("Solde"), {
    target: { value: "15300,25" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(1_530_025);
});

it("accepts an overdraft", () => {
  const { onSubmit } = renderDialog({ balance: null });

  fireEvent.change(screen.getByLabelText("Solde"), {
    target: { value: "-350" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(-35_000);
});

it("refuses to submit an unreadable draft", () => {
  const { onSubmit } = renderDialog();

  fireEvent.change(screen.getByLabelText("Solde"), {
    target: { value: "douze" },
  });

  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
  expect(onSubmit).not.toHaveBeenCalled();
});

it("names the problem on an unreadable draft", () => {
  renderDialog();

  fireEvent.change(screen.getByLabelText("Solde"), {
    target: { value: "12," },
  });

  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
  expect(screen.getByLabelText("Solde")).toHaveAccessibleDescription(
    /Montant illisible/,
  );
});

it("surfaces the server's refusal", () => {
  renderDialog({ error: "Le solde n'a pas pu être enregistré." });

  expect(
    screen.getByText("Le solde n'a pas pu être enregistré."),
  ).toBeInTheDocument();
});
