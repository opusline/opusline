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

/** The grid rings time no invoice covers yet, so the legend totals it. */
export const WithUninvoicedTime: Story = {
  args: { uninvoicedTotal: "4,5 j · 3,5 h" },
};
