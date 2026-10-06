import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { m } from "@/paraglide/messages.js";
import { ForgotPasswordForm } from "./forgot-password-form";

it("asks for a link for the entered address", async () => {
  const onSubmit = vi.fn();
  render(<ForgotPasswordForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(m.auth_email_label()), {
    target: { value: "theo@example.com" },
  });
  fireEvent.submit(
    screen.getByRole("button", { name: m.auth_forgot_submit() }),
  );

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith({ email: "theo@example.com" }),
  );
});

it("does not ask for a link for something that is not an address", async () => {
  const onSubmit = vi.fn();
  render(<ForgotPasswordForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(m.auth_email_label()), {
    target: { value: "not-an-address" },
  });
  fireEvent.submit(
    screen.getByRole("button", { name: m.auth_forgot_submit() }),
  );

  await waitFor(() =>
    expect(screen.getByLabelText(m.auth_email_label())).toBeInvalid(),
  );
  expect(onSubmit).not.toHaveBeenCalled();
});

it("replaces the form with the confirmation once the request is accepted", () => {
  render(<ForgotPasswordForm isSent onSubmit={vi.fn()} />);

  expect(screen.getByText(m.auth_forgot_sent())).toBeVisible();
  expect(screen.queryByLabelText(m.auth_email_label())).toBeNull();
});
