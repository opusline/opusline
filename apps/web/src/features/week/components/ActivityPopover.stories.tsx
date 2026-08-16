import type { Meta, StoryObj } from "@storybook/react";

import { demoRowNamed } from "../lib/week-fixtures";
import { ActivityPopover } from "./activity-popover";

const billedDayRow = demoRowNamed("Orvella front");

const meta = {
  title: "Web/Week/ActivityPopover",
  component: ActivityPopover,
  tags: ["autodocs"],
  args: {
    canBill: true,
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

/** A mission with no rate bills nothing, so the choice is not offered at all. */
export const WithoutRate: Story = {
  args: { canBill: false },
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
