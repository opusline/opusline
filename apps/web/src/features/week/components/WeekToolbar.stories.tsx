import type { Meta, StoryObj } from "@storybook/react";

import { DEMO_TODAY, DEMO_WEEK } from "../lib/week-fixtures";
import { WeekToolbar } from "./week-toolbar";

const meta = {
  title: "Web/Week/WeekToolbar",
  component: WeekToolbar,
  tags: ["autodocs"],
  args: {
    isWeekendLocked: false,
    onNewEntry: () => {},
    onWeekChange: () => {},
    onWeekendToggle: () => {},
    today: DEMO_TODAY,
    week: DEMO_WEEK,
    weekendShown: false,
  },
} satisfies Meta<typeof WeekToolbar>;

export default meta;
type Story = StoryObj<typeof WeekToolbar>;

export const Default: Story = {};

export const CurrentWeek: Story = {
  args: { today: "2026-07-28" },
};

export const WeekendShown: Story = {
  args: { weekendShown: true },
};

export const WeekendLocked: Story = {
  args: { isWeekendLocked: true, weekendShown: true },
};

export const AcrossAYear: Story = {
  args: { week: "2026-W01" },
};
