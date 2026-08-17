import { render, screen } from "@testing-library/react";
import { afterAll, beforeAll, expect, it } from "vitest";

import { overwriteGetLocale } from "@/paraglide/runtime.js";

import { BillableToggle } from "./billable-toggle";
import { WeekToolbar } from "./week-toolbar";

/**
 * The rest of the suite runs pinned to French, which cannot tell a message
 * apart from a hardcoded French literal — both read "Aujourd'hui". These render
 * in English, where a literal that never reached the catalogs shows up as
 * French text on an English screen.
 *
 * Six of them had: "Aujourd'hui", "Semaine", "Mission", "Total", "Ajouter" and
 * "Non facturable" were all inlined in the week view.
 */
beforeAll(() => overwriteGetLocale(() => "en"));
afterAll(() => overwriteGetLocale(() => "fr"));

const NOOP = () => {};

it("translates the toolbar rather than shipping its French", () => {
  render(
    <WeekToolbar
      isWeekendLocked={false}
      onNewEntry={NOOP}
      onWeekChange={NOOP}
      onWeekendToggle={NOOP}
      today="2026-08-13"
      week="2026-W32"
      weekendShown={false}
    />,
  );

  expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument();
  expect(screen.queryByText("Aujourd'hui")).not.toBeInTheDocument();
});

it("translates the billable toggle rather than shipping its French", () => {
  render(<BillableToggle billable={true} onChange={NOOP} />);

  expect(screen.getByText("Non-billable")).toBeInTheDocument();
  expect(screen.queryByText("Non facturable")).not.toBeInTheDocument();
});
