import { RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { getRouter } from "./router";

it("renders the home page at /", async () => {
  render(<RouterProvider router={getRouter()} />);

  expect(
    await screen.findByRole("heading", { name: /welcome to tanstack start/i }),
  ).toBeInTheDocument();
});
