import type { Meta, StoryObj } from "@storybook/react";

import { WeekMissionsEmptyState } from "./week-missions-empty-state";

const meta = {
  title: "Web/Week/WeekMissionsEmptyState",
  component: WeekMissionsEmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof WeekMissionsEmptyState>;

export default meta;
type Story = StoryObj<typeof WeekMissionsEmptyState>;

export const Default: Story = {};
