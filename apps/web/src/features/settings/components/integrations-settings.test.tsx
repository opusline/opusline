import type { IntegrationsData } from "@opusline/api-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";
import { IntegrationsSettings } from "./integrations-settings";

const APPLICATION_ID = "6f1c1a52-9d1e-4b9e-8a53-0c1e2f3a4b5c";
const PEM = "-----BEGIN PRIVATE KEY-----\nMIIEvQ\n-----END PRIVATE KEY-----";

function integrations(applicationId: string | null): IntegrationsData {
  return {
    enableBanking: {
      applicationId,
      redirectUrl: "https://opusline.example/bank-account",
    },
  };
}

type Route = { method: string; path: string; status: number; body?: unknown };

/** Answers the API calls the tab makes; unmatched requests fail loudly. */
function stubApi(routes: Route[]): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const path = new URL(request.url, "http://localhost").pathname;

      if (path.endsWith("/sanctum/csrf-cookie")) {
        return new Response(null, { status: 204 });
      }

      const route = routes.find(
        (candidate) =>
          candidate.method === request.method && path.endsWith(candidate.path),
      );

      if (route === undefined) {
        throw new Error(`Unexpected request: ${request.method} ${path}`);
      }

      return new Response(
        route.body === undefined ? null : JSON.stringify(route.body),
        {
          status: route.status,
          headers:
            route.body === undefined
              ? {}
              : { "Content-Type": "application/json" },
        },
      );
    }),
  );
}

function renderTab() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <StoryRouter>
        <IntegrationsSettings />
      </StoryRouter>
    </QueryClientProvider>,
  );
}

async function saveApplication() {
  fireEvent.change(await screen.findByTestId("enable-banking-application-id"), {
    target: { value: APPLICATION_ID },
  });
  fireEvent.change(screen.getByTestId("enable-banking-private-key"), {
    target: { value: PEM },
  });
  fireEvent.click(screen.getByTestId("enable-banking-save"));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("shows the saved application once enable banking accepted it", async () => {
  stubApi([
    {
      method: "GET",
      path: "/settings/integrations",
      status: 200,
      body: integrations(null),
    },
    {
      method: "PUT",
      path: "/settings/integrations/enable-banking",
      status: 200,
      body: integrations(APPLICATION_ID),
    },
  ]);
  renderTab();

  await saveApplication();

  await waitFor(() =>
    expect(screen.getByTestId("enable-banking-card")).toHaveAttribute(
      "data-status",
      "configured",
    ),
  );
  expect(screen.getByText(`Identifiant ${APPLICATION_ID}`)).toBeInTheDocument();
});

it("puts a refusal on the field it concerns", async () => {
  stubApi([
    {
      method: "GET",
      path: "/settings/integrations",
      status: 200,
      body: integrations(null),
    },
    {
      method: "PUT",
      path: "/settings/integrations/enable-banking",
      status: 422,
      body: {
        message: "Invalid.",
        errors: { privateKey: ["Enable Banking a refusé cette clé."] },
      },
    },
  ]);
  renderTab();

  await saveApplication();

  expect(
    await screen.findByText("Enable Banking a refusé cette clé."),
  ).toBeInTheDocument();
  expect(screen.getByTestId("enable-banking-card")).toHaveAttribute(
    "data-status",
    "unconfigured",
  );
});

it("says why when enable banking cannot be reached", async () => {
  stubApi([
    {
      method: "GET",
      path: "/settings/integrations",
      status: 200,
      body: integrations(null),
    },
    {
      method: "PUT",
      path: "/settings/integrations/enable-banking",
      status: 503,
      body: { message: "La banque est injoignable via Enable Banking." },
    },
  ]);
  renderTab();

  await saveApplication();

  expect(
    await screen.findByText("La banque est injoignable via Enable Banking."),
  ).toBeInTheDocument();
});

it("forgets the application once removal is confirmed", async () => {
  stubApi([
    {
      method: "GET",
      path: "/settings/integrations",
      status: 200,
      body: integrations(APPLICATION_ID),
    },
    {
      method: "DELETE",
      path: "/settings/integrations/enable-banking",
      status: 200,
      body: integrations(null),
    },
  ]);
  renderTab();

  fireEvent.click(await screen.findByTestId("enable-banking-remove"));
  fireEvent.click(await screen.findByTestId("enable-banking-remove-confirm"));

  await waitFor(() =>
    expect(screen.getByTestId("enable-banking-card")).toHaveAttribute(
      "data-status",
      "unconfigured",
    ),
  );
});
