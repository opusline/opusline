import type { Meta, StoryObj } from "@storybook/react";

import { CreateDocumentMenu } from "./create-document-menu";

const meta = {
  title: "Web/CreateDocumentMenu",
  component: CreateDocumentMenu,
  tags: ["autodocs"],
  args: {
    document: "invoice",
    mode: 0,
    onCreate: () => {},
    onAddElsewhere: () => {},
  },
} satisfies Meta<typeof CreateDocumentMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Invoices are written in Opusline: the button creates one. */
export const WritesInOpusline: Story = {};

/** Invoices are written in another tool: the button records one. */
export const WritesElsewhere: Story = { args: { mode: 1 } };

/** The same two ways for a quote. */
export const Quote: Story = { args: { document: "quote" } };

/** Quotes written elsewhere: the button records one. */
export const QuoteElsewhere: Story = { args: { document: "quote", mode: 1 } };
