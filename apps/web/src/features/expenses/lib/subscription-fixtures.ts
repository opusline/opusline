import type { SubscriptionData, SubscriptionsData } from "@opusline/api-client";

import { eur } from "@/test/fixtures";

/** The account's today for every subscription fixture: the strips end on August 2026. */
export const SUBSCRIPTIONS_TODAY = "2026-08-20";

/** Twelve months ending on the sample today. */
function months(): string[] {
  return [
    "2025-09",
    "2025-10",
    "2025-11",
    "2025-12",
    "2026-01",
    "2026-02",
    "2026-03",
    "2026-04",
    "2026-05",
    "2026-06",
    "2026-07",
    "2026-08",
  ];
}

/** Nordlys Cloud: 24 € HT a month on the 1st, every receipt but July's linked. */
export function subscription(
  overrides: Partial<SubscriptionData> = {},
): SubscriptionData {
  return {
    id: 4,
    supplier: "Nordlys Cloud",
    category: 5,
    description: "VPS + domaine",
    amountHt: eur(2_400),
    vat: eur(480),
    amountTtc: eur(2_880),
    recoverableVat: eur(480),
    proShareBp: 10_000,
    vatTreatment: 0,
    vatRateBp: 2_000,
    periodicity: 0,
    debitDay: 1,
    debitMonth: null,
    startedOn: "2025-03-01",
    customerSpaceUrl: "https://espace.nordlys.example",
    autoCreateExpenses: true,
    provisionMonthly: false,
    monthlyProvision: null,
    isPaused: false,
    cancelledOn: null,
    nextDebitOn: "2026-09-01",
    amounts: [
      { effectiveFrom: "2025-03-01", amountHt: eur(1_900) },
      { effectiveFrom: "2026-06-01", amountHt: eur(2_400) },
    ],
    occurrences: months().map((period, index) => ({
      period,
      debitOn: `${period}-01`,
      state: period === "2026-07" ? 1 : 0,
      expenseId: 100 + index,
    })),
    ...overrides,
  };
}

/** Callisto Télécom: a 70 % pro phone line, reverse-charged from the EU. */
export function reverseChargedSubscription(): SubscriptionData {
  return subscription({
    id: 6,
    supplier: "Callisto Télécom",
    category: 3,
    description: "Forfait mobile pro",
    amountHt: eur(2_417),
    vat: eur(483),
    amountTtc: eur(2_417),
    recoverableVat: eur(338),
    proShareBp: 7_000,
    vatTreatment: 1,
    debitDay: 12,
    startedOn: "2024-11-12",
    customerSpaceUrl: null,
    nextDebitOn: "2026-09-12",
    amounts: [{ effectiveFrom: "2024-11-12", amountHt: eur(2_417) }],
    occurrences: months().map((period, index) => ({
      period,
      debitOn: `${period}-12`,
      state: 0,
      expenseId: 200 + index,
    })),
  });
}

/** Orvella Assurances: 312 € TTC once a year in January, provisioned monthly. */
export function annualSubscription(): SubscriptionData {
  return subscription({
    id: 7,
    supplier: "Orvella Assurances",
    category: 10,
    description: "RC pro",
    amountHt: eur(31_200),
    vat: eur(0),
    amountTtc: eur(31_200),
    recoverableVat: eur(0),
    vatTreatment: 3,
    vatRateBp: 0,
    periodicity: 2,
    debitDay: 15,
    debitMonth: 1,
    startedOn: "2025-01-15",
    customerSpaceUrl: null,
    provisionMonthly: true,
    monthlyProvision: eur(2_600),
    nextDebitOn: "2027-01-15",
    amounts: [{ effectiveFrom: "2025-01-15", amountHt: eur(31_200) }],
    occurrences: [
      { period: "2026", debitOn: "2026-01-15", state: 0, expenseId: 310 },
    ],
  });
}

/** Vesterhus Énergie: paused since the office move, this month's debit held. */
export function pausedSubscription(): SubscriptionData {
  return subscription({
    id: 8,
    supplier: "Vesterhus Énergie",
    category: 4,
    description: "Électricité du bureau",
    amountHt: eur(7_000),
    vat: eur(1_400),
    amountTtc: eur(8_400),
    recoverableVat: eur(1_400),
    debitDay: 28,
    customerSpaceUrl: null,
    isPaused: true,
    nextDebitOn: null,
    amounts: [{ effectiveFrom: "2025-03-28", amountHt: eur(7_000) }],
    occurrences: months().map((period, index) => ({
      period,
      debitOn: `${period}-28`,
      state: period === "2026-08" ? 3 : 0,
      expenseId: period === "2026-08" ? null : 400 + index,
    })),
  });
}

/** Lunaprint: cancelled in June, its past debits kept. */
export function cancelledSubscription(): SubscriptionData {
  return subscription({
    id: 9,
    supplier: "Lunaprint",
    category: 1,
    description: "Maquettes",
    amountHt: eur(1_200),
    vat: eur(240),
    amountTtc: eur(1_440),
    recoverableVat: eur(240),
    debitDay: 5,
    customerSpaceUrl: null,
    cancelledOn: "2026-06-05",
    nextDebitOn: null,
    amounts: [{ effectiveFrom: "2025-03-05", amountHt: eur(1_200) }],
    occurrences: months()
      .filter((period) => period <= "2026-06")
      .map((period, index) => ({
        period,
        debitOn: `${period}-05`,
        state: 0,
        expenseId: 500 + index,
      })),
  });
}

export function subscriptionsData(
  overrides: Partial<SubscriptionsData> = {},
): SubscriptionsData {
  return {
    // The server leaves the paused row out of the monthly figure and sums
    // only the annual subscriptions under « Annuel ».
    kpis: {
      monthlyTtc: eur(5_297),
      monthlyCount: 2,
      yearlyTtc: eur(31_200),
      annualCount: 1,
      provisionedCount: 1,
      provisionedPerMonth: eur(2_600),
      recoverableVatPerYear: eur(26_616),
      reverseChargedVatPerYear: eur(5_796),
      missingReceipts: 1,
    },
    subscriptions: [
      subscription(),
      reverseChargedSubscription(),
      annualSubscription(),
      pausedSubscription(),
      cancelledSubscription(),
    ],
    upcoming: [
      {
        subscriptionId: 4,
        supplier: "Nordlys Cloud",
        dueOn: "2026-09-01",
        amountTtc: eur(2_880),
        periodicity: 0,
        isProvision: false,
      },
      {
        subscriptionId: 6,
        supplier: "Callisto Télécom",
        dueOn: "2026-09-12",
        amountTtc: eur(2_417),
        periodicity: 0,
        isProvision: false,
      },
      {
        subscriptionId: 7,
        supplier: "Orvella Assurances",
        dueOn: "2026-08-30",
        amountTtc: eur(2_600),
        periodicity: 2,
        isProvision: true,
      },
    ],
    categories: [
      { category: 10, yearlyHt: eur(31_200) },
      { category: 5, yearlyHt: eur(28_800) },
      { category: 3, yearlyHt: eur(29_004) },
      { category: 4, yearlyHt: eur(84_000) },
    ],
    yearlyHt: eur(173_004),
    amountChanges: [
      {
        subscriptionId: 4,
        supplier: "Nordlys Cloud",
        before: eur(1_900),
        after: eur(2_400),
        changeBp: 2_632,
        since: "2026-06-01",
      },
    ],
    detected: [
      {
        label: "PRLV SEPA ATELIERS RUCHE",
        amount: eur(4_900),
        debitDay: 20,
        months: ["2026-06", "2026-07", "2026-08"],
        lastBookedOn: "2026-08-20",
      },
    ],
    ...overrides,
  };
}

export function emptySubscriptionsData(): SubscriptionsData {
  return subscriptionsData({
    kpis: {
      monthlyTtc: eur(0),
      monthlyCount: 0,
      yearlyTtc: eur(0),
      annualCount: 0,
      provisionedCount: 0,
      provisionedPerMonth: eur(0),
      recoverableVatPerYear: eur(0),
      reverseChargedVatPerYear: eur(0),
      missingReceipts: 0,
    },
    subscriptions: [],
    upcoming: [],
    categories: [],
    yearlyHt: eur(0),
    amountChanges: [],
    detected: [],
  });
}
