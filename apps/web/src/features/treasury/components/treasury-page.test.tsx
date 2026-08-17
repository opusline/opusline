import type { TreasuryData } from "@opusline/api-client";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { expect, it, vi } from "vitest";

import { TreasuryPage } from "./treasury-page";

// The footer links to the bank route, so every render needs a router in scope.
function renderWithRouter(ui: React.ReactNode) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => ui }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return render(<RouterProvider router={router} />);
}

function money(amount: number) {
  return { amount, currency: "EUR" as const };
}

function treasury(overrides: Partial<TreasuryData> = {}): TreasuryData {
  return {
    balance: { amount: money(500_000), source: 0, asOf: "2026-08-10" },
    provisions: { vat: null, urssaf: null, buffer: null, total: money(0) },
    transferable: money(500_000),
    shortfall: null,
    pendingTransfers: money(0),
    transfers: [],
    ...overrides,
  };
}

function renderPage(data: TreasuryData, onRecordTransfer = vi.fn()) {
  renderWithRouter(
    <TreasuryPage
      onRecordTransfer={onRecordTransfer}
      today="2026-08-13"
      treasury={data}
    />,
  );

  return { onRecordTransfer };
}

it("leads with what is safe to transfer and the balance it came from", async () => {
  renderPage(treasury());

  expect(
    await screen.findByText("Combien je peux me virer ?"),
  ).toBeInTheDocument();
  expect(screen.getByText("5 000,00 €")).toBeInTheDocument();
  expect(screen.getByText("sur un solde pro de 5 000 €")).toBeInTheDocument();
});

it("asks for a balance instead of implying zero is the answer", async () => {
  renderPage(treasury({ balance: null, transferable: money(0) }));

  expect(
    await screen.findByText(
      "Renseignez un solde ou importez un relevé pour voir un montant.",
    ),
  ).toBeInTheDocument();
});

it("warns when the account cannot even cover its provisions", async () => {
  renderPage(
    treasury({
      transferable: money(0),
      shortfall: { amount: -200_000, currency: "EUR" },
    }),
  );

  expect(
    await screen.findByText("Le compte est en dessous de ce qu'il doit"),
  ).toBeInTheDocument();
  expect(screen.getByText(/Il manque 2 000 €/)).toBeInTheDocument();
});

it("says a transfer is still waiting for its statement", async () => {
  renderPage(
    treasury({
      pendingTransfers: money(150_000),
      transferable: money(350_000),
      transfers: [
        {
          id: 1,
          transferredOn: "2026-08-12",
          amount: money(150_000),
          note: "Salaire août",
          isSettled: false,
        },
      ],
    }),
  );

  expect(await screen.findByText("Salaire août")).toBeInTheDocument();
  expect(screen.getByText("En attente de relevé")).toBeInTheDocument();
});

it("marks a transfer the balance has caught up with as settled", async () => {
  renderPage(
    treasury({
      transfers: [
        {
          id: 1,
          transferredOn: "2026-08-03",
          amount: money(150_000),
          note: null,
          isSettled: true,
        },
      ],
    }),
  );

  expect(await screen.findByText("Sur un relevé")).toBeInTheDocument();
  expect(screen.queryByText("En attente de relevé")).not.toBeInTheDocument();
});

it("says no transfer was recorded rather than showing an empty list", async () => {
  renderPage(treasury());

  expect(
    await screen.findByText("Aucun virement enregistré."),
  ).toBeInTheDocument();
});

it("records a transfer the user types", async () => {
  const { onRecordTransfer } = renderPage(treasury());

  fireEvent.click(
    await screen.findByRole("button", { name: "Enregistrer un virement" }),
  );
  fireEvent.change(await screen.findByLabelText("Montant"), {
    target: { value: "1500" },
  });
  fireEvent.change(screen.getByLabelText("Note"), {
    target: { value: "Salaire août" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onRecordTransfer).toHaveBeenCalledWith({
    amountCents: 150_000,
    transferredOn: "2026-08-13",
    note: "Salaire août",
  });
});

it("refuses to submit without an amount", async () => {
  const { onRecordTransfer } = renderPage(treasury());

  fireEvent.click(
    await screen.findByRole("button", { name: "Enregistrer un virement" }),
  );
  fireEvent.click(await screen.findByRole("button", { name: "Enregistrer" }));

  expect(onRecordTransfer).not.toHaveBeenCalled();
});
