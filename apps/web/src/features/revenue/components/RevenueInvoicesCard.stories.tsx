import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { revenueData, revenueInvoiceItem } from "../lib/fixtures";
import { RevenueInvoicesCard } from "./revenue-invoices-card";

const meta = {
  title: "Web/Revenue/RevenueInvoicesCard",
  component: RevenueInvoicesCard,
  tags: ["autodocs"],
  args: {
    invoices: revenueData().invoices,
    basis: "invoiced",
    periodTitle: "Juillet 2026",
    onOpenInvoice: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="max-w-md p-6">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof RevenueInvoicesCard>;

export default meta;
type Story = StoryObj<typeof RevenueInvoicesCard>;

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

export const Overflowing: Story = {
  args: {
    invoices: Array.from({ length: 7 }, (_, index) =>
      revenueInvoiceItem({
        id: index + 1,
        number: `F-2026-0${40 + index}`,
      }),
    ),
  },
};

export const Empty: Story = {
  args: { invoices: [], basis: "collected", periodTitle: "2025" },
};
