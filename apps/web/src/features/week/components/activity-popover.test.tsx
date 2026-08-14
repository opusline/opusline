import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import {
  DEMO_CLIENTS,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
} from "../lib/week-fixtures";
import { buildWeekGrid, type WeekCell } from "../lib/week-grid";
import { ActivityPopover } from "./activity-popover";

const { rows } = buildWeekGrid({
  format: DEFAULT_MONEY_FORMAT,
  clients: DEMO_CLIENTS,
  timeEntries: DEMO_TIME_ENTRIES,
  today: DEMO_TODAY,
  week: DEMO_WEEK,
  weekendShown: false,
});

function mondayCellOf(name: string): WeekCell {
  const cell = rows.find((row) => row.name === name)?.cells[0];

  if (cell === undefined) {
    throw new Error(`No demo cell for ${name}`);
  }

  return cell;
}

const singleEntryCell = mondayCellOf("OGF front");

function renderPopover() {
  const onUpdateEntry = vi.fn();

  render(
    <ActivityPopover
      canBill
      cell={singleEntryCell}
      noteSuggestions={["Cadrage V2", "Revue PR"]}
      onClose={vi.fn()}
      onDeleteEntry={vi.fn()}
      onUpdateEntry={onUpdateEntry}
    />,
  );

  return { onUpdateEntry };
}

it("saves the suggestion, not the half-typed text underneath it", () => {
  const { onUpdateEntry } = renderPopover();

  fireEvent.change(screen.getByRole("textbox", { name: "Activité" }), {
    target: { value: "Cad" },
  });

  const suggestion = screen.getByRole("button", { name: /Cadrage V2/ });

  expect(fireEvent.mouseDown(suggestion)).toBe(false);

  fireEvent.click(suggestion);

  expect(onUpdateEntry).toHaveBeenCalledTimes(1);
  expect(onUpdateEntry).toHaveBeenCalledWith(singleEntryCell.entries[0].id, {
    note: "Cadrage V2",
  });
});

it("offers no suggestion identical to what is already typed", () => {
  renderPopover();

  fireEvent.change(screen.getByRole("textbox", { name: "Activité" }), {
    target: { value: "Revue PR" },
  });

  expect(
    screen.queryByRole("button", { name: /Revue PR/ }),
  ).not.toBeInTheDocument();
});

it("takes an entry off the invoice without touching its note", () => {
  const { onUpdateEntry } = renderPopover();

  fireEvent.click(screen.getByRole("checkbox", { name: "Non facturable" }));

  expect(onUpdateEntry).toHaveBeenCalledWith(singleEntryCell.entries[0].id, {
    billable: false,
  });
});

it("offers no billable choice on a mission that bills nothing", () => {
  render(
    <ActivityPopover
      canBill={false}
      cell={singleEntryCell}
      noteSuggestions={[]}
      onClose={vi.fn()}
      onDeleteEntry={vi.fn()}
      onUpdateEntry={vi.fn()}
    />,
  );

  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
});
