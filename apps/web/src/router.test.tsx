import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";
import { seedCurrentUser } from "@/test/current-user";
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
    await screen.findByRole(
      "heading",
      { name: /connexion/i },
      { timeout: 5000 },
    ),
  ).toBeInTheDocument();
});

it("redirects authenticated users away from the login page", async () => {
  window.history.replaceState(null, "", "/login");
  const router = getRouter();
  seedCurrentUser(router.options.context.queryClient);

  render(
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  expect(
    await screen.findByRole("link", { name: /semaine/i }, { timeout: 5000 }),
  ).toBeInTheDocument();
});
