import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, expect, it, vi } from "vitest";

import { invoiceDetail } from "../lib/fixtures";
import {
  InvoiceDrawerProvider,
  useOpenInvoice,
} from "./invoice-drawer-provider";

type RecordedRequest = { method: string; path: string; body: unknown };

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Records every call, answers the fiche, and lets a test refuse one endpoint. */
function stubApi(
  detail = invoiceDetail(),
  refuse?: (request: Request) => Response | null,
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

      return (
        refuse?.(request) ??
        (request.method === "GET"
          ? jsonResponse(200, detail)
          : jsonResponse(200, detail.invoice))
      );
    }),
  );

  return requests;
}

function InvoicePage() {
  const openInvoice = useOpenInvoice();

  return (
    <button onClick={() => openInvoice(1)} type="button">
      ouvrir
    </button>
  );
}

/** Stands in for the ledger adopting `?invoice=` as it mounts. */
function DeepLinkPage() {
  const openInvoice = useOpenInvoice();

  useEffect(() => {
    openInvoice(1);
  }, [openInvoice]);

  return <p>Factures</p>;
}

async function renderApp() {
  const rootRoute = createRootRoute({
    component: () => (
      <InvoiceDrawerProvider timezone="Europe/Paris">
        <Outlet />
      </InvoiceDrawerProvider>
    ),
  });
  const routeTree = rootRoute.addChildren([
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: InvoicePage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/ailleurs",
      component: () => <p>Une autre page</p>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/lien-profond",
      component: DeepLinkPage,
    }),
  ]);

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  await screen.findByRole("button", { name: "ouvrir" }, { timeout: 5000 });

  return router;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("opens the fiche a row asks for", async () => {
  stubApi();
  await renderApp();

  fireEvent.click(screen.getByRole("button", { name: "ouvrir" }));

  expect(await screen.findByText("2026-014")).toBeInTheDocument();
});

it("drops the fiche when the page under it changes", async () => {
  stubApi();
  const router = await renderApp();

  fireEvent.click(screen.getByRole("button", { name: "ouvrir" }));
  await screen.findByText("2026-014");

  // Navigated through the router rather than a click: the open sheet is modal,
  // so the page behind it is inert — which is exactly why leaving it stranded
  // over a screen the user navigated to would trap them.
  await act(async () => {
    // Through history rather than navigate(): the app's route table is what the
    // typed navigate() knows about, and this router is a two-route stand-in.
    router.history.push("/ailleurs");
  });

  await screen.findByText("Une autre page");
  expect(screen.queryByText("2026-014")).not.toBeInTheDocument();
});

it("writes the reference before sending a draft that carries none", async () => {
  const requests = stubApi(invoiceDetail({ number: null, status: 0 }));
  await renderApp();

  fireEvent.click(screen.getByRole("button", { name: "ouvrir" }));
  fireEvent.change(await screen.findByLabelText("Référence"), {
    target: { value: "2026-015" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Marquer envoyée" }));

  await waitFor(() => {
    expect(requests.filter((request) => request.method !== "GET")).toEqual([
      expect.objectContaining({
        method: "PUT",
        path: "/api/invoices/1",
        body: expect.objectContaining({ number: "2026-015" }),
      }),
      expect.objectContaining({ method: "POST", path: "/api/invoices/1/send" }),
    ]);
  });
});

it("does not send when the reference write is refused", async () => {
  const requests = stubApi(
    invoiceDetail({ number: null, status: 0 }),
    (request) =>
      request.method === "PUT"
        ? jsonResponse(422, { message: "La référence est déjà prise." })
        : null,
  );
  await renderApp();

  fireEvent.click(screen.getByRole("button", { name: "ouvrir" }));
  fireEvent.change(await screen.findByLabelText("Référence"), {
    target: { value: "2026-015" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Marquer envoyée" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "La référence est déjà prise.",
  );
  expect(requests.some((request) => request.path.endsWith("/send"))).toBe(
    false,
  );
});

it("keeps a fiche a page opens as it arrives, deep-link style", async () => {
  stubApi();
  const router = await renderApp();

  await act(async () => {
    router.history.push("/lien-profond");
  });

  await screen.findByText("Factures");
  expect(await screen.findByText("2026-014")).toBeInTheDocument();
});
