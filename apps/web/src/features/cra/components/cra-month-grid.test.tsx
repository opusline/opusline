import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { buildCraGrid } from "../lib/cra-grid";
import { craDays, DEMO_MONTH } from "../lib/fixtures";
import { CraMonthGrid } from "./cra-month-grid";

function grid(overrides: Partial<React.ComponentProps<typeof CraMonthGrid>>) {
  return (
    <CraMonthGrid
      editable
      isDirty={false}
      model={buildCraGrid({ month: DEMO_MONTH, days: craDays() })}
      onChange={vi.fn()}
      onFillWeekdays={vi.fn()}
      onReset={vi.fn()}
      reportedDays={21}
      trackedDays={21}
      {...overrides}
    />
  );
}

function renderGrid(
  overrides: Partial<React.ComponentProps<typeof CraMonthGrid>> = {},
) {
  const onChange = vi.fn();
  const onFillWeekdays = vi.fn();
  const onReset = vi.fn();

  const { rerender } = render(
    grid({ onChange, onFillWeekdays, onReset, ...overrides }),
  );

  return { onChange, onFillWeekdays, onReset, rerender };
}

/** August 2026 — a different month, so July's keys match none of its cells. */
function august() {
  return grid({
    model: buildCraGrid({
      month: "2026-08",
      days: craDays({}, "2026-08"),
    }),
  });
}

/** Monday 6 July 2026 — a full day on the seeded grid. */
function monday() {
  return screen.getByRole("gridcell", { name: /lundi 6 juillet/i });
}

it("lays the month out as a grid of seven columns", () => {
  renderGrid();

  expect(screen.getByRole("grid")).toHaveAttribute("aria-colcount", "7");
});

it("keeps a single tab stop", () => {
  renderGrid();

  const stops = screen
    .getAllByRole("gridcell")
    .filter((cell) => cell.tabIndex === 0);

  expect(stops).toHaveLength(1);
});

it("moves the tab stop with the arrow keys", () => {
  renderGrid();
  const start = monday();
  start.focus();

  fireEvent.keyDown(start, { key: "ArrowRight" });

  expect(
    screen.getByRole("gridcell", { name: /mardi 7 juillet/i }),
  ).toHaveFocus();
  expect(start).toHaveAttribute("tabindex", "-1");
});

it("wraps to the next week rather than stopping on Sunday", () => {
  renderGrid();
  const sunday = screen.getByRole("gridcell", { name: /dimanche 5 juillet/i });
  sunday.focus();

  fireEvent.keyDown(sunday, { key: "ArrowRight" });

  expect(
    screen.getByRole("gridcell", { name: /lundi 6 juillet/i }),
  ).toHaveFocus();
});

it("keeps its tab stop when the arrow would leave the month", () => {
  renderGrid();
  // 1 July 2026 is a Wednesday, so the two cells to its left are padding days from
  // June: they render nothing focusable, and letting the tab stop settle there would
  // drop the whole grid out of the tab order.
  const first = screen.getByRole("gridcell", { name: /mercredi 1 juillet/i });
  first.focus();

  fireEvent.keyDown(first, { key: "ArrowLeft" });

  expect(first).toHaveFocus();
  expect(
    screen.getAllByRole("gridcell").filter((cell) => cell.tabIndex === 0),
  ).toHaveLength(1);
});

it("moves down a week with the down arrow", () => {
  renderGrid();
  const start = monday();
  start.focus();

  fireEvent.keyDown(start, { key: "ArrowDown" });

  expect(
    screen.getByRole("gridcell", { name: /lundi 13 juillet/i }),
  ).toHaveFocus();
});

it("cycles a day from a whole day to a half on space", () => {
  const { onChange } = renderGrid();

  fireEvent.keyDown(monday(), { key: " " });

  expect(onChange).toHaveBeenCalledWith("2026-07-06", 5_000);
});

it("clears a day on delete", () => {
  const { onChange } = renderGrid();

  fireEvent.keyDown(monday(), { key: "Delete" });

  expect(onChange).toHaveBeenCalledWith("2026-07-06", 0);
});

it("cycles a day when it is clicked", () => {
  const { onChange } = renderGrid();

  fireEvent.click(monday());

  expect(onChange).toHaveBeenCalledWith("2026-07-06", 5_000);
});

it("fills an empty day with a whole day", () => {
  const { onChange } = renderGrid();

  fireEvent.click(screen.getByRole("gridcell", { name: /samedi 4 juillet/i }));

  expect(onChange).toHaveBeenCalledWith("2026-07-04", 10_000);
});

it("says why a holiday is greyed", () => {
  renderGrid();

  expect(
    screen.getByRole("gridcell", { name: /mardi 14 juillet.*fête nationale/i }),
  ).toBeInTheDocument();
});

it("writes nothing when the CRA is no longer editable", () => {
  const { onChange } = renderGrid({ editable: false });

  fireEvent.click(monday());
  fireEvent.keyDown(monday(), { key: " " });

  expect(onChange).not.toHaveBeenCalled();
});

it("still lets a frozen grid be walked with the keyboard", () => {
  renderGrid({ editable: false });
  const start = monday();
  start.focus();

  fireEvent.keyDown(start, { key: "ArrowRight" });

  expect(
    screen.getByRole("gridcell", { name: /mardi 7 juillet/i }),
  ).toHaveFocus();
});

it("offers to fill the working days while editable", () => {
  const { onFillWeekdays } = renderGrid();

  fireEvent.click(
    screen.getByRole("button", { name: "Remplir les jours ouvrés" }),
  );

  expect(onFillWeekdays).toHaveBeenCalled();
});

it("withholds the fill button once the grid is frozen", () => {
  renderGrid({ editable: false });

  expect(
    screen.queryByRole("button", { name: "Remplir les jours ouvrés" }),
  ).not.toBeInTheDocument();
});

it("keeps one tab stop when another month replaces the model", () => {
  const { rerender } = renderGrid();
  const start = monday();
  start.focus();

  fireEvent.keyDown(start, { key: "ArrowRight" });
  // Picking another CRA swaps the month underneath a key retained from this one.
  rerender(august());

  expect(
    screen.getAllByRole("gridcell").filter((cell) => cell.tabIndex === 0),
  ).toHaveLength(1);
});

it("offers to restore the tracked entries only once the grid has been changed", () => {
  renderGrid();

  expect(
    screen.queryByRole("button", { name: "Rétablir mes entrées" }),
  ).not.toBeInTheDocument();
});

it("restores the tracked entries when asked", () => {
  const { onReset } = renderGrid({ isDirty: true });

  fireEvent.click(screen.getByRole("button", { name: "Rétablir mes entrées" }));

  expect(onReset).toHaveBeenCalled();
});

it("marks a day whose write is still in flight as busy", () => {
  renderGrid({ pendingDates: new Set(["2026-07-06"]) });

  expect(monday()).toHaveAttribute("aria-busy", "true");
});
