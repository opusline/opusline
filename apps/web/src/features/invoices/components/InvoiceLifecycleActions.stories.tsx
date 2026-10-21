import type { Meta, StoryObj } from "@storybook/react";

import { invoiceDetail } from "../lib/fixtures";
import { InvoiceLifecycleActions } from "./invoice-lifecycle-actions";

const meta = {
  title: "Web/Invoices/InvoiceLifecycleActions",
  component: InvoiceLifecycleActions,
  tags: ["autodocs"],
  args: {
    invoice: invoiceDetail({ status: 1 }).invoice,
    accountToday: "2026-08-14",
    isPending: false,
    error: null,
    onSend: () => {},
    onPay: () => {},
    onRemind: () => {},
    canDelete: false,
    onDelete: () => {},
  },
} satisfies Meta<typeof InvoiceLifecycleActions>;

export default meta;
type Story = StoryObj<typeof InvoiceLifecycleActions>;

export const Sent: Story = {};

/** Recorded from another tool with no money on it: it may still be deleted. */
export const SentDeletable: Story = {
  args: { canDelete: true },
};

export const Draft: Story = {
  args: { invoice: invoiceDetail({ status: 0 }).invoice, canDelete: true },
};

export const DraftWithoutReference: Story = {
  args: {
    invoice: invoiceDetail({ status: 0, number: null }).invoice,
    canDelete: true,
  },
};

export const Refused: Story = {
  args: {
    error: "Une facture envoyée ne peut plus être marquée envoyée.",
  },
};

/** A paid invoice has nowhere left to go, so the section renders nothing. */
export const Paid: Story = {
  args: { invoice: invoiceDetail({ status: 2 }).invoice },
};
