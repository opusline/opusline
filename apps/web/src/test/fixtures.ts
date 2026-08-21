import type {
  ClientData,
  ClientRevenueData,
  ClientRevenueDetailData,
  FixedPriceBudgetData,
  InvoiceData,
  InvoiceListItemData,
  InvoiceSummaryData,
  InvoiceTodoData,
  MissionData,
  MissionRevenueData,
  MoneyData,
  PersonalTransferData,
  TreasuryData,
} from "@opusline/api-client";

/**
 * The base API-shape fixtures more than one place needs. Features must not
 * import each other, and `src/components` may not import a feature at all, so
 * the shapes they each specialize live here.
 */

export function eur(amount: number): MoneyData {
  return { amount, currency: "EUR" };
}

/**
 * The revenue figures as the API returns them, for client id 1 and mission id 1
 * — the ids CLIENT_FIXTURE and MISSION_FIXTURE use, and the ones the clients and
 * missions detail suites stub. One definition per figure so the two per-resource
 * payloads cannot drift apart.
 */
function missionRevenue(): MissionRevenueData {
  return {
    missionId: 1,
    yearToDate: eur(4_820_000),
    currentMonth: eur(605_000),
    total: eur(7_150_000),
    monthlyAverage: eur(447_000),
    currentMonthDays: 12.5,
    currentMonthMinutes: null,
  };
}

function clientRevenue(): ClientRevenueData {
  return {
    clientId: 1,
    yearToDate: eur(4_820_000),
    pending: eur(960_000),
    averagePaymentDelayDays: 27,
    missions: [missionRevenue()],
  };
}

/** GET /api/clients/{client}/revenue */
export function clientRevenueDetailPayload(): ClientRevenueDetailData {
  return { year: 2026, revenue: clientRevenue() };
}

/** GET /api/clients/{client}/missions/{mission}/revenue */
export function missionRevenueDetailPayload(): MissionRevenueData {
  return missionRevenue();
}

/**
 * A forfait as the design states it: 10 000 € priced, a 480 € reference TJM, 18 days
 * tracked — 86 % consumed, with 2 880 € invoiced and 1 440 € held by a draft.
 */
export function fixedPriceBudget(
  overrides: Partial<FixedPriceBudgetData> = {},
): FixedPriceBudgetData {
  return {
    forfait: eur(1_000_000),
    invoiced: eur(288_000),
    draft: eur(144_000),
    remaining: eur(568_000),
    invoicedShareBp: 2_880,
    consumption: {
      referenceDailyRate: eur(48_000),
      trackedDays: 18,
      consumed: eur(864_000),
      consumedShareBp: 8_640,
      coveredDays: 20.833_333,
      remainingDays: 2.833_333,
      overrun: eur(0),
      state: 1,
    },
    ...overrides,
  };
}

/** The same forfait once the time tracked has eaten past its price. */
export function overrunFixedPriceBudget(): FixedPriceBudgetData {
  return fixedPriceBudget({
    forfait: eur(480_000),
    invoiced: eur(240_000),
    draft: eur(0),
    remaining: eur(240_000),
    invoicedShareBp: 5_000,
    consumption: {
      referenceDailyRate: eur(55_000),
      trackedDays: 11,
      consumed: eur(605_000),
      consumedShareBp: 12_604,
      coveredDays: 8.727_272,
      remainingDays: -2.272_727,
      overrun: eur(125_000),
      state: 2,
    },
  });
}

export const CLIENT_FIXTURE = {
  id: 1,
  slug: "vesterhus",
  name: "Vesterhus",
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
  createdAt: "2026-01-05T09:00:00+00:00",
} satisfies ClientData;

export const MISSION_FIXTURE = {
  id: 10,
  slug: "refonte-catalogue",
  clientId: 1,
  name: "Refonte catalogue",
  endClientName: null,
  billingMode: 0,
  rate: eur(55_000),
  referenceDailyRate: null,
  rounding: 0,
  status: 0,
  craRequired: false,
  color: null,
  notes: null,
  startDate: null,
  endDate: null,
} satisfies MissionData;

export const INVOICE_FIXTURE = {
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
  amountHt: eur(165_000),
  amountVat: eur(33_000),
  amountTtc: eur(198_000),
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
    invoice: { ...INVOICE_FIXTURE, ...overrides },
    client: context.client ?? CLIENT_FIXTURE,
    mission: context.mission === undefined ? MISSION_FIXTURE : context.mission,
  };
}

export const OVERDUE_TODO = {
  kind: 0,
  amount: eur(375_600),
  clientId: 1,
  clientName: "Vesterhus",
  overdue: {
    invoiceId: 36,
    number: "F-2026-036",
    dueOn: "2026-06-30",
    daysLate: 41,
  },
} satisfies InvoiceTodoData;

export const UNBILLED_TODO = {
  kind: 1,
  amount: eur(165_000),
  clientId: 2,
  clientName: "Orvella",
  work: {
    missionId: 20,
    missionName: "Orvella front",
    entryCount: 3,
    firstEntryOn: "2026-08-03",
    lastEntryOn: "2026-08-07",
    valuedDays: 3,
    valuedMinutes: null,
    timeEntryIds: [101, 102, 103],
    vatRateBp: 2000,
  },
} satisfies InvoiceTodoData;

/** A forfait row: still within budget, with a balance left to invoice. */
export const BUDGET_TODO = {
  kind: 2,
  amount: eur(568_000),
  clientId: 2,
  clientName: "Orvella",
  budget: {
    missionId: 21,
    missionName: "Orvella refonte boutique",
    missionSlug: "orvella-refonte-boutique",
    clientSlug: "orvella",
    budget: fixedPriceBudget(),
    vatRateBp: 2000,
  },
} satisfies InvoiceTodoData;

/** The same forfait once the time tracked has eaten past its price. */
export const BUDGET_OVERRUN_TODO = {
  ...BUDGET_TODO,
  kind: 3,
  amount: eur(125_000),
  budget: { ...BUDGET_TODO.budget, budget: overrunFixedPriceBudget() },
} satisfies InvoiceTodoData;

export function invoiceSummary(
  overrides: Partial<InvoiceSummaryData> = {},
): InvoiceSummaryData {
  return {
    month: "2026-08",
    toCollect: { amount: eur(1_744_800), count: 5 },
    overdue: {
      amount: eur(375_600),
      count: 3,
      maxDaysLate: 147,
    },
    forecast: [
      { bucket: 1, amount: eur(1_369_200), shareBp: 10_000 },
      { bucket: 2, amount: eur(0), shareBp: 0 },
    ],
    monthUnbilled: { amount: eur(165_000), count: 2 },
    unbilled: { amount: eur(194_800), count: 2 },
    counts: { all: 9, draft: 1, sent: 5, late: 3, paid: 3 },
    todo: [OVERDUE_TODO, UNBILLED_TODO],
    todoTotal: 2,
    ...overrides,
  };
}

export function personalTransfer(
  overrides: Partial<PersonalTransferData> = {},
): PersonalTransferData {
  return {
    id: 1,
    transferredOn: "2026-07-28",
    amount: eur(680_000),
    note: "Salaire juillet",
    reflectedInBalance: true,
    ...overrides,
  };
}

/**
 * The pro account the design canvas is drawn from: 14 820 € held, 8 513 € the
 * user's. Read by the Virement feature and by the sidebar tile that mirrors its
 * headline figure, which sits below features and cannot reach into one.
 */
export function treasuryData(
  overrides: Partial<TreasuryData> = {},
): TreasuryData {
  return {
    balance: { amount: eur(1_482_000), source: 1, asOf: "2026-08-10" },
    pendingTransfers: eur(0),
    coveredThrough: "2026-08-10",
    provisions: {
      vat: {
        amount: eur(209_000),
        rateBp: null,
        periodEnd: "2026-08-31",
      },
      urssaf: {
        amount: eur(271_700),
        rateBp: 2600,
        periodEnd: "2026-08-31",
      },
      buffer: eur(150_000),
      total: eur(630_700),
    },
    transferable: eur(851_300),
    transfers: [
      personalTransfer(),
      personalTransfer({
        id: 2,
        transferredOn: "2026-06-28",
        amount: eur(650_000),
        note: "Salaire juin",
      }),
    ],
    ...overrides,
  };
}
