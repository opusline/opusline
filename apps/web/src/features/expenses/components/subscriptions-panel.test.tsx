import type { SubscriptionsData } from "@opusline/api-client";
import { Toaster, ToastProvider } from "@opusline/ui/components/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, it, vi } from "vitest";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import { eur } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";

import { emptySubscriptionDraft } from "../lib/subscription-draft";
import {
  annualSubscription,
  SUBSCRIPTIONS_TODAY,
  subscriptionsData,
} from "../lib/subscription-fixtures";
import type { SubscriptionSheetState } from "./subscription-sheet";
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

      if (request.headers.get("Content-Type") === "application/json") {
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

type PanelOptions = {
  showCancelled?: boolean;
  initialSheet?: SubscriptionSheetState | null;
};

function PanelWithSheet({
  data,
  showCancelled,
  initialSheet,
}: Required<PanelOptions> & { data: SubscriptionsData }) {
  const [sheet, setSheet] = useState(initialSheet);

  return (
    <SubscriptionsPanel
      data={data}
      isRefreshing={false}
      isVatLiable
      onSheetChange={setSheet}
      sheet={sheet}
      showCancelled={showCancelled}
      today={SUBSCRIPTIONS_TODAY}
    />
  );
}

function renderPanel(
  data = subscriptionsData(),
  { showCancelled = false, initialSheet = null }: PanelOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MoneyFormatProvider currency="EUR" dateFormat={0} locale="fr-FR">
        <ToastProvider>
          <StoryRouter>
            <PanelWithSheet
              data={data}
              initialSheet={initialSheet}
              showCancelled={showCancelled}
            />
          </StoryRouter>
          <Toaster closeLabel="Close" />
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

// Each test renders the whole panel, every row with its twelve-month strip, and
// some open the sheet twice: on a CI runner shared with the Storybook browser
// suite that runs past Vitest's 5 s default although it takes 0.4 s locally.
vi.setConfig({ testTimeout: 15_000 });

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

  expect(
    await screen.findByRole("alert", {
      name: (_name, element) =>
        element.textContent === "Cet abonnement n'existe pas.",
    }),
  ).toBeInTheDocument();
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

it.each([
  [
    "pausing",
    "Nordlys Cloud",
    "Mettre en pause",
    { method: "POST", path: "/subscriptions/4/pause" },
    "Nordlys Cloud en pause · aucune dépense ne sera créée",
  ],
  [
    "resuming",
    "Vesterhus Énergie",
    "Reprendre",
    { method: "DELETE", path: "/subscriptions/8/pause" },
    "Vesterhus Énergie repris",
  ],
  [
    "reactivating",
    "Lunaprint",
    "Réactiver",
    { method: "DELETE", path: "/subscriptions/9/cancellation" },
    "Lunaprint réactivé · les prélèvements reprennent",
  ],
])(
  "%s a subscription from its row says so once the API agrees",
  async (_, supplier, item, request, notice) => {
    stubApi([{ ...request, status: 200, body: subscriptionsData() }]);
    renderPanel(subscriptionsData(), { showCancelled: true });

    await pickRowAction(supplier, item);

    expect(await screen.findByText(notice)).toBeInTheDocument();
  },
);

it("resiliating a subscription offers an undo that reactivates it", async () => {
  stubApi([
    {
      method: "POST",
      path: "/subscriptions/4/cancellation",
      status: 200,
      body: subscriptionsData(),
    },
    {
      method: "DELETE",
      path: "/subscriptions/4/cancellation",
      status: 200,
      body: subscriptionsData(),
    },
  ]);
  renderPanel();

  await pickRowAction("Nordlys Cloud", "Résilier");

  expect(
    await screen.findByText(
      "Nordlys Cloud résilié au 20 août 2026 · les dépenses passées sont conservées",
    ),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Annuler" }));

  expect(
    await screen.findByText(
      "Nordlys Cloud réactivé · les prélèvements reprennent",
    ),
  ).toBeInTheDocument();
});

it("stops provisioning an annual subscription on request", async () => {
  const api = stubApi([
    {
      method: "PUT",
      path: "/subscriptions/7",
      status: 200,
      body: subscriptionsData(),
    },
  ]);
  renderPanel();

  await pickRowAction("Orvella Assurances", "Ne plus provisionner");

  expect(
    await screen.findByText("Orvella Assurances · plus de provision mensuelle"),
  ).toBeInTheDocument();
  expect(api.bodies()).toEqual([
    expect.objectContaining({ provisionMonthly: false }),
  ]);
});

it("deleting a subscription closes the dialog and says so", async () => {
  stubApi([{ method: "DELETE", path: "/subscriptions/4", status: 204 }]);
  renderPanel();

  await pickRowAction("Nordlys Cloud", "Supprimer");
  fireEvent.click(
    within(await screen.findByRole("alertdialog")).getByRole("button", {
      name: "Supprimer l'abonnement",
    }),
  );

  expect(await screen.findByText("Abonnement supprimé")).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
  );
});

it("saves an edited subscription and closes its sheet", async () => {
  const api = stubApi([
    {
      method: "PUT",
      path: "/subscriptions/4",
      status: 200,
      body: subscriptionsData(),
    },
  ]);
  renderPanel();

  await pickRowAction("Nordlys Cloud", "Modifier");

  const sheet = await screen.findByRole("dialog", {
    name: "Modifier l'abonnement",
  });
  fireEvent.change(within(sheet).getByLabelText("Description"), {
    target: { value: "VPS + domaine + sauvegardes" },
  });
  fireEvent.click(within(sheet).getByRole("button", { name: "Enregistrer" }));

  expect(await screen.findByText("Abonnement modifié")).toBeInTheDocument();
  await waitFor(() =>
    expect(
      screen.queryByRole("dialog", { name: "Modifier l'abonnement" }),
    ).not.toBeInTheDocument(),
  );
  expect(api.bodies()).toEqual([
    expect.objectContaining({
      supplier: "Nordlys Cloud",
      description: "VPS + domaine + sauvegardes",
    }),
  ]);
});

it("changes a subscription's amount from its next debit", async () => {
  const api = stubApi([
    {
      method: "POST",
      path: "/subscriptions/4/amounts",
      status: 200,
      body: subscriptionsData(),
    },
  ]);
  renderPanel();

  await pickRowAction("Nordlys Cloud", "Changer le montant (à partir du…)");

  const sheet = await screen.findByRole("dialog", {
    name: "Changer le montant · Nordlys Cloud",
  });
  fireEvent.change(within(sheet).getByLabelText("Montant HT"), {
    target: { value: "29" },
  });
  fireEvent.click(within(sheet).getByRole("button", { name: "Enregistrer" }));

  expect(
    await screen.findByText(
      "Nouveau montant enregistré · les dépenses passées gardent l'ancien",
    ),
  ).toBeInTheDocument();
  expect(api.bodies()).toEqual([
    {
      amountHt: { amount: 2_900, currency: "EUR" },
      effectiveFrom: "2026-09-01",
    },
  ]);
});

it("adds the subscription typed into the sheet", async () => {
  const api = stubApi([
    {
      method: "POST",
      path: "/subscriptions",
      status: 201,
      body: subscriptionsData(),
    },
  ]);
  renderPanel(subscriptionsData(), {
    initialSheet: {
      mode: "create",
      initial: emptySubscriptionDraft(SUBSCRIPTIONS_TODAY),
    },
  });

  const sheet = await screen.findByRole("dialog", {
    name: "Ajouter un abonnement",
  });
  fireEvent.change(within(sheet).getByLabelText("Fournisseur"), {
    target: { value: "Ateliers Ruche" },
  });
  fireEvent.change(within(sheet).getByLabelText("Montant HT"), {
    target: { value: "49" },
  });
  fireEvent.click(within(sheet).getByRole("button", { name: "Enregistrer" }));

  expect(await screen.findByText("Abonnement ajouté")).toBeInTheDocument();
  expect(api.bodies()).toEqual([
    expect.objectContaining({
      supplier: "Ateliers Ruche",
      amountHt: { amount: 4_900, currency: "EUR" },
    }),
  ]);
});

it("keeps the sheet open on the field the API refused", async () => {
  stubApi([
    {
      method: "POST",
      path: "/subscriptions",
      status: 422,
      body: {
        message: "Ce fournisseur a déjà un abonnement.",
        errors: { supplier: ["Ce fournisseur a déjà un abonnement."] },
      },
    },
  ]);
  renderPanel(subscriptionsData(), {
    initialSheet: {
      mode: "create",
      initial: {
        ...emptySubscriptionDraft(SUBSCRIPTIONS_TODAY),
        supplier: "Nordlys Cloud",
        ht: "24",
      },
    },
  });

  const sheet = await screen.findByRole("dialog", {
    name: "Ajouter un abonnement",
  });
  fireEvent.click(within(sheet).getByRole("button", { name: "Enregistrer" }));

  expect(
    await within(sheet).findByText("Ce fournisseur a déjà un abonnement."),
  ).toBeInTheDocument();
  expect(within(sheet).getByLabelText("Fournisseur")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

it("leaves a refused save behind once the sheet is closed", async () => {
  stubApi([
    {
      method: "PUT",
      path: "/subscriptions/4",
      status: 409,
      body: { message: "Cet abonnement a changé entre-temps." },
    },
  ]);
  renderPanel();

  await pickRowAction("Nordlys Cloud", "Modifier");
  const refused = await screen.findByRole("dialog", {
    name: "Modifier l'abonnement",
  });
  fireEvent.click(within(refused).getByRole("button", { name: "Enregistrer" }));

  expect(
    await within(refused).findByText("Cet abonnement a changé entre-temps."),
  ).toBeInTheDocument();

  fireEvent.click(within(refused).getByRole("button", { name: "Annuler" }));
  await waitFor(() =>
    expect(
      screen.queryByRole("dialog", { name: "Modifier l'abonnement" }),
    ).not.toBeInTheDocument(),
  );
  await pickRowAction("Nordlys Cloud", "Modifier");

  expect(
    within(
      await screen.findByRole("dialog", { name: "Modifier l'abonnement" }),
    ).queryByText("Cet abonnement a changé entre-temps."),
  ).not.toBeInTheDocument();
});

async function pickReceiptFor(month: string, supplier: string, file: File) {
  const table = await screen.findByRole("table");
  const cell = within(table).getByRole("button", {
    name: `Lier la facture de ${month} · ${supplier}`,
  });
  const input = cell.parentElement?.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;

  fireEvent.change(input, { target: { files: [file] } });
}

it("links a receipt picked on a missing month and names that month", async () => {
  stubApi([
    {
      method: "POST",
      path: "/expenses/110/receipt",
      status: 200,
      body: {},
    },
  ]);
  renderPanel();

  await pickReceiptFor(
    "juillet",
    "Nordlys Cloud",
    new File(["%PDF-1.4"], "nordlys-juillet.pdf", { type: "application/pdf" }),
  );

  expect(
    await screen.findByText("Facture juillet liée · Nordlys Cloud"),
  ).toBeInTheDocument();
});

it("refuses a file that cannot be a receipt without uploading it", async () => {
  stubApi([]);
  renderPanel();

  await pickReceiptFor(
    "juillet",
    "Nordlys Cloud",
    new File(["notes"], "nordlys.txt", { type: "text/plain" }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Une facture est un PDF ou une photo (JPG, PNG, WebP).",
  );
});
