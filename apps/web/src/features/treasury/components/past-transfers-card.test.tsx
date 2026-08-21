import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { treasuryData } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";

import { pendingTransferTreasuryData } from "../lib/fixtures";
import { PastTransfersCard } from "./past-transfers-card";

// The header links to Compte pro, so every render needs a router in scope —
// and the router only paints after its first tick.
async function renderCard(
  transfers = treasuryData().transfers,
  onDelete = vi.fn(),
  deletingTransferId: number | null = null,
) {
  render(
    <StoryRouter>
      <PastTransfersCard
        deletingTransferId={deletingTransferId}
        onDelete={onDelete}
        transfers={transfers}
      />
    </StoryRouter>,
  );

  await screen.findByRole("heading", { name: "Virements passés" });

  return onDelete;
}

it("lists each transfer with its date, note and amount", async () => {
  await renderCard();

  expect(screen.getByText("28/07/2026")).toBeInTheDocument();
  expect(screen.getByText("Salaire juillet")).toBeInTheDocument();
  expect(screen.getByText("6 800 €")).toBeInTheDocument();
});

it("marks only the rows no relevé covers yet", async () => {
  await renderCard(pendingTransferTreasuryData().transfers);

  expect(screen.getAllByText("en attente de relevé")).toHaveLength(1);
});

it("marks nothing when every transfer is on a relevé", async () => {
  await renderCard();

  expect(screen.queryByText("en attente de relevé")).not.toBeInTheDocument();
});

it("asks to delete the row it was clicked on", async () => {
  const onDelete = await renderCard();

  fireEvent.click(
    screen.getByRole("button", { name: "Supprimer le virement du 28/07/2026" }),
  );

  expect(onDelete).toHaveBeenCalledWith(1);
});

it("holds the row being deleted", async () => {
  await renderCard(treasuryData().transfers, vi.fn(), 1);

  expect(
    screen.getByRole("button", { name: "Supprimer le virement du 28/07/2026" }),
  ).toBeDisabled();
});

it("says so plainly when nothing has been recorded", async () => {
  await renderCard([]);

  expect(screen.getByText("Aucun virement enregistré.")).toBeInTheDocument();
});
