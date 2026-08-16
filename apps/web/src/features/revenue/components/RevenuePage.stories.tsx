import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { emptyRevenueData, revenueData, revenueSummary } from "../lib/fixtures";
import { RevenuePage } from "./revenue-page";

const meta = {
  title: "Web/Revenue/RevenuePage",
  component: RevenuePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    data: revenueData(),
    summary: revenueSummary(),
    accountToday: "2026-08-13",
    isRefreshing: false,
    requestedPeriod: "2026-07",
    requestedBasis: "invoiced",
    onBasisChange: () => {},
    onGoToInvoices: () => {},
    onOpenInvoice: () => {},
    onPeriodChange: () => {},
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
} satisfies Meta<typeof RevenuePage>;

export default meta;
type Story = StoryObj<typeof RevenuePage>;

export const Invoiced: Story = {};

export const Collected: Story = {
  args: { data: revenueData({ basis: 1 }), requestedBasis: "collected" },
};

export const FellBack: Story = {
  args: { data: revenueData({ fellBack: true }) },
};

export const EmptyPeriod: Story = {
  args: { data: emptyRevenueData(), requestedPeriod: "2025" },
};

export const FranchiseEnBase: Story = {
  args: { data: revenueData({ vat: null }) },
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

export const NothingUnbilled: Story = {
  args: {
    summary: revenueSummary({
      unbilled: { amount: { amount: 0, currency: "EUR" }, count: 0 },
      todo: [],
      todoTotal: 0,
    }),
  },
};
