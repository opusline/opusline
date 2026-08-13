import type {
  ClientData,
  InvoiceData,
  InvoiceDetailData,
  InvoiceListItemData,
  MissionData,
} from "@opusline/api-client";

const client = {
  id: 1,
  slug: "hartprint",
  name: "HartPrint",
  type: 0,
  notes: null,
  siret: null,
  vatNumber: null,
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
  createdAt: "2026-01-05T09:00:00+00:00",
} satisfies ClientData;

const mission = {
  id: 10,
  slug: "refonte-catalogue",
  clientId: 1,
  name: "Refonte catalogue",
  endClientName: null,
  billingMode: 0,
  rate: { amount: 55_000, currency: "EUR" },
  rounding: 0,
  status: 0,
  craRequired: false,
  color: null,
  notes: null,
  startDate: null,
  endDate: null,
} satisfies MissionData;

const invoice = {
  id: 1,
  clientId: 1,
  missionId: 10,
  number: "2026-014",
  status: 1,
  isLate: false,
  issuedOn: "2026-07-01",
  dueOn: "2026-08-15",
  paidOn: null,
  periodStart: null,
  periodEnd: null,
  amountHt: { amount: 165_000, currency: "EUR" },
  amountVat: { amount: 33_000, currency: "EUR" },
  amountTtc: { amount: 198_000, currency: "EUR" },
  ttcOverridden: false,
  vatRateBp: 2000,
  notes: null,
} satisfies InvoiceData;

/**
 * A list item built from the shared shapes above, so a fixture only has to say what
 * makes it different.
 */
export function invoiceItem(
  overrides: Partial<InvoiceData> = {},
  context: Partial<Pick<InvoiceListItemData, "client" | "mission">> = {},
): InvoiceListItemData {
  return {
    invoice: { ...invoice, ...overrides },
    client: context.client ?? client,
    mission: context.mission === undefined ? mission : context.mission,
  };
}

export const secondClient = {
  ...client,
  id: 2,
  slug: "ogf",
  name: "OGF",
  color: 4,
  paymentTermsDays: 30,
} satisfies ClientData;

export function invoiceDetail(
  overrides: Partial<InvoiceData> = {},
): InvoiceDetailData {
  const item = invoiceItem(overrides);

  return {
    invoice: item.invoice,
    client: item.client,
    mission: item.mission,
    history: [
      { id: 1, kind: 0, occurredOn: "2026-06-30", note: null },
      { id: 2, kind: 1, occurredOn: "2026-06-30", note: null },
      { id: 3, kind: 3, occurredOn: "2026-07-24", note: null },
    ],
  };
}
