import type {
  ClientData,
  InvoiceData,
  InvoiceDetailData,
  InvoiceListItemData,
  InvoiceSummaryData,
  InvoiceTodoData,
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

const overdueTodo = {
  kind: 0,
  amount: { amount: 375_600, currency: "EUR" },
  clientId: 1,
  clientName: "HartPrint",
  invoiceId: 36,
  number: "F-2026-036",
  dueOn: "2026-06-30",
  daysLate: 41,
  missionId: 10,
  missionName: null,
  entryCount: null,
  firstEntryOn: null,
  lastEntryOn: null,
  valuedDays: null,
  valuedMinutes: null,
  timeEntryIds: [],
} satisfies InvoiceTodoData;

const unbilledTodo = {
  kind: 1,
  amount: { amount: 165_000, currency: "EUR" },
  clientId: 2,
  clientName: "OGF",
  invoiceId: null,
  number: null,
  dueOn: null,
  daysLate: null,
  missionId: 20,
  missionName: "OGF front",
  entryCount: 3,
  firstEntryOn: "2026-08-03",
  lastEntryOn: "2026-08-07",
  valuedDays: 3,
  valuedMinutes: null,
  timeEntryIds: [101, 102, 103],
} satisfies InvoiceTodoData;

export function invoiceTodo(
  overrides: Partial<InvoiceTodoData> = {},
): InvoiceTodoData {
  const base = overrides.kind === 1 ? unbilledTodo : overdueTodo;

  return { ...base, ...overrides };
}

export function invoiceSummary(
  overrides: Partial<InvoiceSummaryData> = {},
): InvoiceSummaryData {
  return {
    month: "2026-08",
    toCollect: { amount: { amount: 1_744_800, currency: "EUR" }, count: 5 },
    overdue: {
      amount: { amount: 375_600, currency: "EUR" },
      count: 3,
      maxDaysLate: 147,
    },
    proAccountBalance: null,
    forecast: [
      {
        bucket: 0,
        amount: { amount: 375_600, currency: "EUR" },
        shareBp: 2_744,
      },
      {
        bucket: 1,
        amount: { amount: 1_369_200, currency: "EUR" },
        shareBp: 10_000,
      },
      { bucket: 2, amount: { amount: 0, currency: "EUR" }, shareBp: 0 },
    ],
    monthUnbilled: { amount: { amount: 165_000, currency: "EUR" }, count: 2 },
    counts: { all: 9, draft: 1, sent: 5, late: 3, paid: 3 },
    todo: [overdueTodo, unbilledTodo],
    todoTotal: 2,
    ...overrides,
  };
}
