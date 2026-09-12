import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { blockedExpense, expense } from "../lib/fixtures";
import { ExpenseRowMenu } from "./expense-row-menu";

it("asks once more before detaching the receipt", async () => {
  const onDetachReceipt = vi.fn();

  render(
    <ExpenseRowMenu
      expense={expense()}
      onDelete={() => {}}
      onDetachReceipt={onDetachReceipt}
      onDuplicate={() => {}}
      onEdit={() => {}}
    />,
  );

  fireEvent.click(
    screen.getByRole("button", { name: "Actions pour Lunaprint" }),
  );
  fireEvent.click(
    await screen.findByRole("menuitem", { name: "Détacher la facture" }),
  );

  expect(onDetachReceipt).not.toHaveBeenCalled();

  fireEvent.click(
    await screen.findByRole("menuitem", { name: "Confirmer le détachement ?" }),
  );

  expect(onDetachReceipt).toHaveBeenCalledWith(
    expect.objectContaining({ id: 1 }),
  );
});

it("offers no detachment when there is no receipt", async () => {
  render(
    <ExpenseRowMenu
      expense={blockedExpense()}
      onDelete={() => {}}
      onDetachReceipt={() => {}}
      onDuplicate={() => {}}
      onEdit={() => {}}
    />,
  );

  fireEvent.click(
    screen.getByRole("button", { name: "Actions pour Vesterhus Énergie" }),
  );

  expect(
    await screen.findByRole("menuitem", { name: "Supprimer" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("menuitem", { name: "Détacher la facture" }),
  ).not.toBeInTheDocument();
});
