import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";
import { quoteDetail, quotePaperFixture } from "../lib/quote-fixtures";
import { QuoteDocumentPage } from "./quote-document-page";

function renderPage(detail = quoteDetail()) {
  const onAccept = vi.fn();
  const onRefuse = vi.fn();
  const onReopen = vi.fn();
  const onDelete = vi.fn();

  render(
    <StoryRouter>
      <QuoteDocumentPage
        detail={detail}
        error={null}
        isPending={false}
        language={0}
        onAccept={onAccept}
        onDelete={onDelete}
        onLanguageChange={() => {}}
        onRefuse={onRefuse}
        onReopen={onReopen}
        paper={quotePaperFixture}
        pdfHref={() => "#"}
      />
    </StoryRouter>,
  );

  return { onAccept, onRefuse, onReopen, onDelete };
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
