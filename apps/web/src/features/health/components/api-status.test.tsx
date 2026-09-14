import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { m } from "@/paraglide/messages.js";

import { ApiStatus } from "./api-status";

it("shows the api status returned by the server", () => {
  render(<ApiStatus status="ok" />);

  expect(
    screen.getByText(m.health_api_status({ status: "ok" })),
  ).toBeInTheDocument();
});

it("says the api is unreachable when the ping never came back", () => {
  render(<ApiStatus status={null} />);

  expect(screen.getByText(m.health_api_unreachable())).toBeInTheDocument();
});
