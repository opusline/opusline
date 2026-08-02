import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { getRouter } from "./router";

it("redirects the root to the login page when unauthenticated", async () => {
  const router = getRouter();

  render(
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  expect(
    await screen.findByRole("heading", { name: /connexion/i }),
  ).toBeInTheDocument();
});
