import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { fiscalDeadlineItem } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";

import { DEMO_BOARD, DEMO_TODAY } from "../lib/fixtures";
import { DeadlineTimeline } from "./deadline-timeline";

function renderTimeline(
  overrides: Partial<React.ComponentProps<typeof DeadlineTimeline>> = {},
) {
  const onToggleFiscal = vi.fn();

  render(
    <StoryRouter>
      <DeadlineTimeline
        items={DEMO_BOARD.items}
        onToggleFiscal={onToggleFiscal}
        pendingKey={null}
        today={DEMO_TODAY}
        {...overrides}
      />
    </StoryRouter>,
  );

  return { onToggleFiscal };
}

it("names an invoice line by its number and client, linking to the invoice", async () => {
  renderTimeline();

  const link = await screen.findByRole("link", {
    name: /F-2026-028 · Lunaprint/,
  });

  expect(link).toHaveAttribute("href", "/invoices?invoice=28");
});

it("puts the relance under the invoice it chases, with its history", async () => {
  renderTimeline();

  expect(await screen.findByText("Relancer Lunaprint")).toBeInTheDocument();
  expect(
    screen.getByText(
      "F-2026-028 impayée depuis 150 j · aucune relance envoyée",
    ),
  ).toBeInTheDocument();
});

it("counts how late a late line is", async () => {
  renderTimeline();

  expect(await screen.findAllByText("Il y a 150 j")).not.toHaveLength(0);
});

it("explains the URSSAF figure by what it was computed from", async () => {
  renderTimeline();

  expect(
    await screen.findByText("Déclarer 4 769 € encaissés → cotisations à 26 %"),
  ).toBeInTheDocument();
});

it("prefixes an estimated amount with a tilde instead of a chip", async () => {
  renderTimeline();

  expect((await screen.findAllByText(/^~/)).length).toBeGreaterThan(0);
  expect(screen.queryByText("estimation")).toBeNull();
});

it("keeps a done line, greyed, with the day it was settled", async () => {
  renderTimeline();

  expect(await screen.findByText("Faite")).toBeInTheDocument();
  expect(screen.getByText("le 29/07/2026")).toBeInTheDocument();
});

it("toggles a fiscal line when it is pressed", async () => {
  const { onToggleFiscal } = renderTimeline();

  fireEvent.click(
    await screen.findByRole("button", {
      name: "Marquer comme faite — Déclaration URSSAF 31/08/2026",
    }),
  );

  expect(onToggleFiscal).toHaveBeenCalledWith(
    expect.objectContaining({ type: 2 }),
  );
});

it("says the income tax return date is only an estimate", async () => {
  renderTimeline({
    items: [
      fiscalDeadlineItem({
        kind: 5,
        periodKey: "2026",
        periodStart: "2026-01-01",
        periodEnd: "2026-12-31",
        dueOn: "2027-05-31",
        amount: null,
        rateBp: null,
        base: null,
      }),
    ],
  });

  expect(
    await screen.findByText(
      "Date estimée — le fisc publie le jour exact chaque avril",
    ),
  ).toBeInTheDocument();
  expect(
    screen.getAllByText(/Déclaration de revenus — 2042-C PRO/).length,
  ).toBeGreaterThan(0);
});

it("says the calendar is empty rather than showing a bare list", async () => {
  renderTimeline({ items: [] });

  expect(await screen.findByText("Rien au calendrier")).toBeInTheDocument();
});
