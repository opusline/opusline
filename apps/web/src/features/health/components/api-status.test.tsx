import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { ApiStatus } from "./api-status";

it("shows the api status returned by the server", () => {
  render(<ApiStatus status="ok" />);

  expect(screen.getByText("API status: ok")).toBeInTheDocument();
});
