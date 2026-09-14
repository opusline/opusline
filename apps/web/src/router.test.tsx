import { client } from "@opusline/api-client/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { setupApiClient } from "@/lib/api";
import { seedCurrentUser } from "@/test/current-user";
import { getRouter } from "./router";

// The status these routes branch on is stamped by the client's error
// interceptor, so the suite wires the client the app wires at boot — with the
// absolute base Node's Request needs, as lib/api.test.ts does.
setupApiClient();
client.setConfig({ baseUrl: "http://localhost/api" });

beforeEach(() => {
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** How the API answers `GET /user` — the only call these routes make. */
function stubCurrentUser(status: number) {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response(JSON.stringify({ message: "Nope." }), {
          status,
          headers: { "Content-Type": "application/json" },
        }),
    ),
  );
}

it("redirects the root to the login page when unauthenticated", async () => {
  stubCurrentUser(401);
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

it("shows the real failure instead of logging the user out on a 500", async () => {
  stubCurrentUser(500);
  const router = getRouter();

  render(
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  expect(
    await screen.findByText(
      /une erreur est survenue en affichant cette page/i,
      { exact: false },
      { timeout: 5000 },
    ),
  ).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: /connexion/i })).toBeNull();
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
