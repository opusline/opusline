import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { LoginForm } from "./login-form";

it("submits the entered credentials", () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "theo@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "secret-password" },
  });
  fireEvent.submit(screen.getByRole("button", { name: /log in/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    email: "theo@example.com",
    password: "secret-password",
  });
});

it("disables the submit button while pending", () => {
  render(<LoginForm isPending onSubmit={vi.fn()} />);

  expect(screen.getByRole("button", { name: /log in/i })).toBeDisabled();
});

it("shows the error message", () => {
  render(<LoginForm error="Invalid credentials." onSubmit={vi.fn()} />);

  expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials.");
});
