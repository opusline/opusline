import type { Meta, StoryObj } from "@storybook/react";

import { INVOICE_DOCUMENT, invoiceDetail } from "../lib/fixtures";
import { InvoiceDocumentPanel } from "./invoice-document-panel";

const meta = {
  title: "Web/Invoices/InvoiceDocumentPanel",
  component: InvoiceDocumentPanel,
  tags: ["autodocs"],
  args: {
    invoice: invoiceDetail({ status: 1 }).invoice,
    document: null,
    isPending: false,
    error: null,
    onUpload: () => {},
    onRemove: () => {},
  },
} satisfies Meta<typeof InvoiceDocumentPanel>;

export default meta;
type Story = StoryObj<typeof InvoiceDocumentPanel>;

/** Nothing filed yet: Opusline never produced the document, so it asks for it. */
export const Empty: Story = {};

export const Filed: Story = {
  args: { document: INVOICE_DOCUMENT },
};

export const Refused: Story = {
  args: { error: "Le document n'a pas pu être classé." },
};

/** A draft was never issued, so there is no document to file against it. */
export const Draft: Story = {
  args: { invoice: invoiceDetail({ status: 0 }).invoice },
};
