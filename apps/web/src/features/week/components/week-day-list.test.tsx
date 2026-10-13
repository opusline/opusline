import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";
import {
  DEMO_CLIENTS,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
} from "../lib/week-fixtures";
import { buildWeekGrid } from "../lib/week-grid";
import { WeekDayList } from "./week-day-list";

function renderList(timeEntries = DEMO_TIME_ENTRIES) {
  const onAddEntry = vi.fn();

  render(
    <WeekDayList
      live={null}
      model={buildWeekGrid({
        clients: DEMO_CLIENTS,
        format: DEFAULT_MONEY_FORMAT,
        timeEntries,
        today: DEMO_TODAY,
        week: DEMO_WEEK,
        weekendShown: false,
      })}
      noteSuggestions={[]}
      onAddEntry={onAddEntry}
      onDelete={vi.fn()}
      onUpdate={vi.fn()}
      today={DEMO_TODAY}
    />,
  );

  return { onAddEntry };
}

it("opens on today", () => {
  renderList();

  expect(screen.getByTestId("week-day-list")).toHaveAttribute(
    "data-date",
    DEMO_TODAY,
  );
});

it("lists the entries of the day the user picks", () => {
  renderList();

  const tabs = screen.getAllByTestId("week-day-tab");
  const monday = tabs[0];

  fireEvent.click(monday);

  expect(screen.getByTestId("week-day-list")).toHaveAttribute(
    "data-date",
    monday.getAttribute("data-date"),
  );
  expect(monday).toHaveAttribute("aria-pressed", "true");
});

it("says so when the day is empty, and still offers to add an entry", () => {
  const { onAddEntry } = renderList([]);

  expect(screen.queryAllByTestId("week-day-entry-card")).toHaveLength(0);

  fireEvent.click(screen.getByTestId("week-day-add"));

  expect(onAddEntry).toHaveBeenCalledOnce();
});
