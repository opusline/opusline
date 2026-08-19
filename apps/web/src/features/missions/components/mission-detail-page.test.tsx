import type {
  ClientWithMissionsData,
  DocumentData,
  InvoiceListItemData,
  MissionData,
} from "@opusline/api-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { getRouter } from "@/router";
import { seedCurrentUser } from "@/test/current-user";
import { invoiceItem, missionRevenueDetailPayload } from "@/test/fixtures";

function missionPayload(overrides: Partial<MissionData> = {}): MissionData {
  return {
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
    startDate: "2025-03-03",
    endDate: null,
    ...overrides,
  };
}

function clientPayload(): ClientWithMissionsData {
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
    missions: [
      missionPayload(),
      missionPayload({
        id: 2,
        slug: "callisto-socle-api",
        name: "Callisto socle API",
        status: 2,
      }),
    ],
  };
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type RecordedRequest = { method: string; path: string; body: unknown };

function stubApi(
  mission: MissionData,
  documents: DocumentData[] = [],
  invoices: InvoiceListItemData[] = [],
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

      if (url.pathname.endsWith("/time-entries")) {
        return jsonResponse(200, { timeEntries: [] });
      }

      if (url.pathname.endsWith("/revenue")) {
        return jsonResponse(200, missionRevenueDetailPayload());
      }

      if (url.pathname.endsWith("/invoices")) {
        return jsonResponse(200, { invoices, clientTotals: [] });
      }

      if (url.pathname.endsWith("/documents")) {
        return jsonResponse(200, { documents });
      }

      if (url.pathname.includes("/missions/")) {
        return jsonResponse(200, mission);
      }

      return jsonResponse(200, clientPayload());
    }),
  );

  return requests;
}

async function renderMissionDetail() {
  window.history.replaceState(
    null,
    "",
    "/clients/nordlys/missions/callisto-front",
  );
  const router = getRouter();
  seedCurrentUser(router.options.context.queryClient);

  render(
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  await screen.findByRole(
    "heading",
    { name: "Callisto front" },
    { timeout: 5000 },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("shows the mission header, siblings and entries tab", async () => {
  stubApi(missionPayload());
  await renderMissionDetail();

  expect(
    screen.getByText(
      "Intermédiaire Nordlys · client final Callisto · depuis mars 2025",
    ),
  ).toBeInTheDocument();
  expect(screen.getByText("Active")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Callisto socle API/ }),
  ).toHaveAttribute("href", "/clients/nordlys/missions/callisto-socle-api");
  expect(
    screen.getByRole("link", { name: /Callisto front/, current: "page" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Les entrées se créent depuis la grille de la semaine."),
  ).toBeInTheDocument();
});

it("shows the configuration tab", async () => {
  stubApi(missionPayload());
  await renderMissionDetail();

  fireEvent.click(screen.getByRole("tab", { name: "Configuration" }));

  expect(await screen.findByText("550")).toBeInTheDocument();
  expect(screen.getByText("€ / j")).toBeInTheDocument();
  expect(screen.getByText("0,5 j")).toBeInTheDocument();
  expect(screen.getByText("45 jours")).toBeInTheDocument();
  expect(screen.getByText("Callisto")).toBeInTheDocument();
  expect(screen.getByText("CRA mensuel requis")).toBeInTheDocument();
});

it("explains a non billable mission in the invoices tab", async () => {
  stubApi(missionPayload({ rate: null }));
  await renderMissionDetail();

  fireEvent.click(screen.getByRole("tab", { name: "Factures" }));

  expect(
    await screen.findByText(
      "Cette mission n'est pas facturable — son temps ne produit pas de facture.",
    ),
  ).toBeInTheDocument();
});

it("lists the mission's own invoices in the invoices tab", async () => {
  stubApi(
    missionPayload(),
    [],
    [invoiceItem({ id: 7, number: "2026-014", periodStart: "2026-07-01" })],
  );
  await renderMissionDetail();

  fireEvent.click(screen.getByRole("tab", { name: "Factures" }));

  expect(await screen.findByText("2026-014")).toBeInTheDocument();
  // The rows are all on this mission, so none of them repeats its name.
  expect(screen.queryByText(/Refonte catalogue/)).not.toBeInTheDocument();
});

it("saves an edit and returns to reading mode", async () => {
  const requests = stubApi(missionPayload());
  await renderMissionDetail();

  fireEvent.click(screen.getByRole("button", { name: "Modifier" }));
  fireEvent.change(await screen.findByLabelText("Nom de la mission"), {
    target: { value: "Callisto front v2" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(
    await screen.findByRole("tab", { name: "Entrées" }),
  ).toBeInTheDocument();

  const update = requests.find((request) => request.method === "PUT");
  expect(
    update?.path.endsWith("/clients/nordlys/missions/callisto-front"),
  ).toBe(true);
  expect(update?.body).toMatchObject({
    name: "Callisto front v2",
    billingMode: 0,
    status: 0,
    rate: { amount: 55_000, currency: "EUR" },
    endClientName: "Callisto",
    craRequired: true,
  });
});

it("marks the mission as done from the actions menu", async () => {
  const requests = stubApi(missionPayload());
  await renderMissionDetail();

  fireEvent.click(screen.getByRole("button", { name: "Plus d'actions" }));
  fireEvent.click(
    await screen.findByRole("menuitem", { name: "Marquer comme terminée" }),
  );

  await waitFor(() => {
    const update = requests.find((request) => request.method === "PUT");
    expect(update?.body).toMatchObject({ status: 2, name: "Callisto front" });
  });
});

it("shows a server error on an untouched field after saving", async () => {
  const mission = missionPayload();
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const url = new URL(request.url, "http://localhost");

      if (request.method === "PUT") {
        return jsonResponse(422, {
          message: "Le champ client final est obligatoire.",
          errors: {
            endClientName: ["Le champ client final est obligatoire."],
          },
        });
      }

      if (url.pathname.endsWith("/time-entries")) {
        return jsonResponse(200, { timeEntries: [] });
      }

      if (url.pathname.endsWith("/revenue")) {
        return jsonResponse(200, missionRevenueDetailPayload());
      }

      if (url.pathname.endsWith("/documents")) {
        return jsonResponse(200, { documents: [] });
      }

      if (url.pathname.includes("/missions/")) {
        return jsonResponse(200, mission);
      }

      return jsonResponse(200, clientPayload());
    }),
  );
  await renderMissionDetail();

  fireEvent.click(screen.getByRole("button", { name: "Modifier" }));
  await screen.findByLabelText("Nom de la mission");
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(
    await screen.findByText("Le champ client final est obligatoire."),
  ).toBeInTheDocument();
});

it("shows inherited client documents without a delete action", async () => {
  stubApi(missionPayload(), [
    {
      id: 7,
      fileName: "contrat-cadre-nordlys.pdf",
      category: 0,
      source: 1,
      sizeBytes: 1_240_000,
      createdAt: "2025-03-05T10:00:00+00:00",
    },
  ]);
  await renderMissionDetail();

  fireEvent.click(screen.getByRole("tab", { name: "Documents" }));

  expect(
    await screen.findByText("contrat-cadre-nordlys.pdf"),
  ).toBeInTheDocument();
  expect(screen.getByText("client")).toBeInTheDocument();
  expect(
    screen.queryByRole("button", {
      name: "Supprimer contrat-cadre-nordlys.pdf",
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Télécharger contrat-cadre-nordlys.pdf" }),
  ).toHaveAttribute(
    "href",
    expect.stringContaining("/clients/nordlys/documents/7/download"),
  );
});

it("offers to resume a finished mission", async () => {
  stubApi(missionPayload({ status: 2 }));
  await renderMissionDetail();

  expect(screen.getByText("Terminée")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Plus d'actions" }));

  expect(
    await screen.findByRole("menuitem", { name: "Reprendre la mission" }),
  ).toBeInTheDocument();
});

it("refuses a second mutation while the first is still running", async () => {
  let releaseStatusChange = () => {};
  const requests: RecordedRequest[] = [];

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const url = new URL(request.url, "http://localhost");
      requests.push({ method: request.method, path: url.pathname, body: null });

      if (request.method === "PUT") {
        await new Promise<void>((resolve) => {
          releaseStatusChange = resolve;
        });

        return jsonResponse(200, missionPayload());
      }

      if (url.pathname.endsWith("/time-entries")) {
        return jsonResponse(200, { timeEntries: [] });
      }

      if (url.pathname.endsWith("/revenue")) {
        return jsonResponse(200, missionRevenueDetailPayload());
      }

      if (url.pathname.endsWith("/documents")) {
        return jsonResponse(200, { documents: [] });
      }

      if (url.pathname.includes("/missions/")) {
        return jsonResponse(200, missionPayload());
      }

      return jsonResponse(200, clientPayload());
    }),
  );

  await renderMissionDetail();

  // Open the edit form, then start a status change from the header menu.
  fireEvent.click(screen.getByRole("button", { name: "Modifier" }));
  await screen.findByLabelText("Nom de la mission");

  fireEvent.click(screen.getByRole("button", { name: "Plus d'actions" }));
  fireEvent.click(
    await screen.findByRole("menuitem", { name: "Marquer comme terminée" }),
  );

  await waitFor(() => {
    expect(requests.filter((request) => request.method === "PUT")).toHaveLength(
      1,
    );
  });

  // Enter submits the form even though its button is disabled.
  fireEvent.submit(
    screen
      .getByLabelText("Nom de la mission")
      .closest("form") as HTMLFormElement,
  );
  // Let the submit pipeline run to completion while the status change is still
  // hanging, so the second mutation genuinely overlaps the first.
  await new Promise((resolve) => setTimeout(resolve, 50));

  expect(requests.filter((request) => request.method === "PUT")).toHaveLength(
    1,
  );

  releaseStatusChange();

  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeEnabled();
  });
});

it("fills the header tiles with the mission's revenue figures", async () => {
  stubApi(missionPayload());
  await renderMissionDetail();

  expect(await screen.findByText("6 050 €")).toBeInTheDocument();
  expect(screen.getByText("71 500 €")).toBeInTheDocument();
  expect(screen.getByText("4 470 €")).toBeInTheDocument();
});
