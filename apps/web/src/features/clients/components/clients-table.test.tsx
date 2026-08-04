import type { ClientWithMissionsData } from "@opusline/api-client";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ClientsTable } from "./clients-table";

function client(
  overrides: Partial<ClientWithMissionsData>,
): ClientWithMissionsData {
  return {
    id: 1,
    slug: "catamania",
    name: "Catamania",
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
    createdAt: "2026-08-01T00:00:00+00:00",
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
              slug: "ogf-front",
              clientId: 1,
              name: "OGF front",
              endClientName: "OGF",
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

  expect(screen.getByText("Catamania")).toBeInTheDocument();
  expect(screen.getByText("ESN / intermédiaire")).toBeInTheDocument();
  expect(screen.getByText("client final OGF")).toBeInTheDocument();
  expect(screen.getByText("OGF front")).toBeInTheDocument();
  expect(screen.getByText("550 €/j")).toBeInTheDocument();
  expect(screen.getByText("Active")).toBeInTheDocument();
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
});

it("shows a placeholder row for a client without missions", () => {
  render(<ClientsTable clients={[client({})]} />);

  expect(screen.getByText("Aucune mission")).toBeInTheDocument();
});

it("shows the empty state when there are no clients", () => {
  render(<ClientsTable clients={[]} />);

  expect(screen.getByText("Créez votre premier client")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Créer un client" }),
  ).toBeInTheDocument();
});
