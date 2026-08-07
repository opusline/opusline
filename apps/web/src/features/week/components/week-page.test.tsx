import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { expect, it, vi } from "vitest";

import {
  DEMO_CLIENTS,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
  DEMO_WORKDAY_MINUTES,
} from "../lib/week-fixtures";
import { WeekPage, type WeekPageProps } from "./week-page";

// The empty state links to the client routes, so every render needs a router.
function renderWithRouter(ui: React.ReactNode) {
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: ["/"] }),
    routeTree: createRootRoute({ component: () => ui }),
  });

  return render(<RouterProvider router={router} />);
}

async function renderPage(overrides: Partial<WeekPageProps> = {}) {
  const onWeekChange = vi.fn<WeekPageProps["onWeekChange"]>();
  const onSubmitNewEntry = vi
    .fn<WeekPageProps["onSubmitNewEntry"]>()
    .mockResolvedValue(true);

  renderWithRouter(
    <WeekPage
      clients={DEMO_CLIENTS}
      knownEntries={DEMO_TIME_ENTRIES}
      knownEntryRange={{ from: "2026-07-20", to: "2026-08-02" }}
      error={null}
      isRefreshing={false}
      isRepeating={false}
      onCreate={vi.fn().mockResolvedValue(true)}
      onDelete={vi.fn().mockResolvedValue(true)}
      onRepeatPreviousWeek={vi.fn()}
      onSubmitNewEntry={onSubmitNewEntry}
      onUpdate={vi.fn().mockResolvedValue(true)}
      onWeekChange={onWeekChange}
      onWeekendToggle={vi.fn()}
      pendingCellKeys={new Set()}
      previousWeekEntries={[]}
      timeEntries={DEMO_TIME_ENTRIES}
      today={DEMO_TODAY}
      week={DEMO_WEEK}
      weekendOpen={false}
      workdayMinutes={DEMO_WORKDAY_MINUTES}
      {...overrides}
    />,
  );

  // The router mounts its route tree asynchronously.
  await screen.findByRole("heading");

  return { onSubmitNewEntry, onWeekChange };
}

it("titles the week and its date range", async () => {
  await renderPage();

  expect(screen.getByRole("heading", { name: /Semaine 31/ })).toHaveTextContent(
    "27 juil.",
  );
});

it("steps to the previous week", async () => {
  const { onWeekChange } = await renderPage();

  fireEvent.click(screen.getByRole("button", { name: "Semaine précédente" }));

  expect(onWeekChange).toHaveBeenCalledWith("2026-W30");
});

it("disables Aujourd'hui once the current week is showing", async () => {
  // DEMO_TODAY falls inside DEMO_WEEK, so the default render is already there.
  await renderPage();

  expect(screen.getByRole("button", { name: "Aujourd'hui" })).toBeDisabled();
});

it("keeps Aujourd'hui usable on any other week", async () => {
  await renderPage({ week: "2026-W30" });

  expect(screen.getByRole("button", { name: "Aujourd'hui" })).toBeEnabled();
});

it("disables the weekend toggle when the weekend has to stay open", async () => {
  await renderPage({
    timeEntries: [
      {
        billable: true,
        date: "2026-08-01",
        durationMinutes: 210,
        id: 99,
        missionId: 1,
        note: null,
        valuedDayFraction: 0.5,
        valuedMinutes: null,
      },
    ],
  });

  expect(
    screen.getByRole("button", { name: "Masquer le week-end" }),
  ).toBeDisabled();
});

it("keeps the weekend toggle usable when the user opened it themselves", async () => {
  await renderPage({ weekendOpen: true });

  expect(
    screen.getByRole("button", { name: "Masquer le week-end" }),
  ).toBeEnabled();
});

it("steps across a year boundary", async () => {
  const { onWeekChange } = await renderPage({ week: "2026-W01" });

  fireEvent.click(screen.getByRole("button", { name: "Semaine précédente" }));

  expect(onWeekChange).toHaveBeenCalledWith("2025-W52");
});

it("opens the new-entry dialog when N is pressed", async () => {
  await renderPage();

  fireEvent.keyDown(window, { key: "n" });

  expect(screen.getByText("Sur quelle mission ?")).toBeInTheDocument();
});

it("leaves N alone while a field has focus", async () => {
  await renderPage();

  const cell = screen.getByRole("gridcell", {
    name: /OGF front, lundi 27 juillet/,
  });
  cell.focus();
  fireEvent.keyDown(cell, { key: "Enter" });
  fireEvent.keyDown(screen.getByRole("textbox", { name: /Durée/ }), {
    key: "n",
  });

  expect(screen.queryByText("Sur quelle mission ?")).not.toBeInTheDocument();
});

it("keeps the new-entry dialog open when the entry is refused", async () => {
  const { onSubmitNewEntry } = await renderPage();
  onSubmitNewEntry.mockResolvedValue(false);

  fireEvent.keyDown(window, { key: "n" });
  fireEvent.click(screen.getByRole("button", { name: /OGF front/ }));
  fireEvent.change(screen.getByRole("textbox", { name: "Durée" }), {
    target: { value: "0,5" },
  });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
  });

  // A 422 must not throw away the mission, date and duration already chosen.
  expect(screen.getByRole("textbox", { name: "Durée" })).toHaveValue("0,5");
});

it("closes the new-entry dialog once the entry is saved", async () => {
  await renderPage();

  fireEvent.keyDown(window, { key: "n" });
  fireEvent.click(screen.getByRole("button", { name: /OGF front/ }));
  fireEvent.change(screen.getByRole("textbox", { name: "Durée" }), {
    target: { value: "0,5" },
  });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
  });

  expect(
    screen.queryByRole("textbox", { name: "Durée" }),
  ).not.toBeInTheDocument();
});

it("shows the empty state instead of the grid when there is no mission", async () => {
  await renderPage({ clients: [], timeEntries: [] });

  expect(screen.getByText("Rien à suivre pour l'instant")).toBeVisible();
  expect(screen.queryByRole("grid")).not.toBeInTheDocument();
});

it("offers to repeat the previous week only when there is something to repeat", async () => {
  await renderPage({ previousWeekEntries: DEMO_TIME_ENTRIES, timeEntries: [] });

  expect(screen.getByText("Semaine vide")).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Reprendre les 10 entrées" }),
  ).toBeVisible();
});

it("hides the repeat banner when the previous week is empty too", async () => {
  await renderPage({ timeEntries: [] });

  expect(screen.queryByText("Semaine vide")).not.toBeInTheDocument();
});

it("surfaces a write failure above the grid", async () => {
  await renderPage({
    error: "Impossible de saisir plus de 24 heures de travail à la même date.",
  });

  expect(screen.getByRole("alert")).toHaveTextContent("24 heures");
});

it("opens the weekend when the week carries weekend entries", async () => {
  await renderPage({
    timeEntries: [
      {
        billable: true,
        date: "2026-08-01",
        durationMinutes: 210,
        id: 99,
        missionId: 1,
        note: null,
        valuedDayFraction: 0.5,
        valuedMinutes: null,
      },
    ],
  });

  expect(screen.getByRole("grid")).toHaveAttribute("aria-colcount", "9");
});
