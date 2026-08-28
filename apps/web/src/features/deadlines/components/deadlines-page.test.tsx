import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";

import { DEMO_BOARD, DEMO_TODAY } from "../lib/fixtures";
import { DeadlinesPage } from "./deadlines-page";

function renderPage(
  overrides: Partial<React.ComponentProps<typeof DeadlinesPage>> = {},
) {
  const onFilterChange = vi.fn();
  const onOpenSubscribe = vi.fn();

  render(
    <StoryRouter>
      <DeadlinesPage
        board={DEMO_BOARD}
        filter="all"
        isRefreshing={false}
        onFilterChange={onFilterChange}
        onOpenSubscribe={onOpenSubscribe}
        onToggleFiscal={() => {}}
        pendingKey={null}
        today={DEMO_TODAY}
        {...overrides}
      />
    </StoryRouter>,
  );

  return { onFilterChange, onOpenSubscribe };
}

it("counts each category on its chip", async () => {
  renderPage();

  expect(
    await screen.findByRole("button", { name: "Tout (7)" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Factures (2)" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Relances (1)" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "URSSAF (3)" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Autres (1)" }),
  ).toBeInTheDocument();
});

it("sums the board up in one line", async () => {
  renderPage();

  // One late invoice; the relance counts apart; the rest is still ahead.
  expect(
    await screen.findByText("1 en retard · 4 à venir · 1 relance à envoyer"),
  ).toBeInTheDocument();
});

it("narrows the timeline to the picked category", async () => {
  renderPage({ filter: "reminders" });

  expect(await screen.findByText("Relancer Lunaprint")).toBeInTheDocument();
  expect(screen.queryByText(/F-2026-041/)).toBeNull();
});

it("hands the filter change back", async () => {
  const { onFilterChange } = renderPage();

  fireEvent.click(await screen.findByRole("button", { name: "TVA (0)" }));

  expect(onFilterChange).toHaveBeenCalledWith("vat");
});

it("opens the subscribe dialog from the header", async () => {
  const { onOpenSubscribe } = renderPage();

  fireEvent.click(
    await screen.findByRole("button", { name: "S'abonner au calendrier" }),
  );

  expect(onOpenSubscribe).toHaveBeenCalledOnce();
});
