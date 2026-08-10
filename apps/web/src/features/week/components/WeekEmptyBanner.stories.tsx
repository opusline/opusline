import type { Meta, StoryObj } from "@storybook/react";

import { WeekEmptyBanner } from "./week-empty-banner";

const meta = {
  title: "Web/Week/WeekEmptyBanner",
  component: WeekEmptyBanner,
  tags: ["autodocs"],
  args: {
    isRepeating: false,
    onRepeat: () => {},
    previousWeekEntryCount: 9,
  },
} satisfies Meta<typeof WeekEmptyBanner>;

export default meta;
type Story = StoryObj<typeof WeekEmptyBanner>;

export const Default: Story = {};

export const SingleEntry: Story = {
  args: { previousWeekEntryCount: 1 },
};

export const Repeating: Story = {
  args: { isRepeating: true },
};
