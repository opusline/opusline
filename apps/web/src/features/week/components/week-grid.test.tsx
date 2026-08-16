import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";
import {
  DEMO_CLIENTS,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
  DEMO_WORKDAY_MINUTES,
} from "../lib/week-fixtures";
import { buildWeekGrid, type LiveCell } from "../lib/week-grid";
import { WeekGrid, type WeekGridProps } from "./week-grid";

function renderGrid(
  overrides: {
    live?: LiveCell | null;
    timeEntries?: typeof DEMO_TIME_ENTRIES;
    weekendShown?: boolean;
    writesSucceed?: boolean;
  } = {},
) {
  const handlers = {
    onCreate: vi
      .fn<WeekGridProps["onCreate"]>()
      .mockResolvedValue(overrides.writesSucceed ?? true),
    onDelete: vi.fn<WeekGridProps["onDelete"]>().mockResolvedValue(true),
    onUpdate: vi.fn<WeekGridProps["onUpdate"]>().mockResolvedValue(true),
  };

  const gridFor = (timeEntries: typeof DEMO_TIME_ENTRIES) => (
    <WeekGrid
      live={overrides.live ?? null}
      model={buildWeekGrid({
        format: DEFAULT_MONEY_FORMAT,
        clients: DEMO_CLIENTS,
        liveMissionId: overrides.live?.missionId ?? null,
        timeEntries,
        today: DEMO_TODAY,
        week: DEMO_WEEK,
        weekendShown: overrides.weekendShown ?? false,
      })}
      noteSuggestions={[]}
      pendingCellKeys={new Set()}
      workdayMinutes={DEMO_WORKDAY_MINUTES}
      {...handlers}
    />
  );

  const { rerender } = render(
    gridFor(overrides.timeEntries ?? DEMO_TIME_ENTRIES),
  );

  return {
    ...handlers,
    /** Stands in for the list query refreshing after a write. */
    refresh: (timeEntries: typeof DEMO_TIME_ENTRIES) =>
      rerender(gridFor(timeEntries)),
  };
}

const MONDAY_TJM_ENTRY = {
  billable: true,
  date: "2026-07-27",
  durationMinutes: DEMO_WORKDAY_MINUTES,
  id: 101,
  missionId: 1,
  note: null,
  rounding: null,
  valuedDayFraction: 1,
  valuedMinutes: null,
};

/** The Monday cell of the TJM mission — "1 j, Sprint 24 · specs". */
function mondayTjmCell(): HTMLElement {
  return screen.getByRole("gridcell", {
    name: /Orvella front, lundi 27 juillet/,
  });
}

it("exposes the week as a grid with one column per weekday plus the totals", () => {
  renderGrid();

  // 5 weekdays + mission + total; the collapsed weekend carries no data.
  expect(screen.getByRole("grid")).toHaveAttribute("aria-colcount", "8");
});

function columnTemplates(): Set<string | undefined> {
  return new Set(
    screen
      .getAllByRole("row")
      .map((row) =>
        [...row.classList].find((name) => name.startsWith("grid-cols-")),
      ),
  );
}

it("gives every row the same column template", () => {
  renderGrid();

  expect(columnTemplates().size).toBe(1);
});

it("sizes every column but the days to a fixed length", () => {
  renderGrid();

  // Each row is its own grid, so a content-sized track resolves to a different
  // width per row — "7 h" in one, "6,5 j · 11 h" in another — and the columns
  // stop lining up. Only the day columns may flex.
  expect([...columnTemplates()][0]).not.toMatch(
    /auto|max-content|min-content|fit-content/,
  );
});

it("names a filled cell with its mission, day, value and note", () => {
  renderGrid();

  expect(mondayTjmCell()).toHaveAccessibleName(
    "Orvella front, lundi 27 juillet : 1 j, Sprint 24 · specs",
  );
});

it("names an empty cell as empty", () => {
  renderGrid({ timeEntries: [] });

  expect(mondayTjmCell()).toHaveAccessibleName(
    "Orvella front, lundi 27 juillet : aucune entrée",
  );
});

it("opens the editor when a filled cell is clicked", () => {
  renderGrid();

  fireEvent.click(mondayTjmCell());

  expect(screen.getByRole("textbox", { name: /Durée/ })).toHaveValue("1");
});

it("keeps a single tab stop and moves it with the arrow keys", () => {
  renderGrid();

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "ArrowRight" });

  expect(
    screen.getByRole("gridcell", { name: /Orvella front, mardi 28 juillet/ }),
  ).toHaveFocus();
  expect(monday).toHaveAttribute("tabindex", "-1");
});

it("keeps the typed draft when the input itself is clicked", () => {
  renderGrid({ timeEntries: [] });

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "1" });

  const editor = screen.getByRole("textbox", { name: /Durée/ });
  fireEvent.change(editor, { target: { value: "0,5" } });
  // Clicking to reposition the caret bubbles to the cell; re-seeding the draft
  // from the stored entry there would wipe what was typed.
  fireEvent.click(editor);

  expect(screen.getByRole("textbox", { name: /Durée/ })).toHaveValue("0,5");
});

it("never lands the tab stop on the collapsed weekend", () => {
  renderGrid();

  const friday = screen.getByRole("gridcell", {
    name: /Orvella front, vendredi 31 juillet/,
  });
  friday.focus();
  fireEvent.keyDown(friday, { key: "ArrowRight" });

  // The collapsed weekend renders nothing focusable, so stopping there would
  // leave the grid with no tab stop at all.
  expect(friday).toHaveFocus();
  expect(friday).toHaveAttribute("tabindex", "0");
});

it("keeps a tab stop when the week it moves to has fewer rows", () => {
  const { refresh } = renderGrid();

  const cell = screen.getByRole("gridcell", {
    name: /Opusline, mardi 28 juillet/,
  });
  cell.focus();

  // Opusline only has a row while it carries entries; dropping them removes it.
  refresh(DEMO_TIME_ENTRIES.filter((entry) => entry.missionId !== 3));

  expect(
    screen.getAllByRole("gridcell").filter((c) => c.tabIndex === 0),
  ).toHaveLength(1);
});

it("marks a day worked in one keystroke on a day-billed mission", () => {
  const { onCreate } = renderGrid({ timeEntries: [] });

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: " " });

  expect(onCreate).toHaveBeenCalledWith({
    cellKey: "1:2026-07-27",
    date: "2026-07-27",
    durationMinutes: DEMO_WORKDAY_MINUTES,
    missionId: 1,
  });
});

it("unmarks a full day when the same key is pressed again", () => {
  const { onDelete } = renderGrid();

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: " " });

  expect(onDelete).toHaveBeenCalledWith({
    cellKey: "1:2026-07-27",
    entryIds: [1],
  });
});

it("opens the editor seeded with the digit that was typed", () => {
  renderGrid({ timeEntries: [] });

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "1" });

  expect(screen.getByRole("textbox", { name: /Durée/ })).toHaveValue("1");
});

it("keeps the caret after a seeded digit instead of re-selecting the draft", () => {
  renderGrid({ timeEntries: [] });

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "1" });

  const editor = screen.getByRole<HTMLInputElement>("textbox", {
    name: /Durée/,
  });

  expect(editor.selectionStart).toBe(1);

  // Re-selecting on every keystroke would make the next character overwrite
  // everything typed so far.
  fireEvent.change(editor, { target: { value: "1," } });

  expect(editor.selectionStart).toBe(editor.selectionEnd);
});

it("selects an existing value so typing replaces it", () => {
  renderGrid();

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "Enter" });

  const editor = screen.getByRole<HTMLInputElement>("textbox", {
    name: /Durée/,
  });

  expect(editor.selectionStart).toBe(0);
  expect(editor.selectionEnd).toBe(editor.value.length);
});

it("writes a typed half-day as minutes", () => {
  const { onCreate } = renderGrid({ timeEntries: [] });

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "0" });

  const editor = screen.getByRole("textbox", { name: /Durée/ });
  fireEvent.change(editor, { target: { value: "0,5" } });
  fireEvent.keyDown(editor, { key: "Enter" });

  // Committing also blurs the editor, which must not write a second time.
  expect(onCreate).toHaveBeenCalledTimes(1);
  expect(onCreate).toHaveBeenCalledWith(
    expect.objectContaining({ durationMinutes: 210 }),
  );
});

it("changes only the duration, leaving the note for the caller to preserve", () => {
  const { onUpdate } = renderGrid();

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "Enter" });

  const editor = screen.getByRole("textbox", { name: /Durée/ });
  fireEvent.change(editor, { target: { value: "0,5" } });
  fireEvent.keyDown(editor, { key: "Enter" });

  expect(onUpdate).toHaveBeenCalledTimes(1);
  expect(onUpdate).toHaveBeenCalledWith({
    cellKey: "1:2026-07-27",
    durationMinutes: 210,
    entryId: 1,
  });
});

async function typeDurationAndCommit(key: string) {
  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "1" });
  fireEvent.keyDown(screen.getByRole("textbox", { name: /Durée/ }), { key });

  // Let the create settle — the popover waits on its result, not on the press.
  await act(async () => {});
}

it("asks for the activity once a newly added entry lands", async () => {
  const { refresh } = renderGrid({ timeEntries: [] });

  await typeDurationAndCommit("Enter");

  // Nothing to attach a note to until the entry is actually in the model.
  expect(
    screen.queryByRole("textbox", { name: "Activité" }),
  ).not.toBeInTheDocument();

  await act(async () => {
    refresh([MONDAY_TJM_ENTRY]);
  });

  // Portalled: jsdom keeps Base UI's popup hidden until it measures, so assert
  // presence rather than visibility.
  expect(screen.getByRole("textbox", { name: "Activité" })).toBeInTheDocument();
});

it("does not arm the activity popover when the create is rejected", async () => {
  const { refresh } = renderGrid({ timeEntries: [], writesSucceed: false });

  await typeDurationAndCommit("Enter");

  // An entry landing later from another path must not pop the popover open on
  // a cell the user has long moved on from.
  await act(async () => {
    refresh([MONDAY_TJM_ENTRY]);
  });

  expect(
    screen.queryByRole("textbox", { name: "Activité" }),
  ).not.toBeInTheDocument();
});

it("does not interrupt the fill-the-week path when Tab commits", async () => {
  const { refresh } = renderGrid({ timeEntries: [] });

  await typeDurationAndCommit("Tab");

  refresh([MONDAY_TJM_ENTRY]);

  expect(
    screen.queryByRole("textbox", { name: "Activité" }),
  ).not.toBeInTheDocument();
});

it("does not interrupt the one-keystroke day toggle", async () => {
  const { refresh } = renderGrid({ timeEntries: [] });

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: " " });
  await act(async () => {});

  refresh([MONDAY_TJM_ENTRY]);

  expect(
    screen.queryByRole("textbox", { name: "Activité" }),
  ).not.toBeInTheDocument();
});

it("reads a bare number as hours on an hourly mission", () => {
  const { onCreate } = renderGrid({ timeEntries: [] });

  const cell = screen.getByRole("gridcell", {
    name: /Vesterhus maintenance, lundi 27 juillet/,
  });
  cell.focus();
  fireEvent.keyDown(cell, { key: "2" });

  const editor = screen.getByRole("textbox", { name: /Durée/ });
  fireEvent.keyDown(editor, { key: "Enter" });

  expect(onCreate).toHaveBeenCalledWith(
    expect.objectContaining({ durationMinutes: 120 }),
  );
});

it("keeps an unparseable draft on screen instead of discarding it", () => {
  const { onCreate, onUpdate } = renderGrid();

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "Enter" });

  const editor = screen.getByRole("textbox", { name: /Durée/ });
  fireEvent.change(editor, { target: { value: "beaucoup" } });
  fireEvent.keyDown(editor, { key: "Enter" });

  expect(screen.getByRole("alert")).toHaveTextContent("Format");
  expect(onCreate).not.toHaveBeenCalled();
  expect(onUpdate).not.toHaveBeenCalled();
});

it("does not write when the duration is unchanged", () => {
  const { onUpdate } = renderGrid();

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "Enter" });
  fireEvent.keyDown(screen.getByRole("textbox", { name: /Durée/ }), {
    key: "Enter",
  });

  expect(onUpdate).not.toHaveBeenCalled();
});

it("discards the draft on Escape", () => {
  const { onUpdate } = renderGrid();

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "Enter" });

  const editor = screen.getByRole("textbox", { name: /Durée/ });
  fireEvent.change(editor, { target: { value: "2" } });
  fireEvent.keyDown(editor, { key: "Escape" });

  expect(onUpdate).not.toHaveBeenCalled();
  expect(monday).toHaveFocus();
});

it("clears a cell on Backspace", () => {
  const { onDelete } = renderGrid();

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "Backspace" });

  expect(onDelete).toHaveBeenCalledWith({
    cellKey: "1:2026-07-27",
    entryIds: [1],
  });
});

it("opens the detail popover rather than the inline editor when a cell holds several entries", () => {
  renderGrid({
    timeEntries: [
      {
        billable: true,
        date: "2026-07-27",
        durationMinutes: 210,
        id: 1,
        missionId: 1,
        note: "Revue PR",
        rounding: null,
        valuedDayFraction: 0.5,
        valuedMinutes: null,
      },
      {
        billable: true,
        date: "2026-07-27",
        durationMinutes: 210,
        id: 2,
        missionId: 1,
        note: "Cadrage",
        rounding: null,
        valuedDayFraction: 0.5,
        valuedMinutes: null,
      },
    ],
  });

  const monday = mondayTjmCell();
  monday.focus();
  fireEvent.keyDown(monday, { key: "Enter" });

  expect(screen.getAllByRole("textbox", { name: "Activité" })).toHaveLength(2);
});

it("totals a day across both units, billable time only", () => {
  renderGrid();

  expect(
    screen.getByRole("gridcell", { name: "Total de la semaine" }),
  ).toHaveTextContent("4,5 j · 3,5 h");
});

const RUNNING_ON_MONDAY: LiveCell = {
  billedLabel: "0,5 j",
  clockLabel: "03:42:18",
  date: "2026-07-27",
  isRunning: true,
  missionId: 1,
  onStop: () => undefined,
};

it("shows the running timer as a provisional value on its own day", () => {
  renderGrid({ live: RUNNING_ON_MONDAY });

  expect(mondayTjmCell()).toHaveTextContent("0,5 j");
  expect(mondayTjmCell()).toHaveTextContent("en cours · 03:42:18");
});

it("shows the timer alongside the entry already on that day", () => {
  renderGrid({ live: RUNNING_ON_MONDAY });

  expect(mondayTjmCell()).toHaveTextContent("Sprint 24 · specs");
});

it("leaves every other day of that mission alone", () => {
  renderGrid({ live: RUNNING_ON_MONDAY });

  expect(
    screen.getByRole("gridcell", { name: /Orvella front, mardi 28 juillet/ }),
  ).not.toHaveTextContent("en cours");
});

it("says the timer is paused when it is", () => {
  renderGrid({ live: { ...RUNNING_ON_MONDAY, isRunning: false } });

  expect(mondayTjmCell()).toHaveTextContent("en pause · 03:42:18");
});

it("names the running timer in the cell's accessible label", () => {
  renderGrid({ live: RUNNING_ON_MONDAY });

  expect(
    screen.getByRole("gridcell", { name: /en cours · 03:42:18/ }),
  ).toBeInTheDocument();
});

const SATURDAY = "2026-08-01";

/*
 * The weekend column is collapsed unless something forces it open, so a Saturday
 * timer is the case where the pill can silently have nowhere to render.
 */
it("renders the live pill on a weekend day", () => {
  renderGrid({
    live: { ...RUNNING_ON_MONDAY, date: SATURDAY },
    timeEntries: [],
    weekendShown: true,
  });

  expect(
    screen.getByRole("gridcell", { name: /Orvella front, samedi 1 août/ }),
  ).toHaveTextContent("en cours · 03:42:18");
});
