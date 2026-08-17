import type { ClientWithMissionsData } from "@opusline/api-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { getRouter } from "@/router";
import { seedCurrentUser } from "@/test/current-user";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(days: number): string {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

function clientPayload(
  overrides: Partial<ClientWithMissionsData> = {},
): ClientWithMissionsData {
  return {
    id: 1,
    slug: "nordlys",
    name: "Nordlys",
    type: 1,
    notes: null,
    siret: "443 061 841 00047",
    vatNumber: null,
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
    createdAt: daysAgo(400),
    missions: [
      {
        id: 1,
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
      },
    ],
    ...overrides,
  };
}

function revenuePayload() {
  return {
    year: 2026,
    clients: [
      {
        clientId: 1,
        yearToDate: { amount: 4_820_000, currency: "EUR" },
        pending: { amount: 960_000, currency: "EUR" },
        averagePaymentDelayDays: 27,
        missions: [
          {
            missionId: 1,
            yearToDate: { amount: 4_820_000, currency: "EUR" },
            currentMonth: { amount: 605_000, currency: "EUR" },
            total: { amount: 7_150_000, currency: "EUR" },
            monthlyAverage: { amount: 447_000, currency: "EUR" },
          },
        ],
      },
    ],
  };
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type RecordedRequest = {
  method: string;
  path: string;
  url: string;
  body: unknown;
};

function stubApi(
  client: ClientWithMissionsData,
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
      requests.push({
        method: request.method,
        path: url.pathname,
        url: request.url,
        body,
      });

      const overridden = overrides?.(request);
      if (overridden) {
        return overridden;
      }

      if (url.pathname.endsWith("/client-revenue")) {
        return jsonResponse(200, revenuePayload());
      }

      if (url.pathname.endsWith("/documents")) {
        return jsonResponse(200, { documents: [] });
      }

      return jsonResponse(200, client);
    }),
  );

  return requests;
}

async function renderDetailPage(path = "/clients/nordlys") {
  window.history.replaceState(null, "", path);
  const router = getRouter();
  seedCurrentUser(router.options.context.queryClient);

  render(
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  await screen.findByRole("heading", { name: "Nordlys" }, { timeout: 5000 });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("shows the client header, stats and missions", async () => {
  stubApi(clientPayload());
  await renderDetailPage();

  expect(screen.getByText("Intermédiaire")).toBeInTheDocument();
  expect(
    screen.getByText(/Client depuis .+ · paiement à 45 jours/),
  ).toBeInTheDocument();
  expect(screen.getByText("Callisto front")).toBeInTheDocument();
  expect(screen.getByText("550 €/j")).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "Missions" })).toBeInTheDocument();
});

it("shows the coordinates in the dedicated tab", async () => {
  stubApi(clientPayload({ vatNumber: "FR64 443061841" }));
  await renderDetailPage();

  fireEvent.click(screen.getByRole("tab", { name: "Coordonnées" }));

  expect(await screen.findByText("443 061 841 00047")).toBeInTheDocument();
  expect(screen.getByText("FR64 443061841")).toBeInTheDocument();
});

it("invites to fill in missing coordinates", async () => {
  stubApi(clientPayload({ siret: null }));
  await renderDetailPage();

  fireEvent.click(screen.getByRole("tab", { name: "Coordonnées" }));

  expect(
    await screen.findByText("Coordonnées à compléter"),
  ).toBeInTheDocument();
});

it("saves an edit and returns to reading mode", async () => {
  const requests = stubApi(clientPayload());
  await renderDetailPage();

  fireEvent.click(screen.getByRole("button", { name: "Modifier" }));
  fireEvent.change(await screen.findByLabelText("Raison sociale"), {
    target: { value: "Nordlys Conseil" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(
    await screen.findByRole("tab", { name: "Missions" }),
  ).toBeInTheDocument();

  const update = requests.find((request) => request.method === "PUT");
  expect(update?.path.endsWith("/clients/nordlys")).toBe(true);
  expect(update?.body).toMatchObject({ name: "Nordlys Conseil", type: 1 });
});

it("keeps the edit form open when the update fails without field errors", async () => {
  stubApi(clientPayload(), (request) =>
    request.method === "PUT"
      ? jsonResponse(500, { message: "Server Error" })
      : null,
  );
  await renderDetailPage();

  fireEvent.click(screen.getByRole("button", { name: "Modifier" }));
  fireEvent.change(await screen.findByLabelText("Raison sociale"), {
    target: { value: "Nordlys Conseil" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(
    await screen.findByText("L'action a échoué. Réessayez dans un instant."),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("Raison sociale")).toHaveValue(
    "Nordlys Conseil",
  );
  expect(
    screen.queryByRole("tab", { name: "Missions" }),
  ).not.toBeInTheDocument();
});

it("shows saved billing contact details even without company identifiers", async () => {
  stubApi(
    clientPayload({
      siret: null,
      vatNumber: null,
      billingAddressLine1: null,
      billingAddressLine2: null,
      billingPostalCode: null,
      billingCity: null,
      billingCountry: null,
      billingEmail: "factures@nordlys.example",
    }),
  );
  await renderDetailPage();

  fireEvent.click(screen.getByRole("tab", { name: "Coordonnées" }));

  expect(
    await screen.findByText("factures@nordlys.example"),
  ).toBeInTheDocument();
  expect(screen.queryByText("Coordonnées à compléter")).not.toBeInTheDocument();
});

it("shows the client documents in the documents tab", async () => {
  stubApi(clientPayload(), (request) => {
    const url = new URL(request.url, "http://localhost");

    return request.method === "GET" && url.pathname.endsWith("/documents")
      ? jsonResponse(200, {
          documents: [
            {
              id: 7,
              fileName: "contrat-cadre-nordlys.pdf",
              category: 0,
              source: 1,
              sizeBytes: 1_240_000,
              createdAt: "2025-03-05T10:00:00+00:00",
            },
          ],
        })
      : null;
  });
  await renderDetailPage();

  fireEvent.click(screen.getByRole("tab", { name: "Documents" }));

  expect(
    await screen.findByText("contrat-cadre-nordlys.pdf"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Télécharger contrat-cadre-nordlys.pdf" }),
  ).toHaveAttribute(
    "href",
    expect.stringContaining("/clients/nordlys/documents/7/download"),
  );
});

it("uploads a confirmed document to the client", async () => {
  const requests = stubApi(clientPayload(), (request) => {
    const url = new URL(request.url, "http://localhost");

    return request.method === "POST" && url.pathname.endsWith("/documents")
      ? jsonResponse(201, {
          id: 8,
          fileName: "contrat.pdf",
          category: 0,
          source: 1,
          sizeBytes: 1,
          createdAt: "2025-03-05T10:00:00+00:00",
        })
      : null;
  });
  await renderDetailPage();

  fireEvent.click(screen.getByRole("tab", { name: "Documents" }));
  fireEvent.change(screen.getByLabelText("Ajouter des documents"), {
    target: {
      files: [new File(["x"], "contrat.pdf", { type: "application/pdf" })],
    },
  });
  fireEvent.click(
    await screen.findByRole("button", { name: "Envoyer 1 document" }),
  );

  await waitFor(() => {
    const upload = requests.find(
      (request) =>
        request.method === "POST" &&
        request.path.endsWith("/clients/nordlys/documents"),
    );
    expect(upload).toBeDefined();
  });
  // The row leaves the queue on success instead of turning into an error.
  await waitFor(() => {
    expect(screen.queryByText("Envois en cours")).not.toBeInTheDocument();
  });
  expect(
    screen.queryByText("L'envoi a échoué. Réessayez dans un instant."),
  ).not.toBeInTheDocument();
});

it("uploads a logo picked from the edit form", async () => {
  const requests = stubApi(clientPayload(), (request) =>
    request.method === "POST" && new URL(request.url).pathname.endsWith("/logo")
      ? new Response(null, { status: 204 })
      : null,
  );
  await renderDetailPage();

  fireEvent.click(screen.getByRole("button", { name: "Modifier" }));
  fireEvent.change(await screen.findByLabelText("Logo du client"), {
    target: {
      files: [new File(["x"], "nordlys.png", { type: "image/png" })],
    },
  });

  await waitFor(() => {
    const upload = requests.find(
      (request) =>
        request.method === "POST" &&
        request.path.endsWith("/clients/nordlys/logo"),
    );
    expect(upload).toBeDefined();
  });
});

it("retires the creation-time logo warning once an upload goes through", async () => {
  stubApi(clientPayload(), (request) =>
    request.method === "POST" && new URL(request.url).pathname.endsWith("/logo")
      ? new Response(null, { status: 204 })
      : null,
  );
  await renderDetailPage("/clients/nordlys?logoFailed=true");

  expect(screen.getByText(/l'envoi du logo a échoué/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Modifier" }));
  fireEvent.change(await screen.findByLabelText("Logo du client"), {
    target: {
      files: [new File(["x"], "nordlys.png", { type: "image/png" })],
    },
  });

  await waitFor(() => {
    expect(
      screen.queryByText(/l'envoi du logo a échoué/),
    ).not.toBeInTheDocument();
  });
  expect(window.location.search).toBe("");
});

it("removes the logo from the edit form", async () => {
  const requests = stubApi(clientPayload());
  await renderDetailPage();

  fireEvent.click(screen.getByRole("button", { name: "Modifier" }));
  fireEvent.click(
    await screen.findByRole("button", { name: "Retirer le logo du client" }),
  );

  await waitFor(() => {
    const removal = requests.find(
      (request) =>
        request.method === "DELETE" &&
        request.path.endsWith("/clients/nordlys/logo"),
    );
    expect(removal).toBeDefined();
  });
});

it("hides mission creation on an archived client", async () => {
  stubApi(clientPayload({ archivedAt: daysAgo(10), missions: [] }));
  await renderDetailPage();

  expect(
    screen.queryByRole("button", { name: /Nouvelle mission/ }),
  ).not.toBeInTheDocument();
  expect(
    await screen.findByText(
      "Client archivé — réactivez-le pour ajouter une mission.",
    ),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Créer une mission" }),
  ).not.toBeInTheDocument();
});

it("archives the client from the actions menu", async () => {
  const requests = stubApi(clientPayload());
  await renderDetailPage();

  fireEvent.click(screen.getByRole("button", { name: "Plus d'actions" }));
  fireEvent.click(
    await screen.findByRole("menuitem", { name: "Archiver ce client" }),
  );

  await waitFor(() => {
    const archive = requests.find(
      (request) =>
        request.method === "POST" &&
        request.path.endsWith("/clients/nordlys/archive"),
    );
    expect(archive).toBeDefined();
  });
});

it("offers to reactivate an archived client", async () => {
  stubApi(clientPayload({ archivedAt: daysAgo(10) }));
  await renderDetailPage();

  expect(screen.getByText("Archivé")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Plus d'actions" }));

  expect(
    await screen.findByRole("menuitem", { name: "Réactiver ce client" }),
  ).toBeInTheDocument();
});

it("opens the edit form without popping the address suggestions", async () => {
  const requests = stubApi(
    clientPayload({
      billingAddressLine1: "12 Rue de la Paix",
      billingPostalCode: "44000",
      billingCity: "Nantes",
      billingCountry: "France",
    }),
  );
  await renderDetailPage();

  fireEvent.click(screen.getByRole("button", { name: "Modifier" }));
  await screen.findByLabelText("Adresse");

  await waitFor(() => {
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
  expect(
    requests.filter((request) => request.url.includes("data.geopf.fr")),
  ).toHaveLength(0);
});

it("opens the coordinates tab for a client whose only address part is a country", async () => {
  stubApi(clientPayload({ siret: null, billingCountry: "France" }));
  await renderDetailPage();

  fireEvent.click(screen.getByRole("tab", { name: "Coordonnées" }));

  expect(await screen.findByText("France")).toBeInTheDocument();
});

it("fills the header tiles with the client's revenue figures", async () => {
  stubApi(clientPayload());
  await renderDetailPage();

  expect(await screen.findByText("CA 2026")).toBeInTheDocument();
  // The mission row carries the same figure, so this one is not unique.
  expect(screen.getAllByText("48 200 €").length).toBeGreaterThan(0);
  expect(screen.getByText("9 600 €")).toBeInTheDocument();
  expect(screen.getByText("27 jours")).toBeInTheDocument();
});

it("shows each mission's revenue for the year in the missions tab", async () => {
  stubApi(clientPayload());
  await renderDetailPage();

  // The mission row and the client tile both read 48 200 € here, so the count
  // is what proves the row picked its own figure up rather than staying blank.
  expect(await screen.findByText("Callisto front")).toBeInTheDocument();
  expect(screen.getAllByText("48 200 €")).toHaveLength(2);
});
