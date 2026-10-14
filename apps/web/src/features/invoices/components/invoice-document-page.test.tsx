import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";
import { documentDetail } from "../lib/invoice-document-fixture";
import { invoicePaperFixture } from "../lib/invoice-paper-fixture";
import { InvoiceDocumentPage } from "./invoice-document-page";

function renderPage(detail = documentDetail()) {
  render(
    <StoryRouter>
      <InvoiceDocumentPage
        accountToday="2026-10-14"
        detail={detail}
        error={null}
        isPending={false}
        language={0}
        onDelete={vi.fn()}
        onLanguageChange={vi.fn()}
        onPay={vi.fn()}
        onRemind={vi.fn()}
        paper={invoicePaperFixture}
        pdfHref={(language) => `/api/invoices/1/pdf?language=${language}`}
      />
    </StoryRouter>,
  );
}

it("offers to resume a draft, not to collect it", async () => {
  renderPage(documentDetail({ status: 0, number: null }));

  expect(await screen.findByTestId("document-draft")).toBeInTheDocument();
  expect(screen.queryByTestId("document-collect")).toBeNull();
  expect(screen.getByTestId("document-resume-draft")).toHaveAttribute(
    "href",
    "/invoicing/invoices/1/edit",
  );
});

it("collects an issued invoice", async () => {
  renderPage();

  expect(await screen.findByTestId("document-collect")).toBeInTheDocument();
  expect(screen.queryByTestId("document-draft")).toBeNull();
  expect(screen.getByTestId("document-status")).toHaveAttribute(
    "data-status",
    "sent",
  );
});

it("duplicates into a new invoice", async () => {
  renderPage();

  expect(await screen.findByTestId("document-duplicate")).toHaveAttribute(
    "href",
    "/invoicing/invoices/new?duplicate=1",
  );
});
