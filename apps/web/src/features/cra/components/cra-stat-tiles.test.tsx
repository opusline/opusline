import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { craDetail } from "../lib/fixtures";
import { CraStatTiles } from "./cra-stat-tiles";

it("leaves the two warning tiles empty when there is nothing to look into", () => {
  render(<CraStatTiles cra={craDetail().cra} offDaysWorked={0} />);

  expect(screen.getAllByText("aucun")).toHaveLength(2);
});

it("counts the days worked outside the working week", () => {
  render(<CraStatTiles cra={craDetail().cra} offDaysWorked={2} />);

  expect(screen.getByText("2 jours")).toBeInTheDocument();
});

it("signs the drift so a shortfall does not read like a surplus", () => {
  render(
    <CraStatTiles
      cra={craDetail({ differenceDays: -0.5 }).cra}
      offDaysWorked={0}
    />,
  );

  expect(screen.getByText("−0,5 j")).toBeInTheDocument();
});

it("says the month has no price rather than showing a zero", () => {
  render(
    <CraStatTiles
      cra={craDetail({ estimatedAmount: null }).cra}
      offDaysWorked={0}
    />,
  );

  expect(screen.getByText("—")).toBeInTheDocument();
});
