import type { Meta, StoryObj } from "@storybook/react";

import { InvoicesEmptyState } from "./invoices-empty-state";

const meta = {
  title: "Web/InvoicesEmptyState",
  component: InvoicesEmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof InvoicesEmptyState>;

export default meta;
type Story = StoryObj<typeof InvoicesEmptyState>;

/** Nothing tracked yet — the page explains what invoices are for here. */
export const NoInvoices: Story = {
  args: { hasInvoices: false },
};

/** Invoices exist, the active filter just excludes all of them. */
export const FilteredOut: Story = {
  args: { hasInvoices: true },
};
