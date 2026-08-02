import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { RegisterForm } from "./register-form";

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/^nom$/i), {
    target: { value: "Theo" },
  });
  fireEvent.change(screen.getByLabelText(/adresse e-mail/i), {
    target: { value: "theo@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
    target: { value: "secret-password" },
  });
  fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
    target: { value: "secret-password" },
  });
}

it("submits the entered account details", async () => {
  const onSubmit = vi.fn();
  render(<RegisterForm onSubmit={onSubmit} />);

  fillValidForm();
  fireEvent.submit(screen.getByRole("button", { name: /créer le compte/i }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Theo",
      email: "theo@example.com",
      password: "secret-password",
      password_confirmation: "secret-password",
    }),
  );
});

it("rejects mismatched password confirmation", async () => {
  const onSubmit = vi.fn();
  render(<RegisterForm onSubmit={onSubmit} />);

  fillValidForm();
  fireEvent.change(screen.getByLabelText(/confirmer le mot de passe/i), {
    target: { value: "different-password" },
  });
  fireEvent.submit(screen.getByRole("button", { name: /créer le compte/i }));

  expect(
    await screen.findByText("Les mots de passe ne correspondent pas."),
  ).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

it("disables the submit button while pending", () => {
  render(<RegisterForm isPending onSubmit={vi.fn()} />);

  expect(
    screen.getByRole("button", { name: /créer le compte/i }),
  ).toBeDisabled();
});
