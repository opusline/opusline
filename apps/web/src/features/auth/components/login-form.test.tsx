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
    await screen.findByText(/adresse e-mail invalide/i),
  ).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

it("rejects an empty password client-side", async () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(/adresse e-mail/i), {
    target: { value: "theo@example.com" },
  });
  fireEvent.submit(screen.getByRole("button", { name: /se connecter/i }));

  expect(await screen.findByText("Ce champ est requis.")).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

it("shows server validation errors on the matching field", async () => {
  const onSubmit = vi
    .fn()
    .mockResolvedValue({ email: { message: "Cet e-mail est déjà pris." } });
  render(<LoginForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(/adresse e-mail/i), {
    target: { value: "theo@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
    target: { value: "secret-password" },
  });
  fireEvent.submit(screen.getByRole("button", { name: /se connecter/i }));

  expect(
    await screen.findByText("Cet e-mail est déjà pris."),
  ).toBeInTheDocument();
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
