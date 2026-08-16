import type { Meta, StoryObj } from "@storybook/react";

import { emptyRevenueData, revenueData } from "../lib/fixtures";
import { RevenueChart } from "./revenue-chart";

const meta = {
  title: "Web/Revenue/RevenueChart",
  component: RevenueChart,
  tags: ["autodocs"],
  args: {
    months: revenueData().months,
    basis: "invoiced",
    accountToday: "2026-08-13",
    onSelectMonth: () => {},
  },
} satisfies Meta<typeof RevenueChart>;

export default meta;
type Story = StoryObj<typeof RevenueChart>;

export const Month: Story = {};

export const Quarter: Story = {
  args: {
    months: revenueData().months.map((bar) => ({
      ...bar,
      inPeriod: bar.month >= "2026-05",
    })),
    basis: "collected",
  },
};

export const EmptyYear: Story = {
  args: { months: emptyRevenueData().months },
};
