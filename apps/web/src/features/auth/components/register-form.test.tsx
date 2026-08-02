import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { RegisterForm } from "./register-form";

it("submits the entered account details", () => {
  const onSubmit = vi.fn();
  render(<RegisterForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "Theo" },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "theo@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { value: "secret-password" },
  });
  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: "secret-password" },
  });
  fireEvent.submit(screen.getByRole("button", { name: /create account/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    name: "Theo",
    email: "theo@example.com",
    password: "secret-password",
    password_confirmation: "secret-password",
  });
});

it("disables the submit button while pending", () => {
  render(<RegisterForm isPending onSubmit={vi.fn()} />);

  expect(
    screen.getByRole("button", { name: /create account/i }),
  ).toBeDisabled();
});
