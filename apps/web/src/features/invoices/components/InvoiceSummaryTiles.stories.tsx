import type { Meta, StoryObj } from "@storybook/react";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import { invoiceSummary } from "../lib/fixtures";
import { InvoiceSummaryTiles } from "./invoice-summary-tiles";

const meta = {
  title: "Web/Invoices/InvoiceSummaryTiles",
  component: InvoiceSummaryTiles,
  tags: ["autodocs"],
} satisfies Meta<typeof InvoiceSummaryTiles>;

export default meta;
type Story = StoryObj<typeof InvoiceSummaryTiles>;

export const Default: Story = {
  args: { summary: invoiceSummary() },
};

/** A US-hosted account: same tiles, dollar amounts formatted the US way. */
export const UsAccount: Story = {
  args: { summary: invoiceSummary() },
  decorators: [
    (Story) => (
      <MoneyFormatProvider currency="USD" locale="en-US">
        <Story />
      </MoneyFormatProvider>
    ),
  ],
};

export const NothingLate: Story = {
  args: {
    summary: invoiceSummary({
      overdue: {
        amount: { amount: 0, currency: "EUR" },
        count: 0,
        maxDaysLate: 0,
      },
    }),
  },
};

export const NothingOutstanding: Story = {
  args: {
    summary: invoiceSummary({
      toCollect: { amount: { amount: 0, currency: "EUR" }, count: 0 },
      overdue: {
        amount: { amount: 0, currency: "EUR" },
        count: 0,
        maxDaysLate: 0,
      },
    }),
  },
};
