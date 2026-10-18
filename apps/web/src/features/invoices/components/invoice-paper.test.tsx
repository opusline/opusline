import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { invoicePaperFixture } from "../lib/invoice-paper-fixture";
import { fitScale, InvoicePaper } from "./invoice-paper";

it("prints the sheet the API resolved, word for word", () => {
  render(<InvoicePaper paper={invoicePaperFixture} />);

  expect(screen.getByTestId("invoice-paper-title")).toHaveTextContent(
    "Facture n° 2026-001",
  );
  expect(screen.getByTestId("invoice-paper-legal")).toHaveTextContent(
    invoicePaperFixture.legal,
  );
  expect(screen.getByTestId("invoice-paper-totals")).toHaveTextContent(
    "Total TTC",
  );
  expect(screen.queryByTestId("invoice-paper-stamp")).toBeNull();
});

it("stamps a draft", () => {
  render(
    <InvoicePaper paper={{ ...invoicePaperFixture, stamp: "Brouillon" }} />,
  );

  expect(screen.getByTestId("invoice-paper-stamp")).toHaveTextContent(
    "Brouillon",
  );
});

it("says where the lines will appear while there are none", () => {
  render(<InvoicePaper paper={{ ...invoicePaperFixture, lines: [] }} />);

  expect(
    screen.getByText("Les lignes ajoutées apparaissent ici."),
  ).toBeInTheDocument();
});

it("leaves the logo out until one is stored", () => {
  const { container } = render(
    <InvoicePaper logoSrc="/user/logo" paper={invoicePaperFixture} />,
  );

  expect(container.querySelector("img")).toBeNull();
});

it("ends a quote with its signature box, and an invoice without", () => {
  const { rerender } = render(
    <InvoicePaper
      paper={{
        ...invoicePaperFixture,
        signature: { title: "Bon pour accord", caption: "Date et signature" },
      }}
    />,
  );

  expect(screen.getByTestId("invoice-paper-signature")).toHaveTextContent(
    "Bon pour accord",
  );

  rerender(<InvoicePaper paper={invoicePaperFixture} />);

  expect(screen.queryByTestId("invoice-paper-signature")).toBeNull();
});

it("shrinks the sheet to a column narrower than its print width, never beyond it", () => {
  expect(fitScale(450)).toBe(0.75);
  expect(fitScale(600)).toBe(1);
  expect(fitScale(900)).toBe(1);
});

it("keeps the sheet whole before its column has been measured", () => {
  expect(fitScale(0)).toBe(1);
});
