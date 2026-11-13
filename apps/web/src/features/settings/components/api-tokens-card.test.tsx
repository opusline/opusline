import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { accessTokensFixture } from "../lib/security-fixture";
import { ApiTokensCard } from "./api-tokens-card";

function renderCard(
  overrides: Partial<React.ComponentProps<typeof ApiTokensCard>> = {},
) {
  const props = {
    tokens: accessTokensFixture,
    locale: "fr-FR" as const,
    isPending: false,
    error: null,
    createdToken: null,
    onCreate: vi.fn().mockResolvedValue({ status: "success" }),
    onDismissCreated: vi.fn(),
    onRevoke: vi.fn(),
    ...overrides,
  };

  render(<ApiTokensCard {...props} />);

  return props;
}

it("lists the tokens with what they may do and when they were used", () => {
  renderCard();

  expect(screen.getByText("Runway")).toBeInTheDocument();
  expect(screen.getAllByText("Lecture des factures")).toHaveLength(2);
  expect(screen.getByText("Lecture de la trésorerie")).toBeInTheDocument();
  expect(screen.getByText(/dernière utilisation le/i)).toBeInTheDocument();
  expect(screen.getByText(/jamais utilisé/i)).toBeInTheDocument();
});

it("invites to create the first token", () => {
  renderCard({ tokens: [] });

  expect(screen.getByText("Aucun jeton pour le moment.")).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("api-token-create"));

  expect(screen.getByLabelText("Nom")).toBeInTheDocument();
});

it("asks the name, then creates the token with it", async () => {
  const { onCreate } = renderCard();

  fireEvent.click(screen.getByTestId("api-token-create"));
  fireEvent.change(await screen.findByLabelText("Nom"), {
    target: { value: "  Runway " },
  });
  fireEvent.submit(screen.getByRole("button", { name: "Créer" }));

  await waitFor(() =>
    expect(onCreate).toHaveBeenCalledWith("Runway", ["invoices:read"]),
  );
});

it("offers every ability, with only the invoices ticked", async () => {
  renderCard();

  fireEvent.click(screen.getByTestId("api-token-create"));

  expect(
    await screen.findByRole("checkbox", { name: "Lecture des factures" }),
  ).toBeChecked();
  for (const name of [
    "Lecture des missions",
    "Lecture de la trésorerie",
    "Lecture des déclarations",
  ]) {
    expect(screen.getByRole("checkbox", { name })).not.toBeChecked();
  }
});

it("creates the token with the abilities ticked", async () => {
  const { onCreate } = renderCard();

  fireEvent.click(screen.getByTestId("api-token-create"));
  fireEvent.change(await screen.findByLabelText("Nom"), {
    target: { value: "Assistant" },
  });
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Lecture des factures" }),
  );
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Lecture des missions" }),
  );
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Lecture des déclarations" }),
  );
  fireEvent.submit(screen.getByRole("button", { name: "Créer" }));

  await waitFor(() =>
    expect(onCreate).toHaveBeenCalledWith("Assistant", [
      "missions:read",
      "declarations:read",
    ]),
  );
});

it("refuses a token that reads nothing", async () => {
  const { onCreate } = renderCard();

  fireEvent.click(screen.getByTestId("api-token-create"));
  fireEvent.change(await screen.findByLabelText("Nom"), {
    target: { value: "Assistant" },
  });
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Lecture des factures" }),
  );
  fireEvent.submit(screen.getByRole("button", { name: "Créer" }));

  expect(
    await screen.findByText("Choisissez-en au moins un."),
  ).toBeInTheDocument();
  expect(onCreate).not.toHaveBeenCalled();
});

it("shows the secret once it is created, until it is dismissed", () => {
  const { onDismissCreated } = renderCard({ createdToken: "3|secret" });

  expect(screen.getByTestId("api-token-secret")).toHaveTextContent("3|secret");
  expect(screen.queryByLabelText("Nom")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Fermer" }));

  expect(onDismissCreated).toHaveBeenCalledTimes(1);
});

it("revokes a token only after the confirmation", async () => {
  const { onRevoke } = renderCard();

  fireEvent.click(screen.getAllByTestId("api-token-revoke")[1]);

  const dialog = await screen.findByRole("alertdialog");
  expect(dialog).toHaveTextContent("Révoquer ce jeton ?");
  expect(onRevoke).not.toHaveBeenCalled();

  fireEvent.click(
    dialog.querySelector("[data-slot=alert-dialog-action]") as HTMLElement,
  );

  await waitFor(() => expect(onRevoke).toHaveBeenCalledWith(2));
});

it("shows the card error", () => {
  renderCard({ error: "Les jetons d'API n'ont pas pu être chargés." });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Les jetons d'API n'ont pas pu être chargés.",
  );
});

it("holds every action while a request is pending", () => {
  renderCard({ isPending: true });

  expect(screen.getByTestId("api-token-create")).toBeDisabled();
  for (const button of screen.getAllByTestId("api-token-revoke")) {
    expect(button).toBeDisabled();
  }
});
