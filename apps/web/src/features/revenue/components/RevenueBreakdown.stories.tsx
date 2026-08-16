import type { Meta, StoryObj } from "@storybook/react";

import { revenueData } from "../lib/fixtures";
import { RevenueBreakdown } from "./revenue-breakdown";

const meta = {
  title: "Web/Revenue/RevenueBreakdown",
  component: RevenueBreakdown,
  tags: ["autodocs"],
  args: {
    clients: revenueData().clients,
    invoices: revenueData().invoices,
    basis: "invoiced",
    periodLabel: "Juillet 2026",
    lastActivePeriod: "2026-07",
    onOpenInvoice: () => {},
    onShowPeriod: () => {},
  },
} satisfies Meta<typeof RevenueBreakdown>;

export default meta;
type Story = StoryObj<typeof RevenueBreakdown>;

export const Invoiced: Story = {};

export const Collected: Story = {
  args: {
    basis: "collected",
    invoices: revenueData().invoices.map((item) => ({
      ...item,
      invoice: { ...item.invoice, status: 2, paidOn: "2026-08-10" },
    })),
  },
};

export const EmptyPeriod: Story = {
  args: {
    clients: [],
    invoices: [],
    basis: "collected",
    periodLabel: "2025",
    lastActivePeriod: "2026",
  },
};

export const EmptyWithoutHistory: Story = {
  args: {
    clients: [],
    invoices: [],
    periodLabel: "2025",
    lastActivePeriod: null,
  },
};
