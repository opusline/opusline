import type { Meta, StoryObj } from "@storybook/react";
import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";
import {
  DEMO_CLIENTS,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
} from "../lib/week-fixtures";
import { buildWeekGrid } from "../lib/week-grid";
import { WeekDayList } from "./week-day-list";

function model(entries: typeof DEMO_TIME_ENTRIES = DEMO_TIME_ENTRIES) {
  return buildWeekGrid({
    clients: DEMO_CLIENTS,
    format: DEFAULT_MONEY_FORMAT,
    timeEntries: entries,
    today: DEMO_TODAY,
    week: DEMO_WEEK,
    weekendShown: false,
  });
}

const meta = {
  title: "Web/Week/WeekDayList",
  component: WeekDayList,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    live: null,
    model: model(),
    noteSuggestions: ["Revue PR", "Cadrage"],
    onAddEntry: () => {},
    onDelete: () => Promise.resolve(true),
    onUpdate: () => Promise.resolve(true),
    today: DEMO_TODAY,
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WeekDayList>;

export default meta;
type Story = StoryObj<typeof WeekDayList>;

export const Default: Story = {};

export const EmptyDay: Story = {
  args: { model: model([]) },
};
