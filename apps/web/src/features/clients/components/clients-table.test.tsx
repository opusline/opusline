import type { ClientWithMissionsData } from "@opusline/api-client";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { expect, it } from "vitest";
import { ClientsTable } from "./clients-table";

function renderWithRouter(ui: React.ReactNode) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => ui }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return render(<RouterProvider router={router} />);
}

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(days: number): string {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

function client(
  overrides: Partial<ClientWithMissionsData>,
): ClientWithMissionsData {
  return {
    id: 1,
    slug: "nordlys",
    name: "Nordlys",
    type: 0,
    notes: null,
    siret: null,
    vatNumber: null,
    billingAddress: null,
    billingContactName: null,
    billingEmail: null,
    color: 0,
    paymentTermsDays: 45,
    archivedAt: null,
    createdAt: daysAgo(90),
    missions: [],
    ...overrides,
  };
}

it("shows the client with its type and missions", () => {
  render(
    <ClientsTable
      clients={[
        client({
          type: 1,
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
        }),
      ]}
    />,
  );

  expect(screen.getByText("Nordlys")).toBeInTheDocument();
  expect(screen.getByText("Intermédiaire")).toBeInTheDocument();
  expect(screen.getByText("ESN · client final Callisto")).toBeInTheDocument();
  expect(screen.getByText("Callisto front")).toBeInTheDocument();
  expect(screen.getByText("550 €/j")).toBeInTheDocument();
  expect(screen.getByText("Active")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Ajouter une mission" }),
  ).toBeInTheDocument();
});

it("labels a mission without a rate as non billable", () => {
  render(
    <ClientsTable
      clients={[
        client({
          type: 2,
          missions: [
            {
              id: 1,
              slug: "opusline",
              clientId: 1,
              name: "Opusline",
              endClientName: null,
              billingMode: 1,
              rate: null,
              rounding: 0,
              status: 0,
              craRequired: false,
              color: null,
              notes: null,
              startDate: null,
              endDate: null,
            },
          ],
        }),
      ]}
    />,
  );

  expect(screen.getByText("non facturable")).toBeInTheDocument();
  expect(screen.getByText("Perso")).toBeInTheDocument();
});

it("offers to create the first mission of a client without missions", () => {
  render(<ClientsTable clients={[client({})]} />);

  expect(
    screen.getByRole("button", { name: "Aucune mission — en créer une" }),
  ).toBeInTheDocument();
});

it("shows the empty state when there are no clients", async () => {
  renderWithRouter(<ClientsTable clients={[]} />);

  expect(
    await screen.findByText("Créez votre premier client"),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Créer un client" })).toHaveAttribute(
    "href",
    "/clients/new",
  );
});

it("flags a recently created client as new", () => {
  render(<ClientsTable clients={[client({ createdAt: daysAgo(2) })]} />);

  expect(screen.getByText("Nouveau")).toBeInTheDocument();
});

it("does not flag an old client as new", () => {
  render(<ClientsTable clients={[client({})]} />);

  expect(screen.queryByText("Nouveau")).not.toBeInTheDocument();
});

it("marks an archived client with a badge", () => {
  render(<ClientsTable clients={[client({ archivedAt: daysAgo(30) })]} />);

  fireEvent.click(screen.getByRole("button", { name: "Archivés (1)" }));

  expect(screen.getByText("Archivé")).toBeInTheDocument();
});

it("does not flag an archived client as new", () => {
  render(
    <ClientsTable
      clients={[client({ createdAt: daysAgo(2), archivedAt: daysAgo(1) })]}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Archivés (1)" }));

  expect(screen.getByText("Archivé")).toBeInTheDocument();
  expect(screen.queryByText("Nouveau")).not.toBeInTheDocument();
});

it("shows only active clients by default, with every scope count", () => {
  render(
    <ClientsTable
      clients={[
        client({}),
        client({
          id: 2,
          slug: "studio-lorem",
          name: "Studio Lorem",
          archivedAt: daysAgo(30),
        }),
      ]}
    />,
  );

  expect(
    screen.getByRole("button", { name: "Actifs (1)" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Archivés (1)" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Tous (2)" })).toBeInTheDocument();
  expect(screen.getByText("Nordlys")).toBeInTheDocument();
  expect(screen.queryByText("Studio Lorem")).not.toBeInTheDocument();
});

it("filters the list when picking the archived scope", () => {
  render(
    <ClientsTable
      clients={[
        client({}),
        client({
          id: 2,
          slug: "studio-lorem",
          name: "Studio Lorem",
          archivedAt: daysAgo(30),
        }),
      ]}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Archivés (1)" }));

  expect(screen.getByText("Studio Lorem")).toBeInTheDocument();
  expect(screen.queryByText("Nordlys")).not.toBeInTheDocument();
});

it("explains an empty scope instead of showing a bare table", () => {
  render(<ClientsTable clients={[client({})]} />);

  fireEvent.click(screen.getByRole("button", { name: "Archivés (0)" }));

  expect(screen.getByText("Aucun client dans cette vue.")).toBeInTheDocument();
});
