import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { AuthenticatorAppCard } from "./authenticator-app-card";

function renderCard(
  overrides: Partial<React.ComponentProps<typeof AuthenticatorAppCard>> = {},
) {
  const props = {
    totpEnabled: false,
    recoveryCodesRemaining: 0,
    setup: { step: "idle" as const },
    isPending: false,
    error: null,
    onStartSetup: vi.fn(),
    onConfirmSetup: vi.fn().mockResolvedValue({ status: "success" }),
    onAcknowledgeRecoveryCodes: vi.fn(),
    onCancelSetup: vi.fn(),
    onRegenerateRecoveryCodes: vi.fn(),
    onDisable: vi.fn(),
    ...overrides,
  };

  render(<AuthenticatorAppCard {...props} />);

  return props;
}

it("offers to turn the authenticator on", () => {
  const { onStartSetup } = renderCard();

  expect(screen.getByText("Désactivée")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Activer" }));

  expect(onStartSetup).toHaveBeenCalledTimes(1);
});

it("counts the recovery codes and regenerates them after a confirmation", async () => {
  const { onRegenerateRecoveryCodes } = renderCard({
    totpEnabled: true,
    recoveryCodesRemaining: 8,
  });

  expect(screen.getByText("Activée")).toBeInTheDocument();
  expect(screen.getByText("8 codes de secours restants")).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Nouveaux codes de secours" }),
  );
  const dialog = await screen.findByRole("alertdialog");
  expect(dialog).toHaveTextContent("Générer de nouveaux codes de secours ?");
  fireEvent.click(
    dialog.querySelector("[data-slot=alert-dialog-action]") as HTMLElement,
  );

  await waitFor(() =>
    expect(onRegenerateRecoveryCodes).toHaveBeenCalledTimes(1),
  );
});

it("turns the authenticator off only after a confirmation", async () => {
  const { onDisable } = renderCard({
    totpEnabled: true,
    recoveryCodesRemaining: 5,
  });

  fireEvent.click(screen.getByRole("button", { name: "Désactiver" }));
  const dialog = await screen.findByRole("alertdialog");
  expect(dialog).toHaveTextContent(
    "Désactiver l'application d'authentification ?",
  );
  expect(onDisable).not.toHaveBeenCalled();

  fireEvent.click(
    dialog.querySelector("[data-slot=alert-dialog-action]") as HTMLElement,
  );

  await waitFor(() => expect(onDisable).toHaveBeenCalledTimes(1));
});

it("nudges when the recovery codes run low", () => {
  renderCard({ totpEnabled: true, recoveryCodesRemaining: 1 });

  expect(screen.getByText("1 code de secours restant")).toBeInTheDocument();
  expect(
    screen.getByText(/presque plus de codes de secours/i),
  ).toBeInTheDocument();
});

it("shows the card error", () => {
  renderCard({ error: "L'action a échoué." });

  expect(screen.getByRole("alert")).toHaveTextContent("L'action a échoué.");
});
