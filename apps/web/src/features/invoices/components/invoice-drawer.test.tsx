import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";

import { invoiceDetail } from "../lib/fixtures";
import { InvoiceDrawer } from "./invoice-drawer";

const detail = invoiceDetail({
  number: "F-2026-040",
  status: 2,
  issuedOn: "2026-06-30",
  dueOn: "2026-08-29",
  paidOn: "2026-07-24",
  amountHt: { amount: 51_000, currency: "EUR" },
  amountVat: { amount: 10_200, currency: "EUR" },
  amountTtc: { amount: 61_200, currency: "EUR" },
});

/** The value beside a labelled fact — dates repeat across the panel. */
function fact(label: string): string {
  return screen.getByText(label).nextElementSibling?.textContent ?? "";
}

it("dates the facts numerically", () => {
  render(<InvoiceDrawer detail={detail} open onOpenChange={() => {}} />);

  expect(fact("Émise le")).toBe("30/06/2026");
  expect(fact("Échéance")).toBe("29/08/2026");
  expect(fact("Encaissée le")).toBe("24/07/2026");
});

it("shows amounts to the cent, unlike the list", () => {
  render(<InvoiceDrawer detail={detail} open onOpenChange={() => {}} />);

  expect(fact("Montant HT")).toBe("510,00 €");
  expect(fact("Total TTC")).toBe("612,00 €");
});

it("labels the TVA line with the rate the invoice was issued at", () => {
  render(<InvoiceDrawer detail={detail} open onOpenChange={() => {}} />);

  expect(fact("TVA 20 %")).toBe("102,00 €");
});

it("dates the period across its whole span, not just its first day", () => {
  render(
    <InvoiceDrawer
      detail={invoiceDetail({
        periodStart: "2026-06-01",
        periodEnd: "2026-06-30",
      })}
      open
      onOpenChange={() => {}}
    />,
  );

  expect(fact("Période")).toBe("01/06/2026 – 30/06/2026");
});

it("labels a fractional TVA rate the way the rest of the UI reads numbers", () => {
  render(
    <InvoiceDrawer
      detail={invoiceDetail({ vatRateBp: 550 })}
      open
      onOpenChange={() => {}}
    />,
  );

  expect(screen.getByText("TVA 5,5 %")).toBeInTheDocument();
});

it("omits the payment date until there is one", () => {
  render(
    <InvoiceDrawer
      detail={invoiceDetail({ status: 1, paidOn: null })}
      open
      onOpenChange={() => {}}
    />,
  );

  expect(screen.queryByText("Encaissée le")).not.toBeInTheDocument();
});

it("puts the most recent history entry first", () => {
  render(<InvoiceDrawer detail={detail} open onOpenChange={() => {}} />);

  const entries = screen.getAllByRole("listitem");

  expect(within(entries[0]).getByText("Encaissement")).toBeInTheDocument();
  expect(within(entries[2]).getByText("Facture créée")).toBeInTheDocument();
});

it("reports a failed fetch instead of waiting on a fiche that will not come", () => {
  render(
    <InvoiceDrawer
      detail={undefined}
      error="Impossible d'ouvrir la facture."
      open
      onOpenChange={() => {}}
    />,
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Impossible d'ouvrir la facture.",
  );
  expect(screen.queryByText("Chargement…")).not.toBeInTheDocument();
});
