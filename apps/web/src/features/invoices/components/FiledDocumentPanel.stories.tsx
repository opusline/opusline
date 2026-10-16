import type { Meta, StoryObj } from "@storybook/react";

import { INVOICE_DOCUMENT } from "../lib/fixtures";
import { FiledDocumentPanel } from "./filed-document-panel";

const meta = {
  title: "Web/Invoices/FiledDocumentPanel",
  component: FiledDocumentPanel,
  tags: ["autodocs"],
  args: {
    subject: "invoice",
    downloadHref: "#",
    document: null,
    isPending: false,
    error: null,
    onUpload: () => {},
    onRemove: () => {},
  },
} satisfies Meta<typeof FiledDocumentPanel>;

export default meta;
type Story = StoryObj<typeof FiledDocumentPanel>;

/** Nothing filed yet: Opusline never produced the document, so it asks for it. */
export const Empty: Story = {};

export const Filed: Story = {
  args: { document: INVOICE_DOCUMENT },
};

export const Refused: Story = {
  args: { error: "Le document n'a pas pu être classé." },
};

/** The same panel on a quote recorded from another tool. */
export const Quote: Story = {
  args: { subject: "quote" },
};
