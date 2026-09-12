import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";

import {
  cancelledSubscription,
  emptySubscriptionsData,
  SUBSCRIPTIONS_TODAY,
  subscriptionsData,
} from "../lib/subscription-fixtures";
import { SubscriptionsTab } from "./subscriptions-tab";

function renderTab(
  overrides: Partial<Parameters<typeof SubscriptionsTab>[0]> = {},
) {
  const props = {
    data: subscriptionsData(),
    isVatLiable: true,
    isRefreshing: false,
    showCancelled: false,
    today: SUBSCRIPTIONS_TODAY,
    onEdit: vi.fn(),
    onChangeAmount: vi.fn(),
    onPause: vi.fn(),
    onResume: vi.fn(),
    onToggleProvision: vi.fn(),
    onCancel: vi.fn(),
    onReactivate: vi.fn(),
    onDelete: vi.fn(),
    onLinkReceipt: vi.fn(),
    isDetectedBusy: false,
    onCreateFromDebit: vi.fn(),
    onDismissDebit: vi.fn(),
    ...overrides,
  };

  render(
    <StoryRouter>
      <SubscriptionsTab {...props} />
    </StoryRouter>,
  );

  return props;
}

it("sums the subscriptions up in four tiles", async () => {
  renderTab();

  const tile = async (label: string) =>
    (await screen.findByText(label)).closest(
      '[data-slot="stat-tile"]',
    ) as HTMLElement;

  expect(await tile("Mensuel")).toHaveTextContent(/53\s€ \/ mois/);
  expect(await tile("Mensuel")).toHaveTextContent("2 abonnements mensuels");
  expect(await tile("Annuel")).toHaveTextContent(
    /312\s€ \/ an1 abonnement annuel · 1 provisionné 26\s€ \/ mois/,
  );
  expect(await tile("TVA récupérable")).toHaveTextContent(
    /dont 58\s€ autoliquidés/,
  );
  expect(await tile("Factures manquantes")).toHaveTextContent("1");
});

it("lists the live rows and keeps the cancelled ones for the toggle", async () => {
  renderTab();

  const table = await screen.findByRole("table");

  expect(within(table).getByText("Nordlys Cloud")).toBeInTheDocument();
  expect(within(table).getByText("Orvella Assurances")).toBeInTheDocument();
  expect(within(table).queryByText("Lunaprint")).not.toBeInTheDocument();
});

it("says how each row debits and pays its TVA", async () => {
  renderTab();

  const table = await screen.findByRole("table");

  expect(within(table).getByText("En pause")).toBeInTheDocument();
  expect(within(table).getByText("le 15 janv.")).toBeInTheDocument();
  expect(
    within(table).getByText(/^autoliq\. 20\s% · 70\s% de 4,83\s€$/),
  ).toBeInTheDocument();
});

it("fills twelve slots, idle where the subscription had no debit", async () => {
  renderTab({ showCancelled: true });

  const table = await screen.findByRole("table");
  const strips = within(table).getAllByRole("list", {
    name: "Factures · 12 mois",
  });
  const lunaprint = strips.at(-1) as HTMLElement;

  expect(lunaprint.children).toHaveLength(12);
  expect(within(lunaprint).getAllByRole("img")).toHaveLength(10);
});

it("shows the cancelled rows on demand, washed and dated", async () => {
  renderTab({ showCancelled: true });

  const table = await screen.findByRole("table");
  const row = within(table).getByText("Lunaprint").closest("tr") as HTMLElement;

  expect(row).toHaveClass("bg-muted/60");
  expect(within(row).getByText("Résilié")).toBeInTheDocument();
  expect(within(row).getByText("le 05/06/2026")).toBeInTheDocument();
});

it("hands a receipt picked on a missing month to that debit", async () => {
  const props = renderTab();

  const table = await screen.findByRole("table");
  const cell = within(table).getByRole("button", {
    name: "Lier la facture de juillet · Nordlys Cloud",
  });
  const input = cell.parentElement?.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  const file = new File(["%PDF-1.4"], "nordlys.pdf", {
    type: "application/pdf",
  });

  fireEvent.change(input, { target: { files: [file] } });

  expect(props.onLinkReceipt).toHaveBeenCalledWith(
    expect.objectContaining({ id: 4 }),
    expect.objectContaining({ period: "2026-07", expenseId: 110 }),
    expect.objectContaining({ length: 1 }),
  );
});

it.each([
  ["Orvella Assurances", "Ne plus provisionner", "onToggleProvision", 7],
  ["Vesterhus Énergie", "Reprendre", "onResume", 8],
  ["Nordlys Cloud", "Changer le montant (à partir du…)", "onChangeAmount", 4],
] as const)(
  "hands %s's « %s » to the right handler",
  async (supplier, item, handler, id) => {
    const props = renderTab();

    const table = await screen.findByRole("table");
    fireEvent.click(
      within(table).getByRole("button", { name: `Actions pour ${supplier}` }),
    );
    fireEvent.click(await screen.findByRole("menuitem", { name: item }));

    expect(props[handler]).toHaveBeenCalledWith(
      expect.objectContaining({ id }),
    );
  },
);

it("reads the yearly split under the list", async () => {
  renderTab();

  const split = (await screen.findByText("Répartition annuelle · HT")).closest(
    "section",
  ) as HTMLElement;

  expect(within(split).getByText(/^1\s730\s€ HT \/ an$/)).toBeInTheDocument();
  expect(within(split).getByText("Électricité")).toBeInTheDocument();
});

it("reads the price changes, an increase in amber", async () => {
  renderTab();

  expect(await screen.findByText(/^\+26\s%$/)).toHaveClass("text-attention");
  expect(screen.getByText("1 juin 2026")).toBeInTheDocument();
});

it("says so without any subscription", async () => {
  renderTab({ data: emptySubscriptionsData() });

  expect(await screen.findByText("Aucun abonnement")).toBeInTheDocument();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});

it("tells the cancelled ones apart from none at all", async () => {
  renderTab({
    data: subscriptionsData({
      subscriptions: [cancelledSubscription()],
    }),
  });

  expect(
    await screen.findByText("Tous les abonnements sont résiliés"),
  ).toBeInTheDocument();
});

it("offers the recurring debit the compte pro shows as a subscription", async () => {
  const props = renderTab();

  expect(
    await screen.findByText(
      /Prélèvement récurrent détecté : PRLV SEPA ATELIERS RUCHE · 49,00\s€ · le 20 du mois · 3 mois consécutifs/,
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "Compte pro · juin, juillet, août · aucun abonnement ne correspond",
    ),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Créer l'abonnement" }));
  expect(props.onCreateFromDebit).toHaveBeenCalledWith(
    expect.objectContaining({ label: "PRLV SEPA ATELIERS RUCHE" }),
  );

  fireEvent.click(screen.getByRole("button", { name: "Ignorer" }));
  expect(props.onDismissDebit).toHaveBeenCalled();
});

it("lists the debits ahead, the provision dashed, and sums the real ones", async () => {
  renderTab();

  const rail = (
    await screen.findByText("Prochains prélèvements · 30 jours")
  ).closest("aside") as HTMLElement;

  expect(
    within(rail).getByText("1 septembre 2026 · mensuel"),
  ).toBeInTheDocument();
  expect(within(rail).getByText(/^provision mensuelle · 26\s€$/)).toHaveClass(
    "italic",
  );
  expect(
    within(rail).getByText("d'ici le 19 septembre 2026"),
  ).toBeInTheDocument();
  expect(within(rail).getByText(/^52,97\s€$/)).toBeInTheDocument();
  expect(
    within(rail).getByText(/Orvella Assurances · 26\s€ provisionnés ce mois/),
  ).toBeInTheDocument();
  expect(
    within(rail).getByRole("link", { name: "Virable en sécurité" }),
  ).toHaveAttribute("href", "/treasury");
});
