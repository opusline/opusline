import type { Meta, StoryObj } from "@storybook/react";

import { invoiceItem, secondClient } from "../lib/fixtures";
import { InvoicesTable } from "./invoices-table";

const meta = {
  title: "Web/InvoicesTable",
  component: InvoicesTable,
  tags: ["autodocs"],
} satisfies Meta<typeof InvoicesTable>;

export default meta;
type Story = StoryObj<typeof InvoicesTable>;

export const Default: Story = {
  args: {
    invoices: [
      invoiceItem(),
      invoiceItem({
        id: 2,
        number: "2026-012",
        status: 1,
        isLate: true,
        dueOn: "2026-06-30",
        amountTtc: { amount: 96_000, currency: "EUR" },
      }),
      invoiceItem({
        id: 3,
        number: null,
        status: 0,
        amountTtc: { amount: 42_000, currency: "EUR" },
      }),
      invoiceItem(
        {
          id: 4,
          number: "2026-009",
          status: 2,
          paidOn: "2026-07-20",
          amountTtc: { amount: 300_000, currency: "EUR" },
        },
        { client: secondClient, mission: null },
      ),
    ],
  },
};

export const Empty: Story = {
  args: { invoices: [] },
};
