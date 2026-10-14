import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { invoicePaperFixture } from "../lib/invoice-paper-fixture";
import { InvoicePaper } from "./invoice-paper";

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
