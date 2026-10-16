import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";
import {
  DEPOSIT_BILLED,
  quoteDetail,
  quotePaperFixture,
} from "../lib/quote-fixtures";
import { QuoteDocumentPage } from "./quote-document-page";

function renderPage(detail = quoteDetail()) {
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
