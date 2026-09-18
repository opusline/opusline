import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { eur } from "@/test/fixtures";

import { declarationsData } from "../lib/fixtures";
import { CaCumulativeCard } from "./ca-cumulative-card";

const cumulative = declarationsData().cumulative;

if (cumulative === null) {
  throw new Error("the sample account has a ceiling to show");
}

it("reads the share of the ceiling and the headroom left", () => {
  render(<CaCumulativeCard cumulative={cumulative} />);

  expect(screen.getByRole("meter", { name: "CA cumulé 2026" })).toHaveAttribute(
    "aria-valuenow",
    "7990",
  );
  expect(screen.getByText(/^80\s% du plafond micro-BNC$/)).toBeInTheDocument();
  expect(screen.getByText(/^16\s800\s€ de marge$/)).toBeInTheDocument();
});

it("says by how much the ceiling is exceeded", () => {
  render(
    <CaCumulativeCard
      cumulative={{
        ...cumulative,
        collectedHt: eur(8_120_000),
        shareBp: 10_450,
        margin: { amount: -350_000, currency: "EUR" },
      }}
    />,
  );

  expect(
    screen.getByText(/^plafond dépassé de 3\s500\s€$/),
  ).toBeInTheDocument();
});
