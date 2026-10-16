import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { quoteItem } from "../lib/quote-fixtures";
import { QuotesTable } from "./quotes-table";

function chip(scope: string): HTMLElement {
  const found = screen
    .getAllByTestId("quote-filter")
    .find((element) => element.dataset.filter === scope);

  if (found === undefined) {
    throw new Error(`No chip for ${scope}`);
  }

  return found;
}

const QUOTES = [
  quoteItem(),
  quoteItem({ id: 2, number: "D-2026-002", title: "Maintenance", status: 2 }),
  quoteItem({ id: 3, number: "D-2026-001", title: "Audit", isExpired: true }),
  quoteItem({ id: 4, number: null, title: "Application mobile", status: 0 }),
];

it("counts every state and narrows the rows to the chosen one", () => {
  render(<QuotesTable quotes={QUOTES} />);

  expect(screen.getAllByTestId("quote-row")).toHaveLength(4);
  expect(chip("open")).toHaveAttribute("data-count", "1");
  expect(chip("expired")).toHaveAttribute("data-count", "1");

  fireEvent.click(chip("expired"));

  const rows = screen.getAllByTestId("quote-row");
  expect(rows).toHaveLength(1);
  expect(rows[0]).toHaveAttribute("data-status", "expired");
  expect(rows[0]).toHaveAttribute("data-reference", "D-2026-001");
});

it("searches by number, title or client", () => {
  render(<QuotesTable quotes={QUOTES} />);

  fireEvent.change(screen.getByTestId("quote-search"), {
    target: { value: "mobile" },
  });

  expect(screen.getAllByTestId("quote-row")).toHaveLength(1);
  expect(screen.getAllByTestId("quote-row")[0]).toHaveAttribute(
    "data-status",
    "draft",
  );

  fireEvent.change(screen.getByTestId("quote-search"), {
    target: { value: "nothing like it" },
  });

  expect(screen.getByTestId("quotes-empty")).toBeInTheDocument();
});

it("opens a quote from its row", () => {
  const onOpen = vi.fn();
  render(<QuotesTable onOpen={onOpen} quotes={[quoteItem()]} />);

  fireEvent.click(screen.getByTestId("quote-open"));

  expect(onOpen).toHaveBeenCalledWith(1);
});
