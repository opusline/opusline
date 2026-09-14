import type { Meta, StoryObj } from "@storybook/react";

import { InvoiceVatField } from "./invoice-vat-field";

const meta = {
  title: "Web/Invoices/InvoiceVatField",
  component: InvoiceVatField,
  tags: ["autodocs"],
  args: {
    draft: "20",
    isInvalid: false,
    vatLiable: true,
    onDraftChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InvoiceVatField>;

export default meta;
type Story = StoryObj<typeof InvoiceVatField>;

export const Default: Story = {};

/** A client charged no TVA — zero is a rate, not an empty field. */
export const ZeroRate: Story = {
  args: { draft: "0" },
};

/** The hint turns into the error, on the same line, so nothing shifts. */
export const Invalid: Story = {
  args: { draft: "120", isInvalid: true },
};

/**
 * Franchise en base: the field is not offered at all, because every rate it
 * could hold would put an unlawful line on the invoice.
 */
export const NotVatLiable: Story = {
  args: { vatLiable: false },
};
