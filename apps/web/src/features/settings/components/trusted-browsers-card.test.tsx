import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { trustedDevicesFixture } from "../lib/security-fixture";
import { TrustedBrowsersCard } from "./trusted-browsers-card";

function renderCard(
  overrides: Partial<React.ComponentProps<typeof TrustedBrowsersCard>> = {},
) {
  const props = {
    devices: trustedDevicesFixture,
    locale: "fr-FR" as const,
    isPending: false,
    error: null,
    onRevoke: vi.fn(),
    onRevokeAll: vi.fn(),
    ...overrides,
  };

  render(<TrustedBrowsersCard {...props} />);

  return props;
}

it("names each browser, flags the current one and falls back for unknown clients", () => {
  renderCard();

  expect(screen.getByText("Chrome sur macOS")).toBeInTheDocument();
  expect(screen.getByText("Ce navigateur")).toBeInTheDocument();
  expect(screen.getByText("Firefox sur Linux")).toBeInTheDocument();
  expect(
    screen.getByText("Navigateur inconnu sur appareil inconnu"),
  ).toBeInTheDocument();
  expect(screen.getByText("Jamais utilisé")).toBeInTheDocument();
  expect(screen.getAllByText(/dernière utilisation le/i)).toHaveLength(2);
});

it("says so when no browser is trusted", () => {
  renderCard({ devices: [] });

  expect(
    screen.getByText("Aucun navigateur n'est de confiance pour le moment."),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Tout révoquer" }),
  ).not.toBeInTheDocument();
});

it("warns differently before revoking the current browser", async () => {
  const { onRevoke } = renderCard();

  fireEvent.click(screen.getAllByRole("button", { name: "Révoquer" })[0]);
  const dialog = await screen.findByRole("alertdialog");
  expect(dialog).toHaveTextContent("C'est le navigateur que vous utilisez");

  fireEvent.click(
    dialog.querySelector("[data-slot=alert-dialog-action]") as HTMLElement,
  );

  await waitFor(() => expect(onRevoke).toHaveBeenCalledWith(1));
});

it("revokes another browser after a plain confirmation", async () => {
  const { onRevoke } = renderCard();

  fireEvent.click(screen.getAllByRole("button", { name: "Révoquer" })[1]);
  const dialog = await screen.findByRole("alertdialog");
  expect(dialog).toHaveTextContent(
    "Un code lui sera demandé à sa prochaine connexion.",
  );

  fireEvent.click(
    dialog.querySelector("[data-slot=alert-dialog-action]") as HTMLElement,
  );

  await waitFor(() => expect(onRevoke).toHaveBeenCalledWith(2));
});

it("offers to revoke every browser once there is more than one", async () => {
  const { onRevokeAll } = renderCard();

  fireEvent.click(screen.getByRole("button", { name: "Tout révoquer" }));
  const dialog = await screen.findByRole("alertdialog");
  fireEvent.click(
    dialog.querySelector("[data-slot=alert-dialog-action]") as HTMLElement,
  );

  await waitFor(() => expect(onRevokeAll).toHaveBeenCalledTimes(1));
});

it("keeps a single browser's revoke-all button away", () => {
  renderCard({ devices: [trustedDevicesFixture[0]] });

  expect(
    screen.queryByRole("button", { name: "Tout révoquer" }),
  ).not.toBeInTheDocument();
});

it("shows the card error and holds actions while pending", () => {
  renderCard({ error: "L'action a échoué.", isPending: true });

  expect(screen.getByRole("alert")).toHaveTextContent("L'action a échoué.");
  for (const button of screen.getAllByRole("button", { name: "Révoquer" })) {
    expect(button).toBeDisabled();
  }
});
