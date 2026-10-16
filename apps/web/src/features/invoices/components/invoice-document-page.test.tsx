import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";
import { documentDetail } from "../lib/invoice-document-fixture";
import { invoicePaperFixture } from "../lib/invoice-paper-fixture";
import { InvoiceDocumentPage } from "./invoice-document-page";

function renderPage(
  detail = documentDetail(),
  overrides: Partial<ComponentProps<typeof InvoiceDocumentPage>> = {},
) {
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
        {...overrides}
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

it("offers to retry when the sheet failed, instead of waiting for it", async () => {
  const onRetryPaper = vi.fn();
  renderPage(documentDetail(), { paper: null, onRetryPaper });

  expect(
    await screen.findByTestId("document-paper-failed"),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("document-paper-retry"));

  expect(onRetryPaper).toHaveBeenCalledOnce();
});
