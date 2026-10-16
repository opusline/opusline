import type { Meta, StoryObj } from "@storybook/react";

import { CreateInvoiceMenu } from "./create-invoice-menu";

const meta = {
  title: "Web/CreateInvoiceMenu",
  component: CreateInvoiceMenu,
  tags: ["autodocs"],
  args: { mode: 0, onCreate: () => {}, onAddElsewhere: () => {} },
} satisfies Meta<typeof CreateInvoiceMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Invoices are written in Opusline: the button creates one. */
export const WritesInOpusline: Story = {};

/** Invoices are written in another tool: the button records one. */
export const WritesElsewhere: Story = { args: { mode: 1 } };
