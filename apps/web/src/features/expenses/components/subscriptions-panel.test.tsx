import { Toaster, ToastProvider } from "@opusline/ui/components/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import { eur } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";

import {
  annualSubscription,
  SUBSCRIPTIONS_TODAY,
  subscriptionsData,
} from "../lib/subscription-fixtures";
import { SubscriptionsPanel } from "./subscriptions-panel";

type Route = { method: string; path: string; status: number; body?: unknown };

/** Answers the writes the panel makes; unmatched requests fail loudly. */
function stubApi(routes: Route[]): { bodies: () => unknown[] } {
  const bodies: unknown[] = [];

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const path = new URL(request.url).pathname;
      const route = routes.find(
        (candidate) =>
          candidate.method === request.method && path.endsWith(candidate.path),
      );

      if (route === undefined) {
        throw new Error(`Unexpected request: ${request.method} ${path}`);
      }

      if (request.body !== null) {
        bodies.push(await request.json());
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

  return { bodies: () => bodies };
}

function renderPanel(data = subscriptionsData()) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
        <ToastProvider>
          <StoryRouter>
            <SubscriptionsPanel
              data={data}
              isRefreshing={false}
              isVatLiable
              onSheetChange={vi.fn()}
              sheet={null}
              showCancelled={false}
              today={SUBSCRIPTIONS_TODAY}
            />
          </StoryRouter>
          <Toaster />
        </ToastProvider>
      </MoneyFormatProvider>
    </QueryClientProvider>,
  );
}

async function pickRowAction(supplier: string, item: string) {
  const table = await screen.findByRole("table");

  fireEvent.click(
    within(table).getByRole("button", { name: `Actions pour ${supplier}` }),
  );
  fireEvent.click(await screen.findByRole("menuitem", { name: item }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("shows why a deletion failed once the dialog is out of the way", async () => {
  stubApi([
    {
      method: "DELETE",
      path: "/subscriptions/4",
      status: 404,
      body: { message: "Cet abonnement n'existe pas." },
    },
  ]);
  renderPanel();

  await pickRowAction("Nordlys Cloud", "Supprimer");
  fireEvent.click(
    within(await screen.findByRole("alertdialog")).getByRole("button", {
      name: "Supprimer l'abonnement",
    }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Cet abonnement n'existe pas.",
  );
  await waitFor(() =>
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
  );
});

it("toasts the monthly provision the API worked out", async () => {
  const unprovisioned = {
    ...annualSubscription(),
    provisionMonthly: false,
    monthlyProvision: null,
  };
  const api = stubApi([
    {
      method: "PUT",
      path: "/subscriptions/7",
      status: 200,
      body: subscriptionsData({
        subscriptions: [
          {
            ...annualSubscription(),
            monthlyProvision: eur(2_600),
          },
        ],
      }),
    },
  ]);
  renderPanel(subscriptionsData({ subscriptions: [unprovisioned] }));

  await pickRowAction("Orvella Assurances", "Provisionner mensuellement");

  expect(
    await screen.findByText(
      /^Orvella Assurances · 26\s€ \/ mois mis de côté dans Trésorerie$/,
    ),
  ).toBeInTheDocument();
  expect(api.bodies()).toEqual([
    expect.objectContaining({ provisionMonthly: true }),
  ]);
});
