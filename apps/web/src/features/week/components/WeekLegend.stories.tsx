import type { Meta, StoryObj } from "@storybook/react";

import { WeekLegend } from "./week-legend";

const meta = {
  title: "Web/Week/WeekLegend",
  component: WeekLegend,
  tags: ["autodocs"],
} satisfies Meta<typeof WeekLegend>;

export default meta;
type Story = StoryObj<typeof WeekLegend>;

export const Default: Story = {};
