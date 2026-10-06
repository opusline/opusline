import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { m } from "@/paraglide/messages.js";
import { ResetPasswordForm } from "./reset-password-form";

function typePasswords(password: string, confirmation: string) {
  fireEvent.change(screen.getByLabelText(m.security_password_new_label()), {
    target: { value: password },
  });
  fireEvent.change(screen.getByLabelText(m.auth_password_confirm_label()), {
    target: { value: confirmation },
  });
  fireEvent.submit(screen.getByRole("button", { name: m.auth_reset_submit() }));
}

it("submits the new password with its confirmation", async () => {
  const onSubmit = vi.fn();
  render(<ResetPasswordForm onSubmit={onSubmit} />);

  typePasswords("a-brand-new-password", "a-brand-new-password");

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith({
      password: "a-brand-new-password",
      password_confirmation: "a-brand-new-password",
    }),
  );
});

it("refuses a confirmation that does not match", async () => {
  const onSubmit = vi.fn();
  render(<ResetPasswordForm onSubmit={onSubmit} />);

  typePasswords("a-brand-new-password", "something-else");

  expect(await screen.findByText(m.auth_passwords_mismatch())).toBeVisible();
  expect(onSubmit).not.toHaveBeenCalled();
});

it("shows what the server refused about the password", async () => {
  const refusal = "This password has appeared in a data leak.";
  render(
    <ResetPasswordForm
      onSubmit={async () => ({ password: { message: refusal } })}
    />,
  );

  typePasswords("a-brand-new-password", "a-brand-new-password");

  expect(await screen.findByText(refusal)).toBeVisible();
});

it("replaces the form with the confirmation once the password is changed", () => {
  render(<ResetPasswordForm isDone onSubmit={vi.fn()} />);

  expect(screen.getByText(m.auth_reset_done())).toBeVisible();
  expect(screen.queryByLabelText(m.security_password_new_label())).toBeNull();
});
