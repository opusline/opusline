import type { Meta, StoryObj } from "@storybook/react";

import { invoiceDetail } from "../lib/fixtures";
import { InvoiceLifecycleActions } from "./invoice-lifecycle-actions";

const meta = {
  title: "Web/Invoices/InvoiceLifecycleActions",
  component: InvoiceLifecycleActions,
  tags: ["autodocs"],
  args: {
    invoice: invoiceDetail({ status: 1 }).invoice,
    isPending: false,
    error: null,
    onSend: () => {},
    onPay: () => {},
    onRemind: () => {},
  },
} satisfies Meta<typeof InvoiceLifecycleActions>;

export default meta;
type Story = StoryObj<typeof InvoiceLifecycleActions>;

export const Sent: Story = {};

export const Draft: Story = {
  args: { invoice: invoiceDetail({ status: 0 }).invoice },
};

export const DraftWithoutReference: Story = {
  args: { invoice: invoiceDetail({ status: 0, number: null }).invoice },
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
