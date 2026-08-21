import type { ClientWithMissionsData } from "@opusline/api-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { getRouter } from "@/router";
import { seedCurrentUser } from "@/test/current-user";

function client(
  overrides: Partial<ClientWithMissionsData>,
): ClientWithMissionsData {
  return {
    id: 1,
    slug: "nordlys",
    name: "Nordlys",
    type: 1,
    notes: null,
    siret: null,
    vatNumber: null,
    defaultVatRateBp: null,
    billingAddressLine1: null,
    billingAddressLine2: null,
    billingPostalCode: null,
    billingCity: null,
    billingCountry: null,
    billingContactName: null,
    billingEmail: null,
    color: 0,
    paymentTermsDays: 45,
    archivedAt: null,
    createdAt: "2025-03-01T00:00:00+00:00",
    missions: [],
    ...overrides,
  };
}

const CLIENTS = [
  client({}),
  client({ id: 2, slug: "lunaprint", name: "Lunaprint", type: 0, color: 4 }),
  client({ id: 3, slug: "perso", name: "Perso", type: 2, color: 7 }),
  client({
    id: 4,
    slug: "studio-lorem",
    name: "Studio Lorem",
    type: 0,
    archivedAt: "2026-06-01T00:00:00+00:00",
  }),
];

const CREATED_MISSION = {
  id: 9,
  slug: "callisto-front",
  clientId: 1,
  name: "Callisto front",
  endClientName: "Callisto",
  billingMode: 0,
  rate: { amount: 55_000, currency: "EUR" },
  rounding: 0,
  status: 0,
  craRequired: true,
  color: null,
  notes: null,
  startDate: null,
  endDate: null,
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type RecordedRequest = { method: string; path: string; body: unknown };

function stubApi(
  overrides?: (request: Request) => Response | null,
): RecordedRequest[] {
  const requests: RecordedRequest[] = [];

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const url = new URL(request.url, "http://localhost");
      const body =
        request.method === "GET"
          ? null
          : await request
              .clone()
              .json()
              .catch(() => null);
      requests.push({ method: request.method, path: url.pathname, body });

      const overridden = overrides?.(request);
      if (overridden) {
        return overridden;
      }

      if (url.pathname.endsWith("/client-revenue")) {
        return jsonResponse(200, { year: 2026, clients: [] });
      }

      if (request.method === "GET" && url.pathname.endsWith("/clients")) {
        return jsonResponse(200, { clients: CLIENTS });
      }

      if (request.method === "GET" && url.pathname.endsWith("/documents")) {
        return jsonResponse(200, { documents: [] });
      }

      if (
        request.method === "GET" &&
        /\/clients\/[a-z0-9-]+$/.test(url.pathname)
      ) {
        return jsonResponse(200, CLIENTS[0]);
      }

      if (
        request.method === "GET" &&
        /\/missions\/[a-z0-9-]+$/.test(url.pathname)
      ) {
        return jsonResponse(200, CREATED_MISSION);
      }

      return jsonResponse(201, CREATED_MISSION);
    }),
  );

  return requests;
}

async function renderNewMissionPage(
  path = "/missions/new",
  { hasFrenchFiscality = true } = {},
) {
  window.history.replaceState(null, "", path);
  const router = getRouter();
  seedCurrentUser(router.options.context.queryClient, {
    hasFrenchFiscality,
  });

  render(
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  await screen.findByRole(
    "heading",
    { name: "Nouvelle mission" },
    { timeout: 5000 },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("preselects the first active client and shows the ESN fields", async () => {
  stubApi();
  await renderNewMissionPage();

  expect(screen.getByRole("button", { name: "Nordlys" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.queryByText("Studio Lorem")).not.toBeInTheDocument();
  expect(screen.getByText(/Client final/)).toBeInTheDocument();
  expect(screen.getByText("CRA mensuel requis")).toBeInTheDocument();
});

it("preselects the client from the search param", async () => {
  stubApi();
  await renderNewMissionPage("/missions/new?client=lunaprint");

  expect(screen.getByRole("button", { name: "Lunaprint" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.queryByText(/Client final/)).not.toBeInTheDocument();
  expect(screen.queryByText("CRA mensuel requis")).not.toBeInTheDocument();
});

it("keeps the rounding and explains the forfait mode", async () => {
  stubApi();
  await renderNewMissionPage();

  expect(screen.getByText("Arrondi des entrées")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Qu'est-ce que l'arrondi ?" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Forfait" }));

  // The rounding stays: a forfait bills no time, but the increment is what its
  // budget consumption is measured in.
  expect(screen.getByText("Arrondi des entrées")).toBeInTheDocument();
  expect(
    screen.getByText(/le temps est suivi pour votre marge/),
  ).toBeInTheDocument();
});

it("hides the rate and billing mode for an internal client", async () => {
  stubApi();
  await renderNewMissionPage();

  fireEvent.click(screen.getByRole("button", { name: "Perso" }));

  expect(screen.queryByText("Tarif HT")).not.toBeInTheDocument();
  expect(screen.queryByText("Mode de facturation")).not.toBeInTheDocument();
});

it("creates an internal mission without billing details", async () => {
  const requests = stubApi();
  await renderNewMissionPage();

  fireEvent.click(screen.getByRole("button", { name: "Perso" }));
  fireEvent.change(screen.getByLabelText("Nom de la mission"), {
    target: { value: "Opusline" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer la mission" }));

  await waitFor(() => {
    const creation = requests.find((request) => request.method === "POST");
    expect(creation?.path.endsWith("/clients/perso/missions")).toBe(true);
    expect(creation?.body).toMatchObject({
      billingMode: 0,
      rate: null,
      rounding: 0,
      craRequired: null,
    });
  });
});

it("creates the mission and lands on its own page", async () => {
  const requests = stubApi();
  await renderNewMissionPage();

  fireEvent.change(screen.getByLabelText("Nom de la mission"), {
    target: { value: "Callisto front" },
  });
  fireEvent.change(screen.getByLabelText("Tarif HT"), {
    target: { value: "550" },
  });
  fireEvent.change(screen.getByLabelText(/Client final/), {
    target: { value: "Callisto" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer la mission" }));

  expect(
    await screen.findByRole(
      "heading",
      { name: "Callisto front" },
      { timeout: 5000 },
    ),
  ).toBeInTheDocument();
  expect(window.location.pathname).toBe(
    "/clients/nordlys/missions/callisto-front",
  );

  const creation = requests.find((request) => request.method === "POST");
  expect(creation?.path.endsWith("/clients/nordlys/missions")).toBe(true);
  expect(creation?.body).toMatchObject({
    name: "Callisto front",
    billingMode: 0,
    rate: { amount: 55_000, currency: "EUR" },
    rounding: 0,
    craRequired: true,
    endClientName: "Callisto",
  });
});

it("formats the rate with French thousands grouping", async () => {
  stubApi();
  await renderNewMissionPage();

  fireEvent.change(screen.getByLabelText("Tarif HT"), {
    target: { value: "4800" },
  });

  expect(screen.getByLabelText("Tarif HT")).toHaveValue("4\u202f800");
  expect(screen.getByText(/4 800 €\/j/)).toBeInTheDocument();
});

it("keeps the URSSAF projection rows for a French business", async () => {
  stubApi();
  await renderNewMissionPage();

  expect(screen.getByText(/Provision URSSAF/)).toBeInTheDocument();
});

it("stops the projection at the gross figure for a business abroad", async () => {
  stubApi();
  await renderNewMissionPage("/missions/new", { hasFrenchFiscality: false });

  expect(screen.queryByText(/Provision URSSAF/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Net estimé/)).not.toBeInTheDocument();
});

it("clears the rate when switching billing mode", async () => {
  stubApi();
  await renderNewMissionPage();

  fireEvent.change(screen.getByLabelText("Tarif HT"), {
    target: { value: "550" },
  });
  fireEvent.click(screen.getByRole("button", { name: "À l'heure" }));

  expect(screen.getByLabelText("Tarif HT")).toHaveValue("");
});

it("requires a rate before creating a billable mission", async () => {
  const requests = stubApi();
  await renderNewMissionPage();

  fireEvent.change(screen.getByLabelText("Nom de la mission"), {
    target: { value: "Callisto front" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer la mission" }));

  expect(
    await screen.findByText("Indiquez un tarif pour cette mission."),
  ).toBeInTheDocument();
  expect(requests.find((request) => request.method === "POST")).toBeUndefined();
});

it("shows the server validation error on the name field", async () => {
  stubApi((request) =>
    request.method === "POST"
      ? jsonResponse(422, {
          message: "Le champ nom est obligatoire.",
          errors: { name: ["Le champ nom est obligatoire."] },
        })
      : null,
  );
  await renderNewMissionPage();

  fireEvent.change(screen.getByLabelText("Tarif HT"), {
    target: { value: "550" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer la mission" }));

  expect(
    await screen.findByText("Le champ nom est obligatoire."),
  ).toBeInTheDocument();
});

it("stays locked between the mission creation and the client refresh", async () => {
  let releaseClientRefresh = () => {};
  let hasCreated = false;
  const requests: RecordedRequest[] = [];

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const url = new URL(request.url, "http://localhost");
      requests.push({ method: request.method, path: url.pathname, body: null });

      if (request.method === "POST") {
        hasCreated = true;
        return jsonResponse(201, CREATED_MISSION);
      }

      if (url.pathname.endsWith("/client-revenue")) {
        return jsonResponse(200, { year: 2026, clients: [] });
      }

      if (url.pathname.endsWith("/clients")) {
        return jsonResponse(200, { clients: CLIENTS });
      }

      if (url.pathname.endsWith("/documents")) {
        return jsonResponse(200, { documents: [] });
      }

      if (/\/missions\/[a-z0-9-]+$/.test(url.pathname)) {
        return jsonResponse(200, CREATED_MISSION);
      }

      if (hasCreated) {
        await new Promise<void>((resolve) => {
          releaseClientRefresh = resolve;
        });
      }

      return jsonResponse(200, CLIENTS[0]);
    }),
  );

  await renderNewMissionPage();

  fireEvent.change(screen.getByLabelText("Nom de la mission"), {
    target: { value: "Callisto front" },
  });
  fireEvent.change(screen.getByLabelText("Tarif HT"), {
    target: { value: "550" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer la mission" }));

  const submit = await screen.findByRole("button", {
    name: "Créer la mission",
  });
  await waitFor(() => expect(submit).toBeDisabled());

  fireEvent.click(submit);
  releaseClientRefresh();

  await waitFor(() => {
    expect(
      requests.filter((request) => request.method === "POST"),
    ).toHaveLength(1);
  });
});
