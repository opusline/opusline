import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { afterAll, beforeAll, expect, it, vi } from "vitest";

import { overwriteGetLocale } from "@/paraglide/runtime.js";

import {
  DEMO_CLIENTS,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
  DEMO_WORKDAY_MINUTES,
} from "../lib/week-fixtures";
import { WeekPage } from "./week-page";

/**
 * English is the default for any browser the app does not recognise, and the
 * week grid is the screen every user lands on — but src/test/pin-locale.ts pins
 * the rest of the suite to `fr`.
 *
 * scripts/i18n-guard.sh cannot cover this either: it matches accented
 * characters, and "Mission", "Total" and "Ajouter" carry none.
 */
beforeAll(() => overwriteGetLocale(() => "en"));
afterAll(() => overwriteGetLocale(() => "fr"));

async function renderWeekInEnglish() {
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: ["/"] }),
    routeTree: createRootRoute({
      component: () => (
        <WeekPage
          clients={DEMO_CLIENTS}
          error={null}
          isRefreshing={false}
          isRepeating={false}
          knownEntries={DEMO_TIME_ENTRIES}
          knownEntryRange={{ from: "2026-07-20", to: "2026-08-02" }}
          live={null}
          monthWorkload={null}
          nextDeadline="none"
          onCreate={vi.fn().mockResolvedValue(true)}
          onDelete={vi.fn().mockResolvedValue(true)}
          onRepeatPreviousWeek={vi.fn()}
          onSubmitNewEntry={vi.fn().mockResolvedValue(true)}
          onUpdate={vi.fn().mockResolvedValue(true)}
          onWeekChange={vi.fn()}
          onWeekendToggle={vi.fn()}
          pendingCellKeys={new Set()}
          previousWeekEntries={[]}
          timeEntries={DEMO_TIME_ENTRIES}
          today={DEMO_TODAY}
          week={DEMO_WEEK}
          weekendOpen={false}
          workdayMinutes={DEMO_WORKDAY_MINUTES}
        />
      ),
    }),
  });

  render(<RouterProvider router={router} />);

  await screen.findByRole("heading");
}

it("renders the week chrome in English for an English account", async () => {
  await renderWeekInEnglish();

  expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument();
  expect(screen.getByRole("columnheader", { name: "Mission" })).toBeVisible();
  expect(screen.getByRole("columnheader", { name: "Total" })).toBeVisible();
});

it("says nothing in French on the screen every user lands on", async () => {
  await renderWeekInEnglish();

  for (const shipped of [
    "Aujourd'hui",
    "Semaine",
    "Ajouter",
    "Non facturable",
  ]) {
    expect(screen.queryByText(shipped)).toBeNull();
  }
});
