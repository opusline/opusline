import type { TimeEntryData } from "@opusline/api-client";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import type * as React from "react";
import { expect, it } from "vitest";
import { MissionEntriesTable } from "./mission-entries-table";

// The footer links to the week route, so every render needs a router in scope.
function renderWithRouter(ui: React.ReactNode) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => ui }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return render(<RouterProvider router={router} />);
}

function entry(overrides: Partial<TimeEntryData> = {}): TimeEntryData {
  return {
    id: 1,
    missionId: 1,
    date: "2026-08-14",
    durationMinutes: 480,
    rounding: null,
    valuedMinutes: null,
    valuedDayFraction: null,
    billable: true,
    invoiced: false,
    note: null,
    ...overrides,
  };
}

it("shows an entry with its date, quantity and note", async () => {
  renderWithRouter(
    <MissionEntriesTable
      entries={[
        entry({
          note: "Refonte du tunnel",
          durationMinutes: 450,
          valuedMinutes: 450,
        }),
      ]}
    />,
  );

  expect(await screen.findByText("Refonte du tunnel")).toBeInTheDocument();
  // A billed half-hour reads as a decimal: "7,5 h", not "7 h 30".
  expect(screen.getByText("7,5 h")).toBeInTheDocument();
  expect(screen.getByText("14/08/2026")).toBeInTheDocument();
});

it("shows a day-billed entry in days rather than hours", async () => {
  renderWithRouter(
    <MissionEntriesTable
      entries={[entry({ durationMinutes: 210, valuedDayFraction: 0.5 })]}
    />,
  );

  expect(await screen.findByText("0,5 j")).toBeInTheDocument();
  expect(screen.queryByText("3 h 30")).not.toBeInTheDocument();
});

it("falls back to the tracked duration when the mission prices no time", async () => {
  renderWithRouter(
    <MissionEntriesTable
      entries={[
        entry({
          durationMinutes: 450,
          valuedMinutes: null,
          valuedDayFraction: null,
        }),
      ]}
    />,
  );

  expect(await screen.findByText("7 h 30")).toBeInTheDocument();
});

it("marks an entry an invoice already bills as invoiced", async () => {
  renderWithRouter(
    <MissionEntriesTable
      entries={[entry({ billable: true, invoiced: true })]}
    />,
  );

  expect(await screen.findByText("Facturé")).toBeInTheDocument();
  expect(screen.queryByText("À facturer")).not.toBeInTheDocument();
});

it("marks a billable entry no invoice covers yet as still to invoice", async () => {
  renderWithRouter(
    <MissionEntriesTable
      entries={[entry({ billable: true, invoiced: false })]}
    />,
  );

  expect(await screen.findByText("À facturer")).toBeInTheDocument();
});

it("marks an entry excluded from billing as non billable", async () => {
  renderWithRouter(
    <MissionEntriesTable
      entries={[entry({ billable: false, invoiced: false })]}
    />,
  );

  expect(await screen.findByText("Non facturable")).toBeInTheDocument();
});

it("says there are no entries rather than showing an empty grid", async () => {
  renderWithRouter(<MissionEntriesTable entries={[]} />);

  expect(
    await screen.findByText("Aucune entrée pour le moment."),
  ).toBeInTheDocument();
});

it("reports a failed load instead of claiming the mission has no entries", async () => {
  renderWithRouter(<MissionEntriesTable entries={[]} isError />);

  expect(
    await screen.findByText(
      "Impossible de charger les entrées de cette mission.",
    ),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Aucune entrée pour le moment."),
  ).not.toBeInTheDocument();
});

it("points at the week grid as the place entries are created", async () => {
  renderWithRouter(<MissionEntriesTable entries={[]} />);

  expect(
    await screen.findByText(
      "Les entrées se créent depuis la grille de la semaine.",
    ),
  ).toBeInTheDocument();
});
