import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { settledSettlement, shortSettlement } from "../lib/fixtures";
import { SettlementBlock } from "./settlement-block";

it("reads a shortfall as a negative gap", () => {
  render(
    <SettlementBlock expectedLabel="Attendu" settlement={shortSettlement()} />,
  );

  expect(screen.getByText("Écart").nextElementSibling).toHaveTextContent(
    /^−478\s€$/,
  );
  expect(screen.getByText("Écart").nextElementSibling).toHaveClass(
    "text-destructive",
  );
});

it("leaves the provision and the gap blank once the period is settled", () => {
  render(
    <SettlementBlock
      expectedLabel="Attendu"
      settlement={settledSettlement()}
    />,
  );

  expect(
    screen.getByText("Provisionné sur le compte pro").nextElementSibling,
  ).toHaveTextContent("—");
  expect(screen.getByText("Écart").nextElementSibling).toHaveTextContent("—");
});
