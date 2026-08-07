import type { Meta, StoryObj } from "@storybook/react";

import {
  DEMO_CLIENTS,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
} from "../lib/week-fixtures";
import { buildWeekGrid, type WeekRow } from "../lib/week-grid";
import { ActivityPopover } from "./activity-popover";

const model = buildWeekGrid({
  clients: DEMO_CLIENTS,
  timeEntries: DEMO_TIME_ENTRIES,
  today: DEMO_TODAY,
  week: DEMO_WEEK,
  weekendShown: false,
});

function rowNamed(name: string): WeekRow {
  const row = model.rows.find((candidate) => candidate.name === name);

  if (row === undefined) {
    throw new Error(`No demo row named ${name}`);
  }

  return row;
}

const billedDayRow = rowNamed("OGF front");

const meta = {
  title: "Web/Week/ActivityPopover",
  component: ActivityPopover,
  tags: ["autodocs"],
  args: {
    cell: billedDayRow.cells[0],
    noteSuggestions: ["Calculateur virement", "Écran semaine", "Revue PR"],
    onClose: () => {},
    onDeleteEntry: () => {},
    onUpdateEntry: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-70 rounded-md bg-popover p-2.5 ring-1 ring-foreground/10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActivityPopover>;

export default meta;
type Story = StoryObj<typeof ActivityPopover>;

export const Default: Story = {};

export const JustAdded: Story = {
  args: {
    cell: {
      ...billedDayRow.cells[0],
      entries: [{ billable: true, durationMinutes: 60, id: 1, note: null }],
      note: null,
    },
  },
};

export const SeveralEntries: Story = {
  args: {
    cell: {
      ...billedDayRow.cells[0],
      billedLabel: "1 j",
      entries: [
        { billable: true, durationMinutes: 210, id: 1, note: "Revue PR" },
        { billable: true, durationMinutes: 210, id: 2, note: "Cadrage V2" },
      ],
      note: null,
    },
  },
};
