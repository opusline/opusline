import type { ClientWithMissionsData, MissionData } from "@opusline/api-client";
import { expect, it } from "vitest";
import {
  DEFAULT_MONEY_FORMAT,
  formatMissionRate,
  paymentTermsLabel,
} from "@/lib/billing";
import { formatPostalAddress } from "./client-form";
import { clientSubtitle, isNewClient } from "./labels";

function mission(overrides: Partial<MissionData> = {}): MissionData {
  return {
    id: 1,
    slug: "callisto-front",
    clientId: 1,
    name: "Callisto front",
    endClientName: null,
    billingMode: 0,
    rate: { amount: 55_000, currency: "EUR" },
    referenceDailyRate: null,
    rounding: 0,
    status: 0,
    craRequired: false,
    color: null,
    notes: null,
    startDate: null,
    endDate: null,
    ...overrides,
  };
}

function client(
  overrides: Partial<ClientWithMissionsData> = {},
): ClientWithMissionsData {
  return {
    id: 1,
    slug: "nordlys",
    name: "Nordlys",
    type: 0,
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
    createdAt: "2026-08-01T00:00:00+00:00",
    missions: [],
    ...overrides,
  };
}

it("formats a daily rate in euros per day", () => {
  expect(formatMissionRate(DEFAULT_MONEY_FORMAT, mission())).toBe("550 €/j");
});

it("formats an hourly rate with cents when needed", () => {
  expect(
    formatMissionRate(
      DEFAULT_MONEY_FORMAT,
      mission({ billingMode: 1, rate: { amount: 8_550, currency: "EUR" } }),
    ),
  ).toBe("85,5 €/h");
});

it("formats a fixed price as a forfait total", () => {
  expect(
    formatMissionRate(
      DEFAULT_MONEY_FORMAT,
      mission({ billingMode: 2, rate: { amount: 480_000, currency: "EUR" } }),
    ),
  ).toBe("4 800 € forfait");
});

it("labels a mission without a rate as non billable", () => {
  expect(formatMissionRate(DEFAULT_MONEY_FORMAT, mission({ rate: null }))).toBe(
    "non facturable",
  );
});

it("formats payment terms with the right plural", () => {
  expect(paymentTermsLabel(0)).toBe("réception");
  expect(paymentTermsLabel(1)).toBe("1 jour");
  expect(paymentTermsLabel(45)).toBe("45 jours");
});

it("builds the subtitle from the type and unique end clients", () => {
  const subject = client({
    type: 1,
    missions: [
      mission({ endClientName: "Callisto" }),
      mission({ id: 2, endClientName: "Callisto" }),
    ],
  });

  expect(clientSubtitle(subject)).toBe("ESN · client final Callisto");
});

it("describes an internal client in the subtitle", () => {
  expect(clientSubtitle(client({ type: 2 }))).toBe("Projets internes");
});

it("leaves archiving out of the subtitle", () => {
  expect(
    clientSubtitle(client({ archivedAt: "2026-08-01T00:00:00+00:00" })),
  ).toBe("Aucune mission");
});

it("falls back to the mission count when there is nothing else to say", () => {
  expect(clientSubtitle(client({ missions: [mission()] }))).toBe("1 mission");
  expect(
    clientSubtitle(client({ missions: [mission(), mission({ id: 2 })] })),
  ).toBe("2 missions");
});

it("considers a client created three days ago as new", () => {
  const now = new Date("2026-08-04T12:00:00+00:00");

  expect(
    isNewClient(client({ createdAt: "2026-08-01T00:00:00+00:00" }), now),
  ).toBe(true);
});

it("considers a client created two weeks ago as not new", () => {
  const now = new Date("2026-08-04T12:00:00+00:00");

  expect(
    isNewClient(client({ createdAt: "2026-07-21T00:00:00+00:00" }), now),
  ).toBe(false);
});

it("announces the missing missions when there is nothing else to say", () => {
  expect(clientSubtitle(client())).toBe("Aucune mission");
});

it("joins the stored address parts into a readable block", () => {
  expect(
    formatPostalAddress({
      billingAddressLine1: "12 rue de la Paix",
      billingAddressLine2: "Bâtiment C",
      billingPostalCode: "44000",
      billingCity: "Nantes",
      billingCountry: "France",
    }),
  ).toBe("12 rue de la Paix\nBâtiment C\n44000 Nantes\nFrance");
});

it("skips the parts a client never filled in", () => {
  expect(
    formatPostalAddress({
      billingAddressLine1: "12 rue de la Paix",
      billingAddressLine2: null,
      billingPostalCode: null,
      billingCity: "Nantes",
      billingCountry: null,
    }),
  ).toBe("12 rue de la Paix\nNantes");
});

it("reports a wholly empty address as absent", () => {
  expect(
    formatPostalAddress({
      billingAddressLine1: null,
      billingAddressLine2: null,
      billingPostalCode: null,
      billingCity: null,
      billingCountry: null,
    }),
  ).toBeNull();
});
