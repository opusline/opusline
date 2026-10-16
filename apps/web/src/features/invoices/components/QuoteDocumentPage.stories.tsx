import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";
import { INVOICE_DOCUMENT } from "../lib/fixtures";
import {
  DEPOSIT_BILLED,
  externalQuoteDetail,
  quoteDetail,
  quotePaperFixture,
} from "../lib/quote-fixtures";
import { QuoteDocumentPage } from "./quote-document-page";

const meta = {
  title: "Web/QuoteDocumentPage",
  component: QuoteDocumentPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
  args: {
    detail: quoteDetail(),
    paper: quotePaperFixture,
    language: 0,
    onLanguageChange: () => {},
    pdfHref: () => "#",
    isPending: false,
    error: null,
    onAccept: () => {},
    onRefuse: () => {},
    onReopen: () => {},
    onDelete: () => {},
    onInvoice: () => {},
    onOpenInvoice: () => {},
  },
} satisfies Meta<typeof QuoteDocumentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sent and waiting for the client's answer. */
export const Sent: Story = {};

/** Not validated yet: no number, and the draft can be resumed. */
export const Draft: Story = {
  args: {
    detail: quoteDetail({ status: 0, number: null }),
    paper: { ...quotePaperFixture, title: "Devis", stamp: "Brouillon" },
  },
};

/** The client said yes: the deposit or the whole quote can be invoiced. */
export const Accepted: Story = {
  args: {
    detail: quoteDetail(
      { status: 2, acceptedOn: "2026-10-12" },
      {
        invoices: [],
        invoicedTtc: { amount: 0, currency: "EUR" },
        canInvoiceDeposit: true,
        canInvoiceBalance: false,
        canInvoiceFull: true,
      },
    ),
  },
};

/** The deposit went out: the balance is what remains. */
export const DepositInvoiced: Story = {
  args: {
    detail: quoteDetail(
      { status: 2, acceptedOn: "2026-10-12" },
      DEPOSIT_BILLED,
    ),
  },
};

/** Past its validity: only reopening remains. */
export const Expired: Story = {
  args: { detail: quoteDetail({ isExpired: true }) },
};

/** Refused, with the reopen option. */
export const Refused: Story = {
  args: { detail: quoteDetail({ status: 3, refusedOn: "2026-10-12" }) },
};

const FILING = {
  isPending: false,
  isUploading: false,
  uploadPercent: null,
  error: null,
  onUpload: () => {},
  onRemove: () => {},
};

/** Issued in another tool: no sheet, the PDF is asked for instead. */
export const External: Story = {
  args: { detail: externalQuoteDetail(), paper: null, filing: FILING },
};

/** Issued elsewhere, accepted, its PDF filed: the whole quote can be invoiced. */
export const ExternalFiled: Story = {
  args: {
    detail: {
      ...externalQuoteDetail(
        { status: 2, acceptedOn: "2026-10-12" },
        {
          invoices: [],
          invoicedTtc: { amount: 0, currency: "EUR" },
          canInvoiceDeposit: false,
          canInvoiceBalance: false,
          canInvoiceFull: true,
        },
      ),
      document: { ...INVOICE_DOCUMENT, fileName: "DEV-118.pdf", category: 1 },
    },
    paper: null,
    filing: FILING,
  },
};
