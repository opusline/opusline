import type { Meta, StoryObj } from "@storybook/react";

import { unbilledTodoRow } from "../lib/fixtures";
import { CreateInvoiceDialog } from "./create-invoice-dialog";

const meta = {
  title: "Web/Invoices/CreateInvoiceDialog",
  component: CreateInvoiceDialog,
  tags: ["autodocs"],
  args: {
    todo: unbilledTodoRow(),
    suggestedNumber: "2026-021",
    vatLiable: true,
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

/** A client outside the scope of TVA: the rate arrives at zero, still editable. */
export const ClientWithoutVat: Story = {
  args: { todo: unbilledTodoRow({ vatRateBp: 0 }) },
};

/** Under the franchise en base there is no rate to offer, so the field is not there. */
export const FranchiseEnBase: Story = {
  args: { vatLiable: false, todo: unbilledTodoRow({ vatRateBp: 0 }) },
};
