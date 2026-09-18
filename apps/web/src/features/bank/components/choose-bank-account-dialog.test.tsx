import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";

import { ChooseBankAccountDialog } from "./choose-bank-account-dialog";

function renderDialog(
  overrides: Partial<ComponentProps<typeof ChooseBankAccountDialog>> = {},
) {
  const onSubmit = vi.fn();

  render(
    <ChooseBankAccountDialog
      accounts={[
        { uid: "a-1", name: "Compte pro", ibanLast4: "0185" },
        { uid: "a-2", name: null, ibanLast4: null },
      ]}
      error={null}
      isSaving={false}
      onOpenChange={() => {}}
      onSubmit={onSubmit}
      open
      {...overrides}
    />,
  );

  return { onSubmit };
}

it("waits for an account before syncing any", () => {
  renderDialog();

  expect(screen.getByTestId("bank-account-choice-submit")).toBeDisabled();
});

it("syncs the account picked", () => {
  const { onSubmit } = renderDialog();

  fireEvent.click(screen.getByRole("radio", { name: /Compte pro/ }));
  fireEvent.click(screen.getByTestId("bank-account-choice-submit"));

  expect(onSubmit).toHaveBeenCalledExactlyOnceWith("a-1");
});

it("names an account the bank left unnamed", () => {
  renderDialog();

  expect(screen.getByText("Compte sans nom")).toBeInTheDocument();
});

it("says why the choice failed", () => {
  renderDialog({ error: "Ce compte n'a pas pu être choisi." });

  expect(
    screen.getByText("Ce compte n'a pas pu être choisi."),
  ).toBeInTheDocument();
});
