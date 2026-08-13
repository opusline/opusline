import type { Meta, StoryObj } from "@storybook/react";

import { invoiceSummary } from "../lib/fixtures";
import { InvoiceMonthCard } from "./invoice-month-card";

const meta = {
  title: "Web/Invoices/InvoiceMonthCard",
  component: InvoiceMonthCard,
  tags: ["autodocs"],
} satisfies Meta<typeof InvoiceMonthCard>;

export default meta;
type Story = StoryObj<typeof InvoiceMonthCard>;

export const Default: Story = {
  args: { summary: invoiceSummary() },
};

export const NothingLeftToBill: Story = {
  args: {
    summary: invoiceSummary({
      monthUnbilled: { amount: { amount: 0, currency: "EUR" }, count: 0 },
    }),
  },
};
