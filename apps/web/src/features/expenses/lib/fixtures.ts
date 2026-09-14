import type {
  ExpenseData,
  ExpensesMonthData,
  ExpenseTodoData,
} from "@opusline/api-client";

import { eur } from "@/test/fixtures";

/** A receipted French 20 % purchase, deductible on the August CA3. */
export function expense(overrides: Partial<ExpenseData> = {}): ExpenseData {
  return {
    id: 1,
    supplier: "Lunaprint",
    spentOn: "2026-08-21",
    category: 0,
    description: "Écran 27 pouces",
    amountHt: eur(35_750),
    vat: eur(7_150),
    amountTtc: eur(42_900),
    recoverableVat: eur(7_150),
    vatTreatment: 0,
    vatRateBp: 2_000,
    proShareBp: 10_000,
    receipt: {
      id: 9,
      fileName: "lunaprint-facture-9921.pdf",
      sizeBytes: 184_000,
    },
    subscription: null,
    bankMovement: null,
    vatStatus: 0,
    vatClaimPeriod: "2026-08",
    isRegularisation: false,
    ...overrides,
  };
}

export function blockedExpense(): ExpenseData {
  return expense({
    id: 2,
    supplier: "Vesterhus Énergie",
    spentOn: "2026-08-12",
    category: 4,
    description: "Prélèvement du 12",
    amountHt: eur(7_000),
    vat: eur(1_400),
    amountTtc: eur(8_400),
    recoverableVat: eur(1_400),
    receipt: null,
    subscription: { id: 4, supplier: "Vesterhus Énergie", periodicity: 0 },
    vatStatus: 3,
  });
}

export function reverseChargedExpense(): ExpenseData {
  return expense({
    id: 3,
    supplier: "Orvella Cloud",
    spentOn: "2026-08-15",
    category: 1,
    description: "Organisation · 2 sièges",
    amountHt: eur(4_800),
    vat: eur(0),
    amountTtc: eur(4_800),
    recoverableVat: eur(960),
    vatTreatment: 2,
    receipt: { id: 10, fileName: "orvella-2026-08.pdf", sizeBytes: 92_000 },
    subscription: { id: 5, supplier: "Orvella Cloud", periodicity: 0 },
    vatStatus: 4,
  });
}

export function deferredExpense(): ExpenseData {
  return expense({
    id: 4,
    supplier: "Callisto Télécom",
    spentOn: "2026-08-05",
    category: 3,
    description: "Forfait mobile",
    amountHt: eur(2_417),
    vat: eur(483),
    amountTtc: eur(2_900),
    recoverableVat: eur(338),
    proShareBp: 7_000,
    receipt: { id: 11, fileName: "callisto-aout.pdf", sizeBytes: 61_000 },
    subscription: { id: 6, supplier: "Callisto Télécom", periodicity: 0 },
    vatStatus: 2,
    vatClaimPeriod: "2026-09",
  });
}

export function mealExpense(): ExpenseData {
  return expense({
    id: 5,
    supplier: "Maison Vesterhus",
    spentOn: "2026-08-24",
    category: 7,
    description: "Déjeuner Nordlys",
    amountHt: eur(4_182),
    vat: eur(418),
    amountTtc: eur(4_600),
    recoverableVat: eur(418),
    vatRateBp: 1_000,
    receipt: null,
    vatStatus: 3,
  });
}

export function exemptExpense(): ExpenseData {
  return expense({
    id: 6,
    supplier: "Orvella Assurances",
    spentOn: "2026-08-01",
    category: 10,
    description: "RC Pro · échéance annuelle",
    amountHt: eur(31_200),
    vat: eur(0),
    amountTtc: eur(31_200),
    recoverableVat: eur(0),
    vatTreatment: 3,
    vatRateBp: 0,
    receipt: {
      id: 12,
      fileName: "orvella-rc-pro-2026.pdf",
      sizeBytes: 120_000,
    },
    vatStatus: 5,
  });
}

function missingReceiptTodo(): ExpenseTodoData {
  return {
    kind: 0,
    expenseId: 2,
    subscriptionId: 4,
    bankMovementId: null,
    label: "Vesterhus Énergie",
    amount: eur(8_400),
    date: "2026-08-12",
  };
}

/** August 2026, réel normal, not yet declared: one of each status. */
export function expensesMonth(
  overrides: Partial<ExpensesMonthData> = {},
): ExpensesMonthData {
  return {
    month: "2026-08",
    declaredOn: null,
    vat: {
      deductible: eur(7_150),
      blocked: eur(1_818),
      blockedCount: 2,
      reverseCharged: eur(960),
      deferred: eur(338),
      collected: eur(55_000),
      balance: eur(47_850),
    },
    totals: { ht: eur(85_349), ttc: eur(94_800), count: 6 },
    subscriptions: {
      monthlyHt: eur(14_217),
      monthlyTtc: eur(16_100),
      yearlyHt: eur(201_804),
      yearlyTtc: eur(224_400),
      count: 3,
      annualCount: 1,
    },
    categories: [
      { category: 0, ht: eur(35_750), ttc: eur(42_900), shareBp: 4_189 },
      { category: 10, ht: eur(31_200), ttc: eur(31_200), shareBp: 3_656 },
      { category: null, ht: eur(14_217), ttc: eur(16_100), shareBp: 1_666 },
      { category: 7, ht: eur(4_182), ttc: eur(4_600), shareBp: 490 },
    ],
    series: [
      ["2025-09", 41_200],
      ["2025-10", 50_500],
      ["2025-11", 38_800],
      ["2025-12", 61_200],
      ["2026-01", 45_500],
      ["2026-02", 53_000],
      ["2026-03", 69_000],
      ["2026-04", 52_200],
      ["2026-05", 60_400],
      ["2026-06", 57_800],
      ["2026-07", 104_852],
      ["2026-08", 85_349],
    ].map(([month, ht]) => ({
      month: String(month),
      ht: eur(Number(ht)),
      ttc: eur(Math.round(Number(ht) * 1.17)),
    })),
    projection: {
      projectedChargesHt: eur(1_055_388),
      annualRevenueHt: eur(12_540_000),
      abatement: eur(4_263_600),
      microIsFavourable: true,
    },
    todo: [missingReceiptTodo()],
    expenses: [
      mealExpense(),
      expense(),
      reverseChargedExpense(),
      blockedExpense(),
      deferredExpense(),
      exemptExpense(),
    ],
    ...overrides,
  };
}

/** The same month once its CA3 has been filed: statuses locked, deductions done. */
export function declaredExpensesMonth(): ExpensesMonthData {
  const month = expensesMonth({ declaredOn: "2026-09-09" });

  return {
    ...month,
    expenses: month.expenses.map((row) =>
      row.vatStatus === 0 ? { ...row, vatStatus: 1 } : row,
    ),
  };
}

/** A franchise en base account: no TVA anywhere, the pill only tracks the receipt. */
export function franchiseExpensesMonth(): ExpensesMonthData {
  const month = expensesMonth();

  return {
    ...month,
    vat: null,
    projection: null,
    expenses: month.expenses.map((row) => ({
      ...row,
      vatTreatment: 0,
      vatRateBp: 0,
      vat: eur(0),
      recoverableVat: eur(0),
      amountHt: row.amountTtc,
      vatStatus: 5,
    })),
  };
}

export function emptyExpensesMonth(): ExpensesMonthData {
  return expensesMonth({
    totals: { ht: eur(0), ttc: eur(0), count: 0 },
    categories: [],
    todo: [],
    expenses: [],
    subscriptions: null,
  });
}
