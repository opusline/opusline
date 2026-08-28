import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { declarationsData } from "../lib/fixtures";
import { DeclarationsPage } from "./declarations-page";

it("shows both cards when the account declares vat monthly", () => {
  render(<DeclarationsPage data={declarationsData()} />);

  expect(screen.getByText("URSSAF · juillet")).toBeInTheDocument();
  expect(screen.getByText("TVA · 3310-CA3 juillet")).toBeInTheDocument();
});

it("shows no vat card outside réel normal", () => {
  render(<DeclarationsPage data={declarationsData({ vat: null })} />);

  expect(screen.getByText("URSSAF · juillet")).toBeInTheDocument();
  expect(screen.queryByText(/CA3/)).not.toBeInTheDocument();
});
