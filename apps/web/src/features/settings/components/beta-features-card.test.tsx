import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { BetaFeaturesCard } from "./beta-features-card";

it("opts into a beta feature by its key", () => {
  const onChange = vi.fn();

  render(
    <BetaFeaturesCard
      error={null}
      features={[{ feature: 0, key: "invoicing", active: false }]}
      isSaving={false}
      onChange={onChange}
    />,
  );

  fireEvent.click(screen.getByTestId("beta-feature-switch"));

  expect(onChange).toHaveBeenCalledWith("invoicing", true);
});

it("says when the instance offers nothing in beta", () => {
  render(
    <BetaFeaturesCard
      error={null}
      features={[]}
      isSaving={false}
      onChange={vi.fn()}
    />,
  );

  expect(screen.getByTestId("beta-empty")).toBeInTheDocument();
  expect(screen.queryByTestId("beta-feature-switch")).toBeNull();
});
