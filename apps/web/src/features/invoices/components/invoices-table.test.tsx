import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";

import { invoiceItem, secondClient } from "../lib/fixtures";
import { InvoicesTable } from "./invoices-table";

const invoices = [
  invoiceItem({ id: 1, number: "2026-014", status: 1 }),
  invoiceItem({ id: 2, number: "2026-012", status: 1, isLate: true }),
  invoiceItem({ id: 3, number: null, status: 0 }),
  invoiceItem(
    { id: 4, number: "2026-009", status: 2 },
    { client: secondClient, mission: null },
  ),
];

it("groups rows under the client they are filed against", () => {
  render(<InvoicesTable invoices={invoices} />);

  expect(screen.getByText("HartPrint")).toBeInTheDocument();
  expect(screen.getByText("OGF")).toBeInTheDocument();
});

it("totals each client group on the gross amount", () => {
  render(
    <InvoicesTable
      invoices={[
        invoiceItem({ id: 1, amountTtc: { amount: 100_000, currency: "EUR" } }),
        invoiceItem({ id: 2, amountTtc: { amount: 50_050, currency: "EUR" } }),
      ]}
    />,
  );

  expect(screen.getByText("1 500,50 €")).toBeInTheDocument();
});

it("counts an overdue invoice under both Envoyées and En retard", () => {
  render(<InvoicesTable invoices={invoices} />);

  // Lateness is derived from the due date, not a fourth status.
  expect(
    screen.getByRole("button", { name: "Envoyées (2)" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "En retard (1)" }),
  ).toBeInTheDocument();
});

it("narrows the rows to the chosen filter", () => {
  render(<InvoicesTable invoices={invoices} />);

  fireEvent.click(screen.getByRole("button", { name: "Brouillons (1)" }));

  expect(screen.queryByText("2026-014")).not.toBeInTheDocument();
  expect(screen.getByText("—")).toBeInTheDocument();
});

it("explains an empty filter differently from an empty account", () => {
  render(<InvoicesTable invoices={invoices} />);

  fireEvent.click(screen.getByRole("button", { name: "Payées (1)" }));
  const paid = screen.getByText("OGF");
  expect(
    within(paid.closest("section") as HTMLElement).getByText("2026-009"),
  ).toBeInTheDocument();

  render(<InvoicesTable invoices={[]} />);
  expect(
    screen.getByText(/Ajoutez-en une pour suivre ce qui est facturé/),
  ).toBeInTheDocument();
});
