import type { Meta, StoryObj } from "@storybook/react";

import { invoiceDetail } from "../lib/fixtures";
import { InvoiceDrawer } from "./invoice-drawer";

const meta = {
  title: "Web/InvoiceDrawer",
  component: InvoiceDrawer,
  tags: ["autodocs"],
} satisfies Meta<typeof InvoiceDrawer>;

export default meta;
type Story = StoryObj<typeof InvoiceDrawer>;

export const Paid: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    detail: invoiceDetail({
      status: 2,
      periodStart: "2026-06-01",
      issuedOn: "2026-06-30",
      dueOn: "2026-08-29",
      paidOn: "2026-07-24",
      amountHt: { amount: 51_000, currency: "EUR" },
      amountVat: { amount: 10_200, currency: "EUR" },
      amountTtc: { amount: 61_200, currency: "EUR" },
    }),
  },
};

/** Nothing has loaded yet — the panel opens before the request settles. */
export const Loading: Story = {
  args: { open: true, onOpenChange: () => {}, detail: undefined },
};
