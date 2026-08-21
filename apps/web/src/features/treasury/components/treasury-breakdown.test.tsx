import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { treasuryData } from "@/test/fixtures";

import { emptyTreasuryData, noVatTreasuryData } from "../lib/fixtures";
import { TreasuryBreakdown } from "./treasury-breakdown";

it("splits the balance into the three provisions and what is left", () => {
  render(<TreasuryBreakdown data={treasuryData()} />);

  expect(screen.getByText("2 090 €")).toBeInTheDocument();
  expect(screen.getByText("2 717 €")).toBeInTheDocument();
  expect(screen.getByText("1 500 €")).toBeInTheDocument();
  expect(screen.getByText("8 513 €")).toBeInTheDocument();
});

it("cites the effective contribution rate and the period it covers", () => {
  render(<TreasuryBreakdown data={treasuryData()} />);

  expect(
    screen.getByText("26 % · période jusqu'au 31/08/2026"),
  ).toBeInTheDocument();
});

it("dates the tva to its accrual period rather than a filing deadline", () => {
  render(<TreasuryBreakdown data={treasuryData()} />);

  expect(screen.getByText("période jusqu'au 31/08/2026")).toBeInTheDocument();
});

it("leaves out the tva column under the franchise en base", () => {
  render(<TreasuryBreakdown data={noVatTreasuryData()} />);

  expect(screen.queryByText("TVA à provisionner")).not.toBeInTheDocument();
  expect(screen.getByText("Provision URSSAF")).toBeInTheDocument();
});

it("draws nothing at all without a balance to split", () => {
  const { container } = render(
    <TreasuryBreakdown data={emptyTreasuryData()} />,
  );

  expect(container).toBeEmptyDOMElement();
});
