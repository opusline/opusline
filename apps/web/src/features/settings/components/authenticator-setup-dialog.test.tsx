import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import {
  recoveryCodesFixture,
  totpSetupFixture,
} from "../lib/security-fixture";
import { AuthenticatorSetupDialog } from "./authenticator-setup-dialog";

function renderDialog(
  overrides: Partial<
    React.ComponentProps<typeof AuthenticatorSetupDialog>
  > = {},
) {
  const props = {
    state: { step: "scan" as const, ...totpSetupFixture },
    isPending: false,
    onConfirm: vi.fn().mockResolvedValue({ status: "success" }),
    onAcknowledgeRecoveryCodes: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  };

  render(<AuthenticatorSetupDialog {...props} />);

  return props;
}

it("shows the code to scan and the key behind a toggle", () => {
  renderDialog();

  expect(
    screen.getByRole("img", { name: /qr code à scanner/i }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/JBSW Y3DP/)).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /impossible de scanner/i }),
  );

  expect(screen.getByText(/JBSW Y3DP EHPK 3PXP/)).toBeInTheDocument();
});

it("confirms as soon as six digits are typed", async () => {
  const { onConfirm } = renderDialog();

  fireEvent.change(screen.getByLabelText(/code à six chiffres/i), {
    target: { value: "482913" },
  });

  await waitFor(() => expect(onConfirm).toHaveBeenCalledWith("482913"));
});

it("shows a refused code on the field", async () => {
  renderDialog({
    onConfirm: vi.fn().mockResolvedValue({
      status: "invalid",
      fieldErrors: { code: { message: "Le code est invalide ou a expiré." } },
    }),
  });

  fireEvent.change(screen.getByLabelText(/code à six chiffres/i), {
    target: { value: "000000" },
  });

  expect(
    await screen.findByText("Le code est invalide ou a expiré."),
  ).toBeInTheDocument();
});

it("lists the recovery codes and only leaves through the saved button", () => {
  const { onAcknowledgeRecoveryCodes, onCancel } = renderDialog({
    state: { step: "recovery", codes: recoveryCodesFixture },
  });

  expect(
    screen.getByRole("list", { name: "Codes de secours" }).children,
  ).toHaveLength(8);
  expect(
    screen.queryByRole("button", { name: /close/i }),
  ).not.toBeInTheDocument();

  fireEvent.keyDown(document.activeElement ?? document.body, {
    key: "Escape",
  });
  expect(onCancel).not.toHaveBeenCalled();

  fireEvent.click(
    screen.getByRole("button", { name: /j'ai enregistré mes codes/i }),
  );
  expect(onAcknowledgeRecoveryCodes).toHaveBeenCalledTimes(1);
});

it("shows a generic message when the confirmation fails outright", async () => {
  renderDialog({ onConfirm: vi.fn().mockResolvedValue({ status: "failed" }) });

  fireEvent.change(screen.getByLabelText(/code à six chiffres/i), {
    target: { value: "482913" },
  });

  expect(
    await screen.findByText("L'action a échoué. Réessayez dans un instant."),
  ).toBeInTheDocument();
});

it("can be dismissed while scanning", () => {
  const { onCancel } = renderDialog();

  fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });

  expect(onCancel).toHaveBeenCalledTimes(1);
});
