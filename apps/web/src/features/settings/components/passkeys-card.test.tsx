import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { passkeysFixture } from "../lib/security-fixture";
import { PasskeysCard } from "./passkeys-card";

function renderCard(
  overrides: Partial<React.ComponentProps<typeof PasskeysCard>> = {},
) {
  const props = {
    passkeys: passkeysFixture,
    locale: "fr-FR" as const,
    isSupported: true,
    isPending: false,
    error: null,
    onAdd: vi.fn(),
    onRename: vi.fn().mockResolvedValue({ status: "success" }),
    onDelete: vi.fn(),
    ...overrides,
  };

  render(<PasskeysCard {...props} />);

  return props;
}

it("lists the passkeys with their sync state and last use", () => {
  renderCard();

  expect(screen.getByText("MacBook de Théo")).toBeInTheDocument();
  expect(screen.getByText("Synchronisée")).toBeInTheDocument();
  expect(screen.getByText("Clé de secours")).toBeInTheDocument();
  expect(screen.getByText("Jamais utilisée")).toBeInTheDocument();
  expect(screen.getByText(/dernière utilisation le/i)).toBeInTheDocument();
});

it("invites to add the first passkey", () => {
  const { onAdd } = renderCard({ passkeys: [] });

  expect(
    screen.getByText("Aucune clé d'accès pour le moment."),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  );

  expect(onAdd).toHaveBeenCalledTimes(1);
});

it("says so when the browser cannot use passkeys", () => {
  renderCard({ passkeys: [], isSupported: false });

  expect(
    screen.getByText("Ce navigateur ne prend pas en charge les clés d'accès."),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  ).toBeDisabled();
});

it("renames a passkey through the naming dialog", async () => {
  const { onRename } = renderCard();

  fireEvent.click(screen.getAllByRole("button", { name: "Renommer" })[0]);

  const input = await screen.findByLabelText("Nom");
  expect(input).toHaveValue("MacBook de Théo");

  fireEvent.change(input, { target: { value: "  Clé du bureau " } });
  fireEvent.submit(screen.getByRole("button", { name: "Enregistrer" }));

  await waitFor(() =>
    expect(onRename).toHaveBeenCalledWith(1, "Clé du bureau"),
  );
  await waitFor(() =>
    expect(screen.queryByLabelText("Nom")).not.toBeInTheDocument(),
  );
});

it("deletes a passkey only after the confirmation", async () => {
  const { onDelete } = renderCard();

  fireEvent.click(screen.getAllByRole("button", { name: "Supprimer" })[1]);

  const dialog = await screen.findByRole("alertdialog");
  expect(dialog).toHaveTextContent("Supprimer cette clé d'accès ?");
  expect(onDelete).not.toHaveBeenCalled();

  fireEvent.click(
    screen
      .getByRole("alertdialog")
      .querySelector("[data-slot=alert-dialog-action]") as HTMLElement,
  );

  await waitFor(() => expect(onDelete).toHaveBeenCalledWith(2));
});

it("shows the card error", () => {
  renderCard({ error: "Cette clé d'accès est déjà enregistrée." });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Cette clé d'accès est déjà enregistrée.",
  );
});

it("holds every action while a request is pending", () => {
  renderCard({ isPending: true });

  expect(
    screen.getByRole("button", { name: /ajouter une clé d'accès/i }),
  ).toBeDisabled();
  for (const button of screen.getAllByRole("button", { name: "Renommer" })) {
    expect(button).toBeDisabled();
  }
  for (const button of screen.getAllByRole("button", { name: "Supprimer" })) {
    expect(button).toBeDisabled();
  }
});

it("explains instead of offering to add when the browser cannot", () => {
  renderCard({ isSupported: false });

  expect(
    screen.queryByRole("button", { name: /ajouter une clé d'accès/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText("Ce navigateur ne prend pas en charge les clés d'accès."),
  ).toBeInTheDocument();
});
