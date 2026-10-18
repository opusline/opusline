import type { FeatureFlag, IntegrationsData } from "@opusline/api-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { INVOICING } from "@/lib/features";
import { seedCurrentUser } from "@/test/current-user";
import {
  anthropicWithoutKey,
  eInvoicingConnected,
  eInvoicingUnconfigured,
} from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { IntegrationsSettings } from "./integrations-settings";

const APPLICATION_ID = "6f1c1a52-9d1e-4b9e-8a53-0c1e2f3a4b5c";
const PEM = "-----BEGIN PRIVATE KEY-----\nMIIEvQ\n-----END PRIVATE KEY-----";

const CLIENT_ID = "opusline_8f3c2e1a4d6f9b7c";
const CLIENT_SECRET = "secret-for-the-sandbox-only";

function integrations(
  applicationId: string | null,
  superPdpClientId: string | null = null,
): IntegrationsData {
  return {
    enableBanking: {
      applicationId,
      redirectUrl: "https://opusline.example/bank-account",
    },
    eInvoicing:
      superPdpClientId === null
        ? eInvoicingUnconfigured
        : { ...eInvoicingConnected, clientId: superPdpClientId },
    anthropic: anthropicWithoutKey,
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

function renderTab({
  features = [INVOICING],
}: {
  features?: FeatureFlag[];
} = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  seedCurrentUser(queryClient, { features });

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

it("connects super pdp and shows what it said about the company", async () => {
  stubApi([
    {
      method: "GET",
      path: "/settings/integrations",
      status: 200,
      body: integrations(null),
    },
    {
      method: "PUT",
      path: "/settings/integrations/super-pdp",
      status: 200,
      body: integrations(null, CLIENT_ID),
    },
  ]);
  renderTab();

  fireEvent.change(await screen.findByTestId("super-pdp-client-id"), {
    target: { value: CLIENT_ID },
  });
  fireEvent.change(screen.getByTestId("super-pdp-client-secret"), {
    target: { value: CLIENT_SECRET },
  });
  fireEvent.click(screen.getByTestId("super-pdp-save"));

  await waitFor(() =>
    expect(screen.getByTestId("super-pdp-card")).toHaveAttribute(
      "data-status",
      "connected",
    ),
  );
  expect(screen.getByTestId("super-pdp-receiving-address")).toHaveAttribute(
    "data-address",
    "0225:12345678200002",
  );
});

it("puts a refused secret on its field", async () => {
  stubApi([
    {
      method: "GET",
      path: "/settings/integrations",
      status: 200,
      body: integrations(null),
    },
    {
      method: "PUT",
      path: "/settings/integrations/super-pdp",
      status: 422,
      body: {
        message: "Invalid.",
        errors: { clientSecret: ["Super PDP a refusé ces identifiants."] },
      },
    },
  ]);
  renderTab();

  fireEvent.change(await screen.findByTestId("super-pdp-client-id"), {
    target: { value: CLIENT_ID },
  });
  fireEvent.change(screen.getByTestId("super-pdp-client-secret"), {
    target: { value: CLIENT_SECRET },
  });
  fireEvent.click(screen.getByTestId("super-pdp-save"));

  expect(
    await screen.findByText("Super PDP a refusé ces identifiants."),
  ).toBeInTheDocument();
});

it("rechecks the super pdp connection on demand", async () => {
  stubApi([
    {
      method: "GET",
      path: "/settings/integrations",
      status: 200,
      body: integrations(null, CLIENT_ID),
    },
    {
      method: "POST",
      path: "/settings/integrations/super-pdp/check",
      status: 200,
      body: integrations(null, CLIENT_ID),
    },
  ]);
  renderTab();

  fireEvent.click(await screen.findByTestId("super-pdp-check"));

  expect(await screen.findByTestId("super-pdp-notice")).toBeInTheDocument();
});

it("says why when a super pdp check fails", async () => {
  stubApi([
    {
      method: "GET",
      path: "/settings/integrations",
      status: 200,
      body: integrations(null, CLIENT_ID),
    },
    {
      method: "POST",
      path: "/settings/integrations/super-pdp/check",
      status: 409,
      body: { message: "Super PDP a refusé ces identifiants." },
    },
  ]);
  renderTab();

  fireEvent.click(await screen.findByTestId("super-pdp-check"));

  expect(
    await screen.findByText("Super PDP a refusé ces identifiants."),
  ).toBeInTheDocument();
});

it("forgets super pdp once removal is confirmed", async () => {
  stubApi([
    {
      method: "GET",
      path: "/settings/integrations",
      status: 200,
      body: integrations(null, CLIENT_ID),
    },
    {
      method: "DELETE",
      path: "/settings/integrations/super-pdp",
      status: 200,
      body: integrations(null),
    },
  ]);
  renderTab();

  fireEvent.click(await screen.findByTestId("super-pdp-remove"));
  fireEvent.click(await screen.findByTestId("super-pdp-remove-confirm"));

  await waitFor(() =>
    expect(screen.getByTestId("super-pdp-card")).toHaveAttribute(
      "data-status",
      "unconfigured",
    ),
  );
});

it("keeps the e-invoicing card out of an account without the invoicing beta", async () => {
  stubApi([
    {
      method: "GET",
      path: "/settings/integrations",
      status: 200,
      body: integrations(null, CLIENT_ID),
    },
  ]);
  renderTab({ features: [] });

  expect(await screen.findByTestId("enable-banking-card")).toBeInTheDocument();
  expect(screen.queryByTestId("super-pdp-card")).toBeNull();
});
