import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { PasskeyNameDialog } from "./passkey-name-dialog";

function renderDialog(
  overrides: Partial<React.ComponentProps<typeof PasskeyNameDialog>> = {},
) {
  const props = {
    open: true,
    title: "Nommer cette clé d'accès",
    initialName: "Ma clé d'accès",
    isPending: false,
    onSubmit: vi.fn().mockResolvedValue({ status: "success" }),
    onCancel: vi.fn(),
    ...overrides,
  };

  render(<PasskeyNameDialog {...props} />);

  return props;
}

it("submits the trimmed name", async () => {
  const { onSubmit } = renderDialog();

  fireEvent.change(screen.getByLabelText("Nom"), {
    target: { value: "  YubiKey du bureau  " },
  });
  fireEvent.submit(screen.getByRole("button", { name: "Enregistrer" }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith("YubiKey du bureau"),
  );
});

it("refuses an empty name before asking the server", async () => {
  const { onSubmit } = renderDialog();

  fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "" } });
  fireEvent.submit(screen.getByRole("button", { name: "Enregistrer" }));

  expect(await screen.findByText("Ce champ est requis.")).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

it("shows the server's objection on the field", async () => {
  renderDialog({
    onSubmit: vi.fn().mockResolvedValue({
      status: "invalid",
      fieldErrors: { name: { message: "Ce nom est déjà pris." } },
    }),
  });

  fireEvent.submit(screen.getByRole("button", { name: "Enregistrer" }));

  expect(await screen.findByText("Ce nom est déjà pris.")).toBeInTheDocument();
});

it("reports a dismissal", () => {
  const { onCancel } = renderDialog();

  fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });

  expect(onCancel).toHaveBeenCalledTimes(1);
});
