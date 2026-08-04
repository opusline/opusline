import { currentUserQueryKey } from "@opusline/api-client/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { getRouter } from "@/router";

function renderAuthedAt(path: string) {
  window.history.replaceState(null, "", path);
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
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("shows the client form", async () => {
  renderAuthedAt("/clients/new");

  expect(
    await screen.findByRole(
      "heading",
      { name: "Nouveau client" },
      { timeout: 5000 },
    ),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("Raison sociale")).toBeInTheDocument();
  expect(screen.getByLabelText("SIRET")).toBeInTheDocument();
  expect(screen.getByText("Délai de paiement")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Créer le client" }),
  ).toBeInTheDocument();
});

it("explains the end-client rule when picking an intermediary", async () => {
  renderAuthedAt("/clients/new");
  await screen.findByRole(
    "heading",
    { name: "Nouveau client" },
    { timeout: 5000 },
  );

  expect(
    screen.queryByText("Facturation via intermédiaire"),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /Intermédiaire/ }));

  expect(
    await screen.findByText("Facturation via intermédiaire"),
  ).toBeInTheDocument();
});

it("creates the client and returns to the list", async () => {
  vi.spyOn(Math, "random").mockReturnValue(0.99);
  const requests: Array<{ method: string; path: string; body: unknown }> = [];

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const url = new URL(request.url, "http://localhost");
      const body =
        request.method === "POST" ? await request.clone().json() : null;
      requests.push({ method: request.method, path: url.pathname, body });

      if (request.method === "POST" && url.pathname.endsWith("/clients")) {
        return jsonResponse(201, { id: 1, slug: "nordlys", name: "Nordlys" });
      }

      return jsonResponse(200, { clients: [] });
    }),
  );

  renderAuthedAt("/clients/new");
  await screen.findByRole(
    "heading",
    { name: "Nouveau client" },
    { timeout: 5000 },
  );

  fireEvent.change(screen.getByLabelText("Raison sociale"), {
    target: { value: "Nordlys" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer le client" }));

  expect(
    await screen.findByRole("heading", { name: "Clients" }, { timeout: 5000 }),
  ).toBeInTheDocument();

  const creation = requests.find((request) => request.method === "POST");
  expect(creation?.path.endsWith("/clients")).toBe(true);
  expect(creation?.body).toMatchObject({
    name: "Nordlys",
    type: 0,
    color: 7,
    paymentTermsDays: 45,
  });
});

it("shows the server validation error on the field", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      jsonResponse(422, {
        message: "Ce nom est déjà utilisé.",
        errors: { name: ["Ce nom est déjà utilisé."] },
      }),
    ),
  );

  renderAuthedAt("/clients/new");
  await screen.findByRole(
    "heading",
    { name: "Nouveau client" },
    { timeout: 5000 },
  );

  fireEvent.change(screen.getByLabelText("Raison sociale"), {
    target: { value: "Nordlys" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer le client" }));

  expect(
    await screen.findByText("Ce nom est déjà utilisé."),
  ).toBeInTheDocument();
});
