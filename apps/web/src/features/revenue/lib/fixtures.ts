import type {
  ClientData,
  InvoiceData,
  InvoiceListItemData,
  InvoiceSummaryData,
  MissionData,
  RevenueClientData,
  RevenueData,
  RevenueMonthData,
} from "@opusline/api-client";

import {
  CLIENT_FIXTURE,
  eur,
  invoiceItem,
  invoiceSummary,
  MISSION_FIXTURE,
} from "@/test/fixtures";

/** The canvas's cast: Nordlys on a daily mission, Vesterhus on a small one. */
const nordlys = {
  ...CLIENT_FIXTURE,
  slug: "nordlys",
  name: "Nordlys",
} satisfies ClientData;

const vesterhus = {
  ...CLIENT_FIXTURE,
  id: 2,
  color: 3,
} satisfies ClientData;

const orvellaFront = {
  ...MISSION_FIXTURE,
  slug: "orvella-front",
  name: "Orvella front",
} satisfies MissionData;

const refonteBoutique = {
  ...MISSION_FIXTURE,
  id: 11,
  slug: "refonte-boutique",
  clientId: 2,
  name: "Refonte boutique",
} satisfies MissionData;

const CANVAS_INVOICE: Partial<InvoiceData> = {
  id: 41,
  number: "F-2026-041",
  issuedOn: "2026-07-31",
  dueOn: "2026-09-14",
  periodStart: "2026-07-01",
  periodEnd: "2026-07-31",
  amountHt: eur(1_045_000),
  amountVat: eur(209_000),
  amountTtc: eur(1_254_000),
};

export function revenueInvoiceItem(
  overrides: Partial<InvoiceData> = {},
  context: Partial<Pick<InvoiceListItemData, "client" | "mission">> = {},
): InvoiceListItemData {
  return invoiceItem(
    { ...CANVAS_INVOICE, ...overrides },
    {
      client: context.client ?? nordlys,
      mission: context.mission === undefined ? orvellaFront : context.mission,
    },
  );
}

const PERIOD_INVOICES: InvoiceListItemData[] = [
  revenueInvoiceItem(),
  revenueInvoiceItem(
    {
      id: 42,
      clientId: 2,
      missionId: 11,
      number: "F-2026-042",
      issuedOn: "2026-07-28",
      amountHt: eur(96_000),
      amountVat: eur(19_200),
      amountTtc: eur(115_200),
    },
    { client: vesterhus, mission: refonteBoutique },
  ),
];

/** The design's July window: two quiet winter months, then a full spring. */
const MONTHS: RevenueMonthData[] = [
  { month: "2025-12", total: eur(0), inPeriod: false, shareBp: 0 },
  { month: "2026-01", total: eur(290_000), inPeriod: false, shareBp: 2_457 },
  { month: "2026-02", total: eur(0), inPeriod: false, shareBp: 0 },
  { month: "2026-03", total: eur(70_000), inPeriod: false, shareBp: 593 },
  { month: "2026-04", total: eur(0), inPeriod: false, shareBp: 0 },
  { month: "2026-05", total: eur(1_090_000), inPeriod: false, shareBp: 9_237 },
  { month: "2026-06", total: eur(1_178_000), inPeriod: false, shareBp: 10_000 },
  { month: "2026-07", total: eur(1_141_000), inPeriod: true, shareBp: 9_686 },
];

const CLIENTS: RevenueClientData[] = [
  {
    clientId: 1,
    clientName: "Nordlys",
    color: 0,
    invoiceCount: 1,
    total: eur(1_045_000),
    shareBp: 9_158,
  },
  {
    clientId: 2,
    clientName: "Vesterhus",
    color: 3,
    invoiceCount: 1,
    total: eur(96_000),
    shareBp: 842,
  },
];

export function revenueData(overrides: Partial<RevenueData> = {}): RevenueData {
  return {
    period: "2026-07",
    basis: 0,
    fellBack: false,
    lastActivePeriod: "2026-07",
    total: eur(1_141_000),
    previous: { period: "2026-06", total: eur(1_178_000), changeBp: -314 },
    vat: { amount: eur(228_200), rateBp: 2000 },
    net: { amount: eur(844_300), contributions: eur(296_700), rateBp: 2600 },
    months: MONTHS,
    invoices: PERIOD_INVOICES,
    clients: CLIENTS,
    ...overrides,
  };
}

/** An empty period, the way the API reports one: zeroed but fully shaped. */
export function emptyRevenueData(
  overrides: Partial<RevenueData> = {},
): RevenueData {
  return revenueData({
    period: "2025",
    total: eur(0),
    previous: { period: "2024", total: eur(0), changeBp: null },
    vat: { amount: eur(0), rateBp: 2000 },
    net: { amount: eur(0), contributions: eur(0), rateBp: 2600 },
    months: Array.from({ length: 12 }, (_, index) => ({
      month: `2025-${String(index + 1).padStart(2, "0")}`,
      total: eur(0),
      inPeriod: true,
      shareBp: 0,
    })),
    invoices: [],
    clients: [],
    lastActivePeriod: "2026",
    ...overrides,
  });
}

/** The invoice summary as this screen's callout reads it: two unbilled piles. */
export function revenueSummary(
  overrides: Partial<InvoiceSummaryData> = {},
): InvoiceSummaryData {
  return invoiceSummary({
    toCollect: { amount: eur(1_254_000), count: 1 },
    overdue: { amount: eur(0), count: 0, maxDaysLate: 0 },
    forecast: [
      { bucket: 1, amount: eur(1_254_000), shareBp: 10_000 },
      { bucket: 2, amount: eur(0), shareBp: 0 },
    ],
    counts: { all: 2, draft: 0, sent: 2, late: 0, paid: 0 },
    todo: [
      {
        kind: 1,
        amount: eur(165_000),
        clientId: 1,
        clientName: "Nordlys",
        work: {
          missionId: 10,
          missionName: "Orvella front",
          entryCount: 3,
          firstEntryOn: "2026-08-03",
          lastEntryOn: "2026-08-07",
          valuedDays: 3,
          valuedMinutes: null,
          timeEntryIds: [101, 102, 103],
        },
      },
      {
        kind: 1,
        amount: eur(29_800),
        clientId: 2,
        clientName: "Vesterhus",
        work: {
          missionId: 12,
          missionName: "Vesterhus maintenance",
          entryCount: 2,
          firstEntryOn: "2026-08-04",
          lastEntryOn: "2026-08-06",
          valuedDays: null,
          valuedMinutes: 210,
          timeEntryIds: [104, 105],
        },
      },
    ],
    ...overrides,
  });
}
