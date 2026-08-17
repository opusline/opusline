import type { DeclarationData } from "@opusline/api-client";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { DeclarationsPage } from "./declarations-page";

function declaration(
  overrides: Partial<DeclarationData> = {},
): DeclarationData {
  return {
    kind: 1,
    period: "2026-07",
    dueOn: "2026-08-31",
    amount: { amount: 260_000, currency: "EUR" },
    filedOn: null,
    declaredAmount: null,
    isFiled: false,
    isLate: false,
    ...overrides,
  };
}

function renderPage(
  declarations: DeclarationData[],
  { hasUncomputedVatSchedule = false, onMarkFiled = vi.fn() } = {},
) {
  render(
    <DeclarationsPage
      declarations={{ declarations, hasUncomputedVatSchedule }}
      onMarkFiled={onMarkFiled}
    />,
  );

  return { onMarkFiled };
}

it("offers to tick off a period that is still to file", () => {
  const { onMarkFiled } = renderPage([declaration()]);

  fireEvent.click(screen.getByRole("button", { name: "Marquer déclarée" }));

  expect(onMarkFiled).toHaveBeenCalledWith(
    expect.objectContaining({ kind: 1, period: "2026-07" }),
  );
});

it("says when a filed period was declared instead of offering the button again", () => {
  renderPage([declaration({ isFiled: true, filedOn: "2026-08-12" })]);

  expect(screen.getByText(/Déclarée le/)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Marquer déclarée" }),
  ).not.toBeInTheDocument();
});

it("flags an unfiled period whose date has passed", () => {
  renderPage([declaration({ period: "2026-06", isLate: true })]);

  expect(screen.getByText("En retard")).toBeInTheDocument();
});

it("does not flag a period that was filed late as still late", () => {
  renderPage([
    declaration({
      period: "2026-06",
      isLate: false,
      isFiled: true,
      filedOn: "2026-08-12",
    }),
  ]);

  expect(screen.queryByText("En retard")).not.toBeInTheDocument();
});

it("shows what was declared when it differs from what Opusline computed", () => {
  renderPage([
    declaration({
      isFiled: true,
      filedOn: "2026-08-12",
      declaredAmount: { amount: 251_300, currency: "EUR" },
    }),
  ]);

  expect(screen.getByText("2 600 €")).toBeInTheDocument();
  expect(screen.getByText("déclaré 2 513 €")).toBeInTheDocument();
});

it("stays quiet when the declared figure matches the computed one", () => {
  renderPage([
    declaration({
      isFiled: true,
      declaredAmount: { amount: 260_000, currency: "EUR" },
    }),
  ]);

  // Anchored on the amount: the page subtitle also contains "déclarée".
  expect(screen.queryByText(/^déclaré /)).not.toBeInTheDocument();
});

it("dashes a period whose figure is not settled yet", () => {
  renderPage([declaration({ period: "2026-08", amount: null })]);

  expect(screen.getByText("—")).toBeInTheDocument();
});

it("explains an empty ledger instead of showing a bare page", () => {
  renderPage([]);

  expect(screen.getByText(/Aucune déclaration à déposer/)).toBeInTheDocument();
});

it("says the CA12 is not in the list on a réel simplifié account", () => {
  renderPage([declaration()], { hasUncomputedVatSchedule: true });

  expect(
    screen.getByText("Votre CA12 n'est pas dans cette liste"),
  ).toBeInTheDocument();
});
