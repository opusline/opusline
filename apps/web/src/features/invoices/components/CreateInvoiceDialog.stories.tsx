import type { Meta, StoryObj } from "@storybook/react";

import { forfaitPrefill, unbilledPrefill } from "../lib/fixtures";
import { CreateInvoiceDialog } from "./create-invoice-dialog";

const meta = {
  title: "Web/Invoices/CreateInvoiceDialog",
  component: CreateInvoiceDialog,
  tags: ["autodocs"],
  args: {
    prefill: unbilledPrefill(),
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
  args: { prefill: unbilledPrefill({ vatRateBp: 0 }) },
};

/** Under the franchise en base there is no rate to offer, so the field is not there. */
export const FranchiseEnBase: Story = {
  args: { vatLiable: false, prefill: unbilledPrefill({ vatRateBp: 0 }) },
};

/**
 * A fixed price: no tracked time to value, no period, and the amount left empty —
 * an instalment is a decision, not a figure the mission can produce.
 */
export const FixedPrice: Story = {
  args: { prefill: forfaitPrefill() },
};

/** A fixed price already invoiced past its total, after an avenant. */
export const FixedPriceOverInvoiced: Story = {
  args: { prefill: forfaitPrefill({ remainingCents: -160_000 }) },
};
