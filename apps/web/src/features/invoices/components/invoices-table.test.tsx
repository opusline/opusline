import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";

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

  expect(screen.getByText("1 501 €")).toBeInTheDocument();
});

it("counts an overdue invoice under both Envoyées and En retard", () => {
  render(<InvoicesTable invoices={invoices} />);

  // Lateness is derived from the due date, not a fourth status.
  expect(
    screen.getByRole("button", { name: "À encaisser (2)" }),
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

it("says how long a client actually takes to pay, from its paid invoices", () => {
  render(
    <InvoicesTable
      invoices={[
        invoiceItem({
          id: 1,
          status: 2,
          issuedOn: "2026-06-01",
          paidOn: "2026-06-21",
        }),
        invoiceItem({
          id: 2,
          status: 2,
          issuedOn: "2026-05-01",
          paidOn: "2026-05-29",
        }),
      ]}
    />,
  );

  // 20 and 28 days → 24 on average.
  expect(screen.getByText("24 j en moyenne pour payer")).toBeInTheDocument();
});

it("leaves the average out until something has been paid", () => {
  render(<InvoicesTable invoices={[invoiceItem({ id: 1, status: 1 })]} />);

  expect(screen.queryByText(/en moyenne pour payer/)).not.toBeInTheDocument();
});

it("tells each row why its status matters", () => {
  render(
    <InvoicesTable
      invoices={[
        invoiceItem({
          id: 1,
          status: 2,
          periodStart: "2026-06-01",
          issuedOn: "2026-06-30",
          paidOn: "2026-07-24",
        }),
      ]}
    />,
  );

  expect(screen.getByText("Juin 2026 · payée en 24 j")).toBeInTheDocument();
});

it("opens the invoice it was asked to open", () => {
  const onOpen = vi.fn();
  render(<InvoicesTable invoices={[invoiceItem({ id: 7 })]} onOpen={onOpen} />);

  fireEvent.click(screen.getByRole("button", { name: /Refonte catalogue/ }));

  expect(onOpen).toHaveBeenCalledWith(7);
});
