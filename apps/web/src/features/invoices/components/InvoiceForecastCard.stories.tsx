import type { Meta, StoryObj } from "@storybook/react";

import { invoiceSummary } from "../lib/fixtures";
import { InvoiceForecastCard } from "./invoice-forecast-card";

const meta = {
  title: "Web/Invoices/InvoiceForecastCard",
  component: InvoiceForecastCard,
  tags: ["autodocs"],
} satisfies Meta<typeof InvoiceForecastCard>;

export default meta;
type Story = StoryObj<typeof InvoiceForecastCard>;

export const Default: Story = {
  args: { summary: invoiceSummary() },
};

export const NothingOverdue: Story = {
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
