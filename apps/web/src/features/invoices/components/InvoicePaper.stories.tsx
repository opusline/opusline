import type { Meta, StoryObj } from "@storybook/react";

import { invoicePaperFixture } from "../lib/invoice-paper-fixture";
import { InvoicePaper } from "./invoice-paper";

const LOGO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><rect width="120" height="40" rx="6" fill="#1D1A17"/><text x="60" y="26" font-family="sans-serif" font-size="16" fill="#fff" text-anchor="middle">TM</text></svg>',
)}`;

const meta = {
  title: "Web/InvoicePaper",
  component: InvoicePaper,
  tags: ["autodocs"],
  args: { paper: invoicePaperFixture },
  decorators: [
    (Story) => (
      <div className="max-w-160 bg-muted p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InvoicePaper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Issued: Story = {};

export const WithLogo: Story = {
  args: { paper: { ...invoicePaperFixture, hasLogo: true }, logoSrc: LOGO },
};

/** A draft carries no number yet, and says so across the sheet. */
export const Draft: Story = {
  args: {
    paper: {
      ...invoicePaperFixture,
      title: "Facture",
      stamp: "Brouillon",
      payment: invoicePaperFixture.payment.map((row) =>
        row.label === "Référence du virement"
          ? { ...row, value: "attribuée à la validation" }
          : row,
      ),
      footer: "Facture",
    },
  },
};

/** A fresh draft, before any line is added. */
export const Empty: Story = {
  args: {
    paper: {
      ...invoicePaperFixture,
      title: "Facture",
      stamp: "Brouillon",
      documentTitle: null,
      description: null,
      lines: [],
      vatRows: [],
      paymentTitle: null,
      payment: [],
    },
  },
};
