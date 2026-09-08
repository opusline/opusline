import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { ConfirmPasswordDialog } from "./confirm-password-dialog";

function stubConfirm(status: number, body?: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = input instanceof Request ? input.url : String(input);

      if (url.includes("csrf-cookie")) {
        return new Response(null, { status: 204 });
      }

      return new Response(body === undefined ? null : JSON.stringify(body), {
        status,
        headers:
          body === undefined ? {} : { "Content-Type": "application/json" },
      });
    }),
  );
}

function renderDialog() {
  const props = { open: true, onConfirmed: vi.fn(), onCancel: vi.fn() };

  render(
    <QueryClientProvider client={new QueryClient()}>
      <ConfirmPasswordDialog {...props} />
    </QueryClientProvider>,
  );

  return props;
}

function submitPassword(value: string) {
  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
    target: { value },
  });
  fireEvent.submit(screen.getByRole("button", { name: "Confirmer" }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("reports a confirmed password", async () => {
  stubConfirm(204);
  const { onConfirmed } = renderDialog();

  submitPassword("secret-password");

  await waitFor(() => expect(onConfirmed).toHaveBeenCalledTimes(1));
});

it("puts a wrong password on the field", async () => {
  stubConfirm(422, {
    message: "x",
    errors: { password: ["Le mot de passe est incorrect."] },
  });
  const { onConfirmed } = renderDialog();

  submitPassword("wrong");

  expect(
    await screen.findByText("Le mot de passe est incorrect."),
  ).toBeInTheDocument();
  expect(onConfirmed).not.toHaveBeenCalled();
});

it("shows a banner when the check itself fails", async () => {
  stubConfirm(500, { message: "Boom" });
  renderDialog();

  submitPassword("secret-password");

  expect(await screen.findByRole("alert")).toHaveTextContent("Boom");
});

it("asks for a password before calling the API", async () => {
  stubConfirm(204);
  const { onConfirmed } = renderDialog();

  fireEvent.submit(screen.getByRole("button", { name: "Confirmer" }));

  expect(await screen.findByText("Ce champ est requis.")).toBeInTheDocument();
  expect(onConfirmed).not.toHaveBeenCalled();
});

it("reports a dismissal", () => {
  const { onCancel } = renderDialog();

  fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });

  expect(onCancel).toHaveBeenCalledTimes(1);
});
