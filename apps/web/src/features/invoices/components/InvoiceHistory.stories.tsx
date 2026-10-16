import type { Meta, StoryObj } from "@storybook/react";

import { invoiceDetail } from "../lib/fixtures";
import { InvoiceHistory } from "./invoice-history";

const meta = {
  title: "Web/InvoiceHistory",
  component: InvoiceHistory,
  tags: ["autodocs"],
  args: { history: invoiceDetail().history },
} satisfies Meta<typeof InvoiceHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Created, sent, then paid — newest first. */
export const Default: Story = {};
