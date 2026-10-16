import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";
import { documentDetail } from "../lib/invoice-document-fixture";
import { invoicePaperFixture } from "../lib/invoice-paper-fixture";
import { InvoiceDocumentPage } from "./invoice-document-page";

const meta = {
  title: "Web/InvoiceDocumentPage",
  component: InvoiceDocumentPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
  args: {
    detail: documentDetail(),
    paper: invoicePaperFixture,
    language: 0,
    onLanguageChange: () => {},
    pdfHref: () => "#",
    accountToday: "2026-10-14",
    isPending: false,
    error: null,
    onPay: () => {},
    onRemind: () => {},
    onDelete: () => {},
  },
} satisfies Meta<typeof InvoiceDocumentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Issued and waiting for its payment. */
export const Issued: Story = {};

/** Not validated yet: no number, and the draft can be resumed. */
export const Draft: Story = {
  args: {
    detail: {
      ...documentDetail({ status: 0, number: null }),
      history: [{ id: 1, kind: 0, occurredOn: "2026-10-14", note: null }],
    },
    paper: { ...invoicePaperFixture, title: "Facture", stamp: "Brouillon" },
  },
};

/** Paid: nothing left to do but read it. */
export const Paid: Story = {
  args: { detail: documentDetail({ status: 2, paidOn: "2026-08-02" }) },
};

/** The sheet still loading in the other language. */
export const LoadingSheet: Story = { args: { paper: null, language: 1 } };

/** Built from a quote: the page links back to it. */
export const FromQuote: Story = {
  args: {
    detail: {
      ...documentDetail(),
      quote: { quoteId: 7, number: "D-2026-003", billing: 0 },
    },
  },
};
