import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { invoiceItem } from "../lib/fixtures";
import { InvoiceListPanel } from "./invoice-list-panel";

const EMPTY = { emptyHint: "Les factures apparaîtront ici." };

function renderPanel(
  props: Partial<React.ComponentProps<typeof InvoiceListPanel>> = {},
) {
  return render(
    <InvoiceListPanel
      accountToday="2026-08-14"
      invoices={[invoiceItem()]}
      onOpen={vi.fn()}
      {...EMPTY}
      {...props}
    />,
  );
}

it("names the mission on a list that spans several", () => {
  renderPanel({ withMission: true });

  expect(screen.getByText(/Refonte catalogue/)).toBeInTheDocument();
});

it("leaves the mission out when every row is on the same one", () => {
  renderPanel();

  expect(screen.queryByText(/Refonte catalogue/)).not.toBeInTheDocument();
});

it("falls back to a label when a draft carries no reference yet", () => {
  renderPanel({ invoices: [invoiceItem({ number: null, status: 0 })] });

  expect(screen.getByText("Sans référence")).toBeInTheDocument();
});

it("hands the picked invoice's id to the drawer", () => {
  const onOpen = vi.fn();

  renderPanel({ invoices: [invoiceItem({ id: 42 })], onOpen });
  fireEvent.click(screen.getByRole("button"));

  expect(onOpen).toHaveBeenCalledWith(42);
});

it("reports a failed fetch rather than claiming there is nothing to show", () => {
  renderPanel({ invoices: [], isError: true });

  expect(screen.queryByText("Aucune facture")).not.toBeInTheDocument();
  expect(
    screen.getByText(
      "Impossible de charger les factures. Réessayez dans un instant.",
    ),
  ).toBeInTheDocument();
});

it("keeps the rows it already has when a refetch fails", () => {
  renderPanel({
    invoices: [invoiceItem({ number: "2026-014" })],
    isError: true,
  });

  expect(screen.getByText("2026-014")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Impossible de charger les factures. Réessayez dans un instant.",
  );
});

it("shows the empty card once the list has landed and holds nothing", () => {
  renderPanel({ invoices: [] });

  expect(screen.getByText("Aucune facture")).toBeInTheDocument();
  expect(screen.getByText(EMPTY.emptyHint)).toBeInTheDocument();
});
