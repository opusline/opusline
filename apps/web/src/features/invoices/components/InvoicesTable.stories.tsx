import type { Meta, StoryObj } from "@storybook/react";

import { clientTotals, invoiceItem, secondClient } from "../lib/fixtures";
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
    accountToday: "2026-08-14",
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
    clientTotals: [
      clientTotals(1, {
        all: { amount: 336_000, currency: "EUR" },
        open: { amount: 294_000, currency: "EUR" },
        late: { amount: 96_000, currency: "EUR" },
        draft: { amount: 42_000, currency: "EUR" },
      }),
      clientTotals(2, {
        all: { amount: 300_000, currency: "EUR" },
        paid: { amount: 300_000, currency: "EUR" },
      }),
    ],
  },
};

export const Empty: Story = {
  args: { accountToday: "2026-08-14", invoices: [], clientTotals: [] },
};
