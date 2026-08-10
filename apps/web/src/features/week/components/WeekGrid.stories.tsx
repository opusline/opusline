import type { Meta, StoryObj } from "@storybook/react";
import {
  DEMO_CLIENTS,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
  DEMO_WORKDAY_MINUTES,
} from "../lib/week-fixtures";
import { buildWeekGrid } from "../lib/week-grid";
import { WeekGrid } from "./week-grid";

function model(
  overrides: {
    weekendShown?: boolean;
    entries?: typeof DEMO_TIME_ENTRIES;
  } = {},
) {
  return buildWeekGrid({
    clients: DEMO_CLIENTS,
    timeEntries: overrides.entries ?? DEMO_TIME_ENTRIES,
    today: DEMO_TODAY,
    week: DEMO_WEEK,
    weekendShown: overrides.weekendShown ?? false,
  });
}

const meta = {
  title: "Web/Week/WeekGrid",
  component: WeekGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    live: null,
    model: model(),
    noteSuggestions: ["Revue PR", "Cadrage", "Rétro + backlog"],
    onCreate: () => Promise.resolve(true),
    onDelete: () => Promise.resolve(true),
    onUpdate: () => Promise.resolve(true),
    pendingCellKeys: new Set<string>(),
    workdayMinutes: DEMO_WORKDAY_MINUTES,
  },
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WeekGrid>;

export default meta;
type Story = StoryObj<typeof WeekGrid>;

export const Default: Story = {};

export const WeekendShown: Story = {
  args: { model: model({ weekendShown: true }) },
};

export const EmptyWeek: Story = {
  args: { model: model({ entries: [] }) },
};

export const Saving: Story = {
  args: { pendingCellKeys: new Set(["1:2026-07-29"]) },
};
