import type { Meta, StoryObj } from "@storybook/react";
import { StoryRouter } from "@/test/story-router";
import {
  DEMO_CLIENTS,
  DEMO_MONTH_WORKLOAD,
  DEMO_NEXT_DEADLINE,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
  DEMO_WORKDAY_MINUTES,
} from "../lib/week-fixtures";
import { WeekPage } from "./week-page";

const meta = {
  title: "Web/Week/WeekPage",
  component: WeekPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    live: null,
    clients: DEMO_CLIENTS,
    knownEntries: DEMO_TIME_ENTRIES,
    knownEntryRange: { from: "2026-07-20", to: "2026-08-02" },
    error: null,
    isRefreshing: false,
    isRepeating: false,
    monthWorkload: DEMO_MONTH_WORKLOAD,
    nextDeadline: DEMO_NEXT_DEADLINE,
    onCreate: () => Promise.resolve(true),
    onDelete: () => Promise.resolve(true),
    onRepeatPreviousWeek: () => {},
    onSubmitNewEntry: () => Promise.resolve(true),
    onUpdate: () => Promise.resolve(true),
    onWeekChange: () => {},
    onWeekendToggle: () => {},
    pendingCellKeys: new Set<string>(),
    previousWeekEntries: [],
    timeEntries: DEMO_TIME_ENTRIES,
    today: DEMO_TODAY,
    week: DEMO_WEEK,
    weekendOpen: false,
    workdayMinutes: DEMO_WORKDAY_MINUTES,
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="p-6">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof WeekPage>;

export default meta;
type Story = StoryObj<typeof WeekPage>;

export const Default: Story = {};

export const WeekendShown: Story = {
  args: { weekendOpen: true },
};

export const EmptyWeek: Story = {
  args: {
    previousWeekEntries: DEMO_TIME_ENTRIES,
    timeEntries: [],
  },
};

export const NoMissions: Story = {
  args: {
    clients: [],
    timeEntries: [],
  },
};

export const WriteFailed: Story = {
  args: {
    error: "Impossible de saisir plus de 24 heures de travail à la même date.",
  },
};

export const Refreshing: Story = {
  args: { isRefreshing: true },
};
