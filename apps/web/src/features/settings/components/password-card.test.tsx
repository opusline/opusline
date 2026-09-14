import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import type { FormSubmitResult } from "@/lib/form";
import { PasswordCard } from "./password-card";

function renderCard(
  onSubmit: () => Promise<FormSubmitResult> = async () => ({
    status: "success",
  }),
) {
  const submit = vi.fn(onSubmit);

  render(<PasswordCard error={null} isPending={false} onSubmit={submit} />);

  return submit;
}

function fillAndSubmit(password: string, confirmation: string) {
  fireEvent.change(screen.getByLabelText("Nouveau mot de passe"), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText("Confirmer le mot de passe"), {
    target: { value: confirmation },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Changer le mot de passe" }),
  );
}

it("sends the new password and says what changing it did", async () => {
  const submit = renderCard();

  fillAndSubmit("un-nouveau-mot-de-passe", "un-nouveau-mot-de-passe");

  expect(
    await screen.findByText(/vos autres sessions sont déconnectées/i),
  ).toBeInTheDocument();
  expect(submit).toHaveBeenCalledWith({
    password: "un-nouveau-mot-de-passe",
    password_confirmation: "un-nouveau-mot-de-passe",
  });
  expect(screen.getByLabelText("Nouveau mot de passe")).toHaveValue("");
});

it("refuses a confirmation that does not match before asking the API", async () => {
  const submit = renderCard();

  fillAndSubmit("un-nouveau-mot-de-passe", "un-autre-mot-de-passe");

  expect(
    await screen.findByText("Les mots de passe ne correspondent pas."),
  ).toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
});

it("shows the API's reason next to the field it refused", async () => {
  renderCard(async () => ({
    status: "invalid",
    fieldErrors: { password: { message: "Ce mot de passe est trop courant." } },
  }));

  fillAndSubmit("un-nouveau-mot-de-passe", "un-nouveau-mot-de-passe");

  await waitFor(() =>
    expect(
      screen.getByText("Ce mot de passe est trop courant."),
    ).toBeInTheDocument(),
  );
  expect(
    screen.queryByText(/vos autres sessions sont déconnectées/i),
  ).not.toBeInTheDocument();
});
