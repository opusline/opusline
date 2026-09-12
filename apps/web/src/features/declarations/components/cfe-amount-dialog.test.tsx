import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { CfeAmountDialog } from "./cfe-amount-dialog";

it("saves the typed avis amount in cents", async () => {
  const onSave = vi.fn(async () => {});

  render(
    <CfeAmountDialog
      initialCents={null}
      onOpenChange={() => {}}
      onSave={onSave}
      open
    />,
  );

  const save = await screen.findByRole("button", { name: "Enregistrer" });
  expect(save).toBeDisabled();

  fireEvent.change(screen.getByLabelText("Montant de l'avis"), {
    target: { value: "340" },
  });
  fireEvent.click(save);

  expect(onSave).toHaveBeenCalledWith(34_000);
});

it("refuses a zero or unreadable amount", async () => {
  render(
    <CfeAmountDialog
      initialCents={31_200}
      onOpenChange={() => {}}
      onSave={async () => {}}
      open
    />,
  );

  const input = await screen.findByLabelText("Montant de l'avis");
  expect(input).toHaveValue("312");

  fireEvent.change(input, { target: { value: "0" } });

  expect(
    screen.getByText("Indiquez un montant supérieur à zéro."),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
});

it("shows the server's word when the save fails", async () => {
  render(
    <CfeAmountDialog
      initialCents={null}
      onOpenChange={() => {}}
      onSave={async () => {
        throw { status: 500 };
      }}
      open
    />,
  );

  fireEvent.change(await screen.findByLabelText("Montant de l'avis"), {
    target: { value: "340" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(
    await screen.findByText(
      "L'enregistrement a échoué. Réessayez dans un instant.",
    ),
  ).toBeInTheDocument();
});
