import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { blockedExpense, deferredExpense, expense } from "../lib/fixtures";
import { ExpenseRowMenu } from "./expense-row-menu";

it("asks once more before detaching the receipt", async () => {
  const onDetachReceipt = vi.fn();

  render(
    <ExpenseRowMenu
      canMoveVat
      expense={expense()}
      onDelete={() => {}}
      onDetachReceipt={onDetachReceipt}
      onDeferVat={() => {}}
      onDuplicate={() => {}}
      onEdit={() => {}}
      onReintegrateVat={() => {}}
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
      canMoveVat
      expense={blockedExpense()}
      onDelete={() => {}}
      onDetachReceipt={() => {}}
      onDeferVat={() => {}}
      onDuplicate={() => {}}
      onEdit={() => {}}
      onReintegrateVat={() => {}}
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

it("offers to defer a deduction, and to put a deferred one back", async () => {
  const onDeferVat = vi.fn();
  const onReintegrateVat = vi.fn();
  const { rerender } = render(
    <ExpenseRowMenu
      canMoveVat
      expense={expense()}
      onDeferVat={onDeferVat}
      onDelete={() => {}}
      onDetachReceipt={() => {}}
      onDuplicate={() => {}}
      onEdit={() => {}}
      onReintegrateVat={onReintegrateVat}
    />,
  );

  fireEvent.click(
    screen.getByRole("button", { name: "Actions pour Lunaprint" }),
  );
  fireEvent.click(
    await screen.findByRole("menuitem", {
      name: "Reporter sur la prochaine CA3",
    }),
  );

  expect(onDeferVat).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));

  rerender(
    <ExpenseRowMenu
      canMoveVat
      expense={deferredExpense()}
      onDeferVat={onDeferVat}
      onDelete={() => {}}
      onDetachReceipt={() => {}}
      onDuplicate={() => {}}
      onEdit={() => {}}
      onReintegrateVat={onReintegrateVat}
    />,
  );

  fireEvent.click(
    screen.getByRole("button", { name: "Actions pour Callisto Télécom" }),
  );
  fireEvent.click(
    await screen.findByRole("menuitem", { name: "Réintégrer dans la CA3" }),
  );

  expect(onReintegrateVat).toHaveBeenCalledWith(
    expect.objectContaining({ id: 4 }),
  );
});

it("moves no TVA on a row that has none to move", async () => {
  render(
    <ExpenseRowMenu
      canMoveVat={false}
      expense={expense()}
      onDeferVat={() => {}}
      onDelete={() => {}}
      onDetachReceipt={() => {}}
      onDuplicate={() => {}}
      onEdit={() => {}}
      onReintegrateVat={() => {}}
    />,
  );

  fireEvent.click(
    screen.getByRole("button", { name: "Actions pour Lunaprint" }),
  );

  expect(
    await screen.findByRole("menuitem", { name: "Modifier" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("menuitem", { name: /CA3/ }),
  ).not.toBeInTheDocument();
});
