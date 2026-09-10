import type { Meta, StoryObj } from "@storybook/react";

import { invoiceDetail } from "../lib/fixtures";
import { InvoiceDateCorrections } from "./invoice-date-corrections";

const meta = {
  title: "Web/Invoices/InvoiceDateCorrections",
  component: InvoiceDateCorrections,
  tags: ["autodocs"],
  args: {
    invoice: invoiceDetail({ status: 1 }).invoice,
    sentOn: "2026-07-01",
    accountToday: "2026-08-14",
    isPending: false,
    error: null,
    onSubmit: () => {},
  },
} satisfies Meta<typeof InvoiceDateCorrections>;

export default meta;
type Story = StoryObj<typeof InvoiceDateCorrections>;

/** Out but unpaid: only the day it left can be wrong. */
export const Sent: Story = {};

export const Paid: Story = {
  args: {
    invoice: invoiceDetail({ status: 2, paidOn: "2026-07-24" }).invoice,
  },
};

export const Refused: Story = {
  args: {
    error: "La date d'encaissement ne peut pas précéder la date d'envoi.",
  },
};

/** A draft has no date to correct, so the section renders nothing. */
export const Draft: Story = {
  args: { invoice: invoiceDetail({ status: 0 }).invoice },
};
