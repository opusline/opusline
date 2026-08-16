import type { Meta, StoryObj } from "@storybook/react";

import { emptyRevenueData, revenueData } from "../lib/fixtures";
import { RevenueKpiCards } from "./revenue-kpi-cards";

const meta = {
  title: "Web/Revenue/RevenueKpiCards",
  component: RevenueKpiCards,
  tags: ["autodocs"],
  args: {
    data: revenueData(),
    basis: "invoiced",
  },
} satisfies Meta<typeof RevenueKpiCards>;

export default meta;
type Story = StoryObj<typeof RevenueKpiCards>;

export const Invoiced: Story = {};

export const Collected: Story = {
  args: { data: revenueData({ basis: 1 }), basis: "collected" },
};

export const TrendingUp: Story = {
  args: {
    data: revenueData({
      previous: {
        period: "2026-06",
        total: { amount: 950_000, currency: "EUR" },
        changeBp: 2_011,
      },
    }),
  },
};

export const NoPreviousPeriod: Story = {
  args: {
    data: revenueData({
      previous: {
        period: "2026-06",
        total: { amount: 0, currency: "EUR" },
        changeBp: null,
      },
    }),
  },
};

export const FranchiseEnBase: Story = {
  args: { data: revenueData({ vat: null }) },
};

export const EmptyPeriod: Story = {
  args: { data: emptyRevenueData() },
};
