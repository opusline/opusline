import { currentUserQueryKey } from "@opusline/api-client/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { getRouter } from "@/router";

async function renderNewClientPage() {
  window.history.replaceState(null, "", "/clients/new");
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

  await screen.findByRole(
    "heading",
    { name: "Nouveau client" },
    { timeout: 5000 },
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
  await renderNewClientPage();

  expect(screen.getByLabelText("Raison sociale")).toBeInTheDocument();
  expect(screen.getByLabelText("SIRET")).toBeInTheDocument();
  expect(screen.getByText("Délai de paiement")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Créer le client" }),
  ).toBeInTheDocument();
});

it("explains the end-client rule when picking an intermediary", async () => {
  await renderNewClientPage();

  expect(
    screen.queryByText("Facturation via intermédiaire"),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /intermédiaire/i }));

  expect(
    await screen.findByText("Facturation via intermédiaire"),
  ).toBeInTheDocument();
});

it("focuses the custom days input when picking Autre", async () => {
  await renderNewClientPage();

  fireEvent.click(screen.getByRole("button", { name: "Autre…" }));

  expect(screen.getByLabelText("Délai de paiement en jours")).toHaveFocus();
});

it("seeds the custom input with the current term when picking Autre", async () => {
  await renderNewClientPage();

  fireEvent.click(screen.getByRole("button", { name: "Autre…" }));

  expect(screen.getByLabelText("Délai de paiement en jours")).toHaveValue("45");
  expect(screen.getByText("Paiement à 45 jours")).toBeInTheDocument();
});

it("restores the current term when the custom input is left blank", async () => {
  await renderNewClientPage();

  fireEvent.click(screen.getByRole("button", { name: "Autre…" }));
  fireEvent.change(screen.getByLabelText("Délai de paiement en jours"), {
    target: { value: "" },
  });

  expect(screen.getByText("Paiement à 45 jours")).toBeInTheDocument();

  fireEvent.blur(screen.getByLabelText("Délai de paiement en jours"));

  expect(screen.getByLabelText("Délai de paiement en jours")).toHaveValue("45");
});

it("restores the drafted days in the preview when returning to a custom term", async () => {
  await renderNewClientPage();

  fireEvent.click(screen.getByRole("button", { name: "Autre…" }));
  fireEvent.change(screen.getByLabelText("Délai de paiement en jours"), {
    target: { value: "90" },
  });
  expect(screen.getByText("Paiement à 90 jours")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "30 j" }));
  expect(screen.getByText("Paiement à 30 jours")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Autre…" }));
  expect(screen.getByText("Paiement à 90 jours")).toBeInTheDocument();
});

it("only accepts digits in the custom days input", async () => {
  await renderNewClientPage();

  fireEvent.click(screen.getByRole("button", { name: "Autre…" }));
  fireEvent.change(screen.getByLabelText("Délai de paiement en jours"), {
    target: { value: "9a b0" },
  });

  expect(screen.getByLabelText("Délai de paiement en jours")).toHaveValue("90");
  expect(screen.getByText("Paiement à 90 jours")).toBeInTheDocument();
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

  await renderNewClientPage();

  fireEvent.change(screen.getByLabelText("Raison sociale"), {
    target: { value: "Nordlys" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer le client" }));

  expect(
    await screen.findByRole("heading", { name: "Clients" }, { timeout: 5000 }),
  ).toBeInTheDocument();
  expect(window.location.pathname).toBe("/clients");

  const creation = requests.find((request) => request.method === "POST");
  expect(creation?.path.endsWith("/clients")).toBe(true);
  expect(creation?.body).toMatchObject({
    name: "Nordlys",
    type: 0,
    color: 7,
    paymentTermsDays: 45,
  });
});

it("shows the server validation error on the name field", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      jsonResponse(422, {
        message: "Ce nom est déjà utilisé.",
        errors: { name: ["Ce nom est déjà utilisé."] },
      }),
    ),
  );

  await renderNewClientPage();

  fireEvent.change(screen.getByLabelText("Raison sociale"), {
    target: { value: "Nordlys" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer le client" }));

  expect(
    await screen.findByText("Ce nom est déjà utilisé."),
  ).toBeInTheDocument();
});

it("shows the server validation error on the billing contact field", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      jsonResponse(422, {
        message: "Le champ contact ne peut pas dépasser 255 caractères.",
        errors: {
          billingContactName: [
            "Le champ contact ne peut pas dépasser 255 caractères.",
          ],
        },
      }),
    ),
  );

  await renderNewClientPage();

  fireEvent.change(screen.getByLabelText("Raison sociale"), {
    target: { value: "Nordlys" },
  });
  fireEvent.change(screen.getByLabelText("Contact facturation"), {
    target: { value: "x".repeat(300) },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer le client" }));

  expect(
    await screen.findByText(
      "Le champ contact ne peut pas dépasser 255 caractères.",
    ),
  ).toBeInTheDocument();
});
