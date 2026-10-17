import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { m } from "@/paraglide/messages.js";
import { StoryRouter } from "@/test/story-router";
import { INVOICE_DOCUMENT } from "../lib/fixtures";
import {
  DEPOSIT_BILLED,
  externalQuoteDetail,
  quoteDetail,
  quotePaperFixture,
} from "../lib/quote-fixtures";
import { QuoteDocumentPage } from "./quote-document-page";

function renderPage(
  detail = quoteDetail(),
  filing?: Parameters<typeof QuoteDocumentPage>[0]["filing"],
) {
  const onAccept = vi.fn();
  const onRefuse = vi.fn();
  const onReopen = vi.fn();
  const onDelete = vi.fn();
  const onInvoice = vi.fn();
  const onOpenInvoice = vi.fn();

  render(
    <StoryRouter>
      <QuoteDocumentPage
        detail={detail}
        error={null}
        filing={filing}
        isPending={false}
        language={0}
        onAccept={onAccept}
        onDelete={onDelete}
        onInvoice={onInvoice}
        onLanguageChange={() => {}}
        onOpenInvoice={onOpenInvoice}
        onRefuse={onRefuse}
        onReopen={onReopen}
        paper={quotePaperFixture}
        pdfHref={() => "#"}
      />
    </StoryRouter>,
  );

  return { onAccept, onRefuse, onReopen, onDelete, onInvoice, onOpenInvoice };
}

it("offers the client's answer on a sent quote", async () => {
  const { onAccept, onRefuse } = renderPage();

  expect(await screen.findByTestId("document-status")).toHaveAttribute(
    "data-status",
    "sent",
  );
  expect(screen.getByTestId("invoice-paper-signature")).toBeInTheDocument();
  expect(screen.queryByTestId("quote-reopen")).toBeNull();

  fireEvent.click(screen.getByTestId("quote-accept"));
  fireEvent.click(screen.getByTestId("quote-refuse"));

  expect(onAccept).toHaveBeenCalledOnce();
  expect(onRefuse).toHaveBeenCalledOnce();
});

it("only reopens an expired or refused quote", async () => {
  const { onReopen } = renderPage(quoteDetail({ isExpired: true }));

  expect(await screen.findByTestId("document-status")).toHaveAttribute(
    "data-status",
    "expired",
  );
  expect(screen.queryByTestId("quote-accept")).toBeNull();
  expect(screen.getByTestId("quote-tracking-note")).toBeInTheDocument();

  fireEvent.click(screen.getByTestId("quote-reopen"));

  expect(onReopen).toHaveBeenCalledOnce();
});

it("leaves an accepted quote alone", async () => {
  renderPage(quoteDetail({ status: 2, acceptedOn: "2026-10-12" }));

  expect(await screen.findByTestId("quote-tracking")).toHaveTextContent(
    "12/10/2026",
  );
  expect(screen.queryByTestId("quote-accept")).toBeNull();
  expect(screen.queryByTestId("quote-reopen")).toBeNull();
});

it("resumes or deletes a draft", async () => {
  const { onDelete } = renderPage(quoteDetail({ status: 0, number: null }));

  expect(await screen.findByTestId("document-resume-draft")).toHaveAttribute(
    "href",
    "/invoicing/quotes/1/edit",
  );

  fireEvent.click(screen.getByTestId("quote-delete-draft"));

  expect(onDelete).toHaveBeenCalledOnce();
});

it("offers the deposit or the whole quote once accepted, then only the balance", async () => {
  const { onInvoice } = renderPage(
    quoteDetail(
      { status: 2, acceptedOn: "2026-10-12" },
      {
        invoices: [],
        invoicedTtc: { amount: 0, currency: "EUR" },
        canInvoiceDeposit: true,
        canInvoiceBalance: false,
        canInvoiceFull: true,
      },
    ),
  );

  expect(await screen.findByTestId("quote-billing")).toHaveAttribute(
    "data-invoiced-cents",
    "0",
  );
  expect(screen.queryByTestId("quote-invoice-balance")).toBeNull();
  fireEvent.click(screen.getByTestId("quote-invoice-deposit"));
  fireEvent.click(screen.getByTestId("quote-invoice-full"));

  expect(onInvoice).toHaveBeenNthCalledWith(1, 0);
  expect(onInvoice).toHaveBeenNthCalledWith(2, 2);
});

it("lists the invoices built from the quote and opens one", async () => {
  const { onOpenInvoice } = renderPage(
    quoteDetail({ status: 2, acceptedOn: "2026-10-12" }, DEPOSIT_BILLED),
  );

  const linked = await screen.findByTestId("quote-linked-invoice");
  expect(linked).toHaveAttribute("data-billing", "0");
  expect(screen.getByTestId("quote-billing")).toHaveAttribute(
    "data-invoiced-cents",
    "1144800",
  );
  expect(screen.getByTestId("quote-invoice-balance")).toBeInTheDocument();
  expect(screen.queryByTestId("quote-invoice-deposit")).toBeNull();

  fireEvent.click(linked);

  expect(onOpenInvoice).toHaveBeenCalledWith(41);
});

it("badges a linked invoice the way the invoice ledger does", async () => {
  const [deposit] = DEPOSIT_BILLED.invoices;
  renderPage(
    quoteDetail(
      { status: 2, acceptedOn: "2026-10-12" },
      {
        ...DEPOSIT_BILLED,
        invoices: [
          {
            ...deposit,
            amountPaid: { ...deposit.amountTtc, amount: 100_000 },
          },
        ],
      },
    ),
  );

  const linked = await screen.findByTestId("quote-linked-invoice");
  expect(linked).toHaveAttribute("data-status", "partial");
  expect(linked).toHaveTextContent(m.invoice_status_partial());
});

it("does not badge a cancelled linked invoice as paid", async () => {
  const [deposit] = DEPOSIT_BILLED.invoices;
  renderPage(
    quoteDetail(
      { status: 2, acceptedOn: "2026-10-12" },
      { ...DEPOSIT_BILLED, invoices: [{ ...deposit, status: 3 }] },
    ),
  );

  const linked = await screen.findByTestId("quote-linked-invoice");
  expect(linked).toHaveAttribute("data-status", "cancelled");
  expect(linked).toHaveTextContent(m.invoice_status_cancelled());
});

it("asks for the PDF of a quote issued elsewhere instead of printing a sheet", async () => {
  const onUpload = vi.fn();
  renderPage(externalQuoteDetail(), {
    isPending: false,
    isUploading: false,
    uploadPercent: null,
    error: null,
    onUpload,
    onRemove: vi.fn(),
  });

  expect(await screen.findByTestId("document-source")).toBeInTheDocument();
  expect(screen.queryByTestId("invoice-paper-signature")).toBeNull();
  expect(screen.queryByTestId("document-duplicate")).toBeNull();
  expect(screen.queryByTestId("document-download")).toBeNull();
  expect(screen.getByTestId("quote-tracking")).toBeInTheDocument();

  const file = new File(["%PDF-1.4"], "devis.pdf", { type: "application/pdf" });
  fireEvent.change(screen.getByTestId("filed-document-picker"), {
    target: { files: [file] },
  });

  expect(onUpload).toHaveBeenCalledWith(file);
});

it("downloads the filed PDF of a quote issued elsewhere", async () => {
  renderPage(
    {
      ...externalQuoteDetail({ status: 2, acceptedOn: "2026-10-12" }),
      document: { ...INVOICE_DOCUMENT, fileName: "DEV-118.pdf", category: 1 },
    },
    {
      isPending: false,
      isUploading: false,
      uploadPercent: null,
      error: null,
      onUpload: vi.fn(),
      onRemove: vi.fn(),
    },
  );

  expect(await screen.findByTestId("quote-document-download")).toHaveAttribute(
    "href",
    expect.stringContaining("/invoicing/quotes/1/pdf"),
  );
});
