import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import {
  DEMO_CLIENTS,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
  DEMO_WORKDAY_MINUTES,
} from "../lib/week-fixtures";
import { buildWeekGrid } from "../lib/week-grid";
import { NewEntryDialog, type NewEntryDialogProps } from "./new-entry-dialog";

const { missionOptions } = buildWeekGrid({
  format: DEFAULT_MONEY_FORMAT,
  clients: DEMO_CLIENTS,
  timeEntries: DEMO_TIME_ENTRIES,
  today: DEMO_TODAY,
  week: DEMO_WEEK,
  weekendShown: false,
});

function renderDialog(overrides: Partial<NewEntryDialogProps> = {}) {
  const onSubmit = vi.fn<NewEntryDialogProps["onSubmit"]>();

  render(
    <NewEntryDialog
      isSaving={false}
      knownRange={{ from: "2026-07-20", to: "2026-08-02" }}
      missionOptions={missionOptions}
      noteSuggestions={["Revue PR"]}
      onOpenChange={vi.fn()}
      onSubmit={onSubmit}
      open
      timeEntries={DEMO_TIME_ENTRIES}
      today={DEMO_TODAY}
      workdayMinutes={DEMO_WORKDAY_MINUTES}
      {...overrides}
    />,
  );

  return { onSubmit };
}

function pickMission(name: string) {
  fireEvent.click(screen.getByRole("button", { name: new RegExp(name) }));
}

it("asks which mission first", () => {
  renderDialog();

  expect(screen.getByText("Sur quelle mission ?")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Orvella front/ }),
  ).toBeInTheDocument();
});

it("moves to the entry form once a mission is picked", () => {
  renderDialog();

  pickMission("Orvella front");

  expect(screen.getByRole("textbox", { name: "Durée" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Changer" })).toBeInTheDocument();
});

it("reads a bare number in the mission's own unit", () => {
  const { onSubmit } = renderDialog({ timeEntries: [] });

  pickMission("Orvella front");
  fireEvent.change(screen.getByRole("textbox", { name: "Durée" }), {
    target: { value: "0,5" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith({
    billable: true,
    date: DEMO_TODAY,
    durationMinutes: 210,
    missionId: 1,
    note: null,
    replaceEntryIds: [],
  });
});

it("reads a bare number as hours on an hourly mission", () => {
  const { onSubmit } = renderDialog({ timeEntries: [] });

  pickMission("Vesterhus maintenance");
  fireEvent.change(screen.getByRole("textbox", { name: "Durée" }), {
    target: { value: "2" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ durationMinutes: 120 }),
  );
});

it("refuses to save without a duration", () => {
  const { onSubmit } = renderDialog({ timeEntries: [] });

  pickMission("Orvella front");
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Indiquez une durée");
  expect(onSubmit).not.toHaveBeenCalled();
});

it("warns when the day already carries an entry", () => {
  renderDialog();

  pickMission("Orvella front");

  expect(screen.getByText(/existe déjà ce jour-là/)).toBeInTheDocument();
});

it("adds alongside the existing entry by default", () => {
  const { onSubmit } = renderDialog();

  pickMission("Orvella front");
  fireEvent.change(screen.getByRole("textbox", { name: "Durée" }), {
    target: { value: "0,5" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ replaceEntryIds: [] }),
  );
});

it("replaces the existing entry when asked to", () => {
  const { onSubmit } = renderDialog();

  pickMission("Orvella front");
  fireEvent.click(screen.getByRole("button", { name: "Remplacer" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Durée" }), {
    target: { value: "0,5" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ replaceEntryIds: [4] }),
  );
});

it("replaces every entry on the day, not just the first", () => {
  const { onSubmit } = renderDialog({
    timeEntries: [
      {
        billable: true,
        date: DEMO_TODAY,
        durationMinutes: 210,
        id: 41,
        missionId: 1,
        note: null,
        rounding: null,
        valuedDayFraction: 0.5,
        valuedMinutes: null,
      },
      {
        billable: true,
        date: DEMO_TODAY,
        durationMinutes: 210,
        id: 42,
        missionId: 1,
        note: null,
        rounding: null,
        valuedDayFraction: 0.5,
        valuedMinutes: null,
      },
    ],
  });

  pickMission("Orvella front");
  fireEvent.click(screen.getByRole("button", { name: "Remplacer" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Durée" }), {
    target: { value: "0,5" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ replaceEntryIds: [41, 42] }),
  );
});

it("says nothing about a day it has no entries for", () => {
  renderDialog({ knownRange: { from: "2026-07-27", to: "2026-08-02" } });

  pickMission("Orvella front");
  fireEvent.change(screen.getByLabelText("Date"), {
    target: { value: "2026-03-02" },
  });

  // Outside the loaded range the dialog cannot know, so it must not imply the
  // day is empty by silently offering to add.
  expect(screen.queryByText(/existe déjà ce jour-là/)).not.toBeInTheDocument();
});

it("survives an incomplete date instead of crashing the page", () => {
  const { onSubmit } = renderDialog({ timeEntries: [] });

  pickMission("Orvella front");
  fireEvent.change(screen.getByLabelText("Date"), { target: { value: "" } });

  expect(screen.getByText("Date incomplète")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Indiquez une date");
  expect(onSubmit).not.toHaveBeenCalled();
});

it("says a too-long duration is out of range, not malformed", () => {
  const { onSubmit } = renderDialog({ timeEntries: [] });

  pickMission("Orvella front");
  fireEvent.change(screen.getByRole("textbox", { name: "Durée" }), {
    target: { value: "4" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(screen.getByRole("alert")).toHaveTextContent("24 heures");
  expect(onSubmit).not.toHaveBeenCalled();
});

it("logs time that will not be invoiced", () => {
  const { onSubmit } = renderDialog({ timeEntries: [] });

  pickMission("Orvella front");
  fireEvent.click(screen.getByRole("checkbox", { name: "Non facturable" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Durée" }), {
    target: { value: "0,5" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ billable: false }),
  );
});

it("offers no billable choice on a mission that bills nothing", () => {
  renderDialog({ timeEntries: [] });

  pickMission("Opusline");

  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
});

it("flags a mission the grid is not showing", () => {
  renderDialog({
    missionOptions: [
      { ...missionOptions[0], isInGrid: false },
      ...missionOptions.slice(1),
    ],
  });

  expect(screen.getByText("hors grille")).toBeInTheDocument();
});

it("logs onto an earlier day from the shortcuts", () => {
  const { onSubmit } = renderDialog({ timeEntries: [] });

  pickMission("Orvella front");
  fireEvent.click(screen.getByRole("button", { name: "Avant-hier" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Durée" }), {
    target: { value: "1" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ date: "2026-07-28" }),
  );
});
