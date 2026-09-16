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

/** Clients billed at different rates: no single figure would describe the sum. */
export const MixedVatRates: Story = {
  args: {
    data: revenueData({
      vat: { amount: { amount: 228_200, currency: "EUR" }, rateBp: null },
    }),
  },
};

/** A closed month of collected revenue: the contributions are what its return settled. */
export const SettledNet: Story = {
  args: {
    data: revenueData({
      basis: 1,
      net: {
        amount: { amount: 844_300, currency: "EUR" },
        contributions: { amount: 296_700, currency: "EUR" },
        rateBp: 2600,
        estimated: false,
      },
    }),
    basis: "collected",
  },
};

/** A rate change inside the period: two returns at two rates, no single figure to caption. */
export const MixedContributionRates: Story = {
  args: {
    data: revenueData({
      period: "2026",
      net: {
        amount: { amount: 844_300, currency: "EUR" },
        contributions: { amount: 296_700, currency: "EUR" },
        rateBp: null,
        estimated: true,
      },
    }),
  },
};

export const EmptyPeriod: Story = {
  args: { data: emptyRevenueData() },
};
