import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { LoginForm } from "./login-form";

it("submits the entered credentials", async () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(/adresse e-mail/i), {
    target: { value: "theo@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
    target: { value: "secret-password" },
  });
  fireEvent.submit(screen.getByRole("button", { name: /se connecter/i }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith({
      email: "theo@example.com",
      password: "secret-password",
      remember: false,
    }),
  );
});

it("includes remember when the checkbox is ticked", async () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(/adresse e-mail/i), {
    target: { value: "theo@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
    target: { value: "secret-password" },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: /rester connecté/i }));
  fireEvent.submit(screen.getByRole("button", { name: /se connecter/i }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ remember: true }),
    ),
  );
});

it("shows a validation error instead of submitting an invalid email", async () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(/adresse e-mail/i), {
    target: { value: "pas-un-email" },
  });
  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
    target: { value: "secret-password" },
  });
  fireEvent.submit(screen.getByRole("button", { name: /se connecter/i }));

  expect(
    await screen.findByText("Adresse e-mail invalide."),
  ).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

it("disables the submit button while pending", () => {
  render(<LoginForm isPending onSubmit={vi.fn()} />);

  expect(screen.getByRole("button", { name: /se connecter/i })).toBeDisabled();
});

it("shows the error message", () => {
  render(<LoginForm error="Identifiants invalides." onSubmit={vi.fn()} />);

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Identifiants invalides.",
  );
});
