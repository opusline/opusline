import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { expense } from "../lib/fixtures";
import { DeleteExpenseDialog } from "./delete-expense-dialog";

it("names what is about to go and hands the expense to the confirmation", async () => {
  const onConfirm = vi.fn();

  render(
    <DeleteExpenseDialog
      expense={expense()}
      isDeleting={false}
      onConfirm={onConfirm}
      onOpenChange={() => {}}
    />,
  );

  expect(
    await screen.findByText(/Lunaprint · 429,00 € le 21\/08\/2026/),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Supprimer la dépense" }));

  expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
});

it("stays closed without an expense", () => {
  render(
    <DeleteExpenseDialog
      expense={null}
      isDeleting={false}
      onConfirm={() => {}}
      onOpenChange={() => {}}
    />,
  );

  expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
});

it("holds both buttons while the deletion runs", async () => {
  render(
    <DeleteExpenseDialog
      expense={expense()}
      isDeleting
      onConfirm={() => {}}
      onOpenChange={() => {}}
    />,
  );

  expect(
    await screen.findByRole("button", { name: "Supprimer la dépense" }),
  ).toBeDisabled();
  expect(screen.getByRole("button", { name: "Annuler" })).toBeDisabled();
});
