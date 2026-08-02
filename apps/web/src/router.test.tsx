import { currentUserQueryKey } from "@opusline/api-client/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";

import { getRouter } from "./router";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
});

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

it("redirects authenticated users away from the login page", async () => {
  window.history.replaceState(null, "", "/login");
  const router = getRouter();
  router.options.context.queryClient.setQueryData(currentUserQueryKey(), {
    id: 1,
    name: "Theo",
    email: "theo@example.com",
  });

  render(
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  expect(
    await screen.findByRole("heading", { name: /bonjour, theo/i }),
  ).toBeInTheDocument();
});
