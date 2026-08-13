import type { Meta, StoryObj } from "@storybook/react";

import { invoiceTodo } from "../lib/fixtures";
import { CreateInvoiceDialog } from "./create-invoice-dialog";

const meta = {
  title: "Web/Invoices/CreateInvoiceDialog",
  component: CreateInvoiceDialog,
  tags: ["autodocs"],
  args: {
    todo: invoiceTodo({ kind: 1 }),
    clientId: 2,
    suggestedNumber: "2026-021",
    isSaving: false,
    error: null,
    onOpenChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof CreateInvoiceDialog>;

export default meta;
type Story = StoryObj<typeof CreateInvoiceDialog>;

export const Default: Story = {};

export const Saving: Story = {
  args: { isSaving: true },
};

export const Rejected: Story = {
  args: {
    error:
      "La facture n'a pas pu être créée. Vérifiez la référence et le montant.",
  },
};
