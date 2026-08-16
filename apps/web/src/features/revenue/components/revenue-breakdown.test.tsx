import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { revenueData } from "../lib/fixtures";
import { RevenueBreakdown } from "./revenue-breakdown";

function renderBreakdown(
  overrides: Partial<React.ComponentProps<typeof RevenueBreakdown>> = {},
) {
  const data = revenueData();

  return render(
    <RevenueBreakdown
      basis="invoiced"
      clients={data.clients}
      invoices={data.invoices}
      lastActivePeriod="2026-07"
      onOpenInvoice={() => {}}
      onShowPeriod={() => {}}
      periodLabel="Juillet 2026"
      {...overrides}
    />,
  );
}

it("groups each invoice under its client", () => {
  renderBreakdown();

  expect(screen.getByText("Nordlys")).toBeInTheDocument();
  expect(screen.getByText("Vesterhus")).toBeInTheDocument();
  // The Nordlys invoice bills the Orvella front mission.
  expect(screen.getByText("Orvella front")).toBeInTheDocument();
  expect(screen.getByText("92 %")).toBeInTheDocument();
});

it("opens the clicked invoice", () => {
  const onOpenInvoice = vi.fn();
  renderBreakdown({ onOpenInvoice });

  fireEvent.click(screen.getByRole("button", { name: /Orvella front/ }));
  expect(onOpenInvoice).toHaveBeenCalledWith(41);
});

it("proposes the last active period on an empty one", () => {
  const onShowPeriod = vi.fn();
  renderBreakdown({
    clients: [],
    invoices: [],
    basis: "collected",
    periodLabel: "2025",
    lastActivePeriod: "2026",
    onShowPeriod,
  });

  expect(screen.getByText("Rien d'encaissé sur 2025")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Voir 2026" }));
  expect(onShowPeriod).toHaveBeenCalledWith("2026");
});

it("stays silent about a period to visit when there is none", () => {
  renderBreakdown({
    clients: [],
    invoices: [],
    lastActivePeriod: null,
    periodLabel: "2025",
  });

  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
