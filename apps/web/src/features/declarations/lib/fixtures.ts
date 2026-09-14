import type {
  AnnualDeclarationsData,
  CfeReturnData,
  DeclarationHistoryRowData,
  DeclarationSettlementData,
  DeclarationsData,
  IncomeTaxReturnData,
  UrssafDeclarationData,
  VatDeclarationData,
} from "@opusline/api-client";

import { eur } from "@/test/fixtures";

/** The canvas sample: 10 450 € collected over July, declared monthly. */
export function urssafDeclaration(
  overrides: Partial<UrssafDeclarationData> = {},
): UrssafDeclarationData {
  return {
    period: "2026-07",
    periodicity: 0,
    coversShownMonth: true,
    base: eur(1_045_000),
    invoiceCount: 3,
    lines: [
      { kind: 0, rateBp: 2610, amount: eur(272_745) },
      { kind: 1, rateBp: 20, amount: eur(2_090) },
      { kind: 2, rateBp: 220, amount: eur(22_990) },
    ],
    total: eur(297_825),
    deadline: { dueOn: "2026-08-31", daysLeft: 18 },
    completion: null,
    settlement: {
      expected: eur(297_825),
      provisioned: eur(297_825),
      gap: { amount: 0, currency: "EUR" },
      detectedPayments: eur(0),
    },
    ...overrides,
  };
}

/** July under réel normal: 10 450 € of sales, 112 € of deductible TVA. */
export function vatDeclaration(
  overrides: Partial<VatDeclarationData> = {},
): VatDeclarationData {
  return {
    period: "2026-07",
    regime: 2,
    rateBp: 2000,
    boxes: {
      salesHt: eur(1_045_000),
      intraCommunityPurchasesHt: eur(3_100),
      nonEuPurchasesHt: eur(6_800),
      taxableBase: eur(1_054_900),
      collected: eur(210_980),
      fixedAssets: eur(0),
      goodsAndServices: eur(13_180),
      otherDeductible: eur(0),
      creditCarried: eur(0),
      credit: eur(0),
      due: eur(197_800),
    },
    invoiceCount: 3,
    expenseCount: 9,
    reverseChargedVat: eur(1_980),
    creditIsRefundable: false,
    deadline: { dueOn: "2026-08-17", daysLeft: 4 },
    completion: null,
    settlement: {
      expected: eur(197_800),
      provisioned: eur(199_800),
      gap: { amount: 2_000, currency: "EUR" },
      detectedPayments: eur(0),
    },
    ...overrides,
  };
}

/** The compte pro holds less than the filing asks for. */
export function shortSettlement(): DeclarationSettlementData {
  return {
    expected: eur(297_825),
    provisioned: eur(250_000),
    gap: { amount: -47_825, currency: "EUR" },
    detectedPayments: eur(0),
  };
}

/** A period the engine no longer provisions for: the debit was found instead. */
export function settledSettlement(): DeclarationSettlementData {
  return {
    expected: eur(297_825),
    provisioned: null,
    gap: null,
    detectedPayments: eur(297_825),
  };
}

/** June's credit lands in box 22 and lowers July's tax to pay. */
export function creditCarriedVatDeclaration(): VatDeclarationData {
  return vatDeclaration({
    boxes: {
      ...vatDeclaration().boxes,
      creditCarried: eur(46_645),
      due: eur(151_155),
    },
  });
}

/** A month that ends in credit: nothing to pay, box 25 carried to the next CA3. */
export function creditVatDeclaration(): VatDeclarationData {
  return vatDeclaration({
    period: "2026-08",
    boxes: {
      salesHt: eur(275_000),
      intraCommunityPurchasesHt: eur(0),
      nonEuPurchasesHt: eur(4_800),
      taxableBase: eur(279_800),
      collected: eur(55_960),
      fixedAssets: eur(0),
      goodsAndServices: eur(102_605),
      otherDeductible: eur(0),
      creditCarried: eur(0),
      credit: eur(46_645),
      due: eur(0),
    },
    invoiceCount: 1,
    expenseCount: 6,
    reverseChargedVat: eur(960),
    deadline: { dueOn: "2026-09-15", daysLeft: -3 },
    settlement: {
      expected: eur(0),
      provisioned: null,
      gap: null,
      detectedPayments: eur(0),
    },
  });
}

export function historyRow(
  overrides: Partial<DeclarationHistoryRowData> = {},
): DeclarationHistoryRowData {
  return {
    period: "2026-07",
    urssaf: {
      period: "2026-07",
      total: eur(297_825),
      completion: null,
    },
    vat: { due: eur(197_800), credit: eur(0), completion: null },
    ...overrides,
  };
}

export function incomeTaxReturn(
  overrides: Partial<IncomeTaxReturnData> = {},
): IncomeTaxReturnData {
  const bases = [
    810_000, 990_000, 825_000, 1_100_000, 935_000, 1_045_000, 975_000, 0, 0, 0,
    0, 0,
  ];
  const declaredOn = [
    "2026-02-28",
    "2026-03-31",
    "2026-04-30",
    "2026-05-31",
    "2026-06-30",
    "2026-07-28",
    "2026-08-31",
  ];

  return {
    year: 2026,
    dueOn: "2027-05-28",
    grossReceipts: eur(6_680_000),
    box: 0,
    periods: bases.map((base, index) => ({
      period: `2026-${String(index + 1).padStart(2, "0")}`,
      base: eur(base),
      declaredOn: declaredOn[index] ?? null,
    })),
    taxableAfterAbatement: eur(4_408_800),
    liberatingPaymentPaid: eur(146_960),
    completion: null,
    ...overrides,
  };
}

/** The running year's CFE, guessed from last year's bill, nine twelfths set aside. */
export function cfeReturn(
  overrides: Partial<CfeReturnData> = {},
): CfeReturnData {
  return {
    year: 2026,
    dueOn: "2026-12-15",
    expected: eur(31_200),
    isEstimate: true,
    provisioned: eur(23_400),
    gap: { amount: -7_800, currency: "EUR" },
    monthsProvisioned: 9,
    completion: null,
    ...overrides,
  };
}

export function annualDeclarations(
  overrides: Partial<AnnualDeclarationsData> = {},
): AnnualDeclarationsData {
  return { incomeTaxReturn: incomeTaxReturn(), cfe: cfeReturn(), ...overrides };
}

export function declarationsData(
  overrides: Partial<DeclarationsData> = {},
): DeclarationsData {
  return {
    period: "2026-07",
    previousPeriod: "2026-06",
    nextPeriod: "2026-08",
    isDefault: true,
    urssaf: urssafDeclaration(),
    vat: vatDeclaration(),
    cumulative: {
      year: 2026,
      collectedHt: eur(6_680_000),
      ceiling: eur(7_770_000),
      shareBp: 8597,
      margin: { amount: 1_090_000, currency: "EUR" },
    },
    history: [
      historyRow(),
      historyRow({
        period: "2026-06",
        urssaf: {
          period: "2026-06",
          total: eur(297_825),
          completion: { declaredOn: "2026-07-28", paidOn: "2026-07-31" },
        },
        vat: {
          due: eur(0),
          credit: eur(46_600),
          completion: { declaredOn: "2026-07-14", paidOn: null },
        },
      }),
      historyRow({
        period: "2026-05",
        urssaf: {
          period: "2026-05",
          total: eur(266_475),
          completion: { declaredOn: "2026-06-29", paidOn: "2026-06-30" },
        },
        vat: {
          due: eur(180_200),
          credit: eur(0),
          completion: { declaredOn: "2026-06-15", paidOn: "2026-06-15" },
        },
      }),
    ],
    annual: annualDeclarations(),
    ...overrides,
  };
}

/** Both declarations of the month marked filed, the URSSAF one paid. */
export function filedDeclarationsData(): DeclarationsData {
  const urssaf = urssafDeclaration({
    completion: { declaredOn: "2026-08-09", paidOn: "2026-08-12" },
  });
  const vat = vatDeclaration({
    completion: { declaredOn: "2026-08-09", paidOn: null },
  });
  const data = declarationsData({ urssaf, vat });

  return {
    ...data,
    history: [
      historyRow({
        urssaf: {
          period: "2026-07",
          total: urssaf.total,
          completion: urssaf.completion,
        },
        vat: {
          due: vat.boxes.due,
          credit: vat.boxes.credit,
          completion: vat.completion,
        },
      }),
      ...data.history.slice(1),
    ],
  };
}

/** A month before the business started: a zero card without a deadline, nothing to file. */
export function beforeStartDeclarationsData(): DeclarationsData {
  const zero = { amount: 0, currency: "EUR" } as const;

  return declarationsData({
    period: "2025-03",
    previousPeriod: "2025-02",
    urssaf: urssafDeclaration({
      period: "2025-03",
      base: eur(0),
      invoiceCount: 0,
      lines: [
        { kind: 0, rateBp: 2610, amount: eur(0) },
        { kind: 1, rateBp: 20, amount: eur(0) },
        { kind: 2, rateBp: 220, amount: eur(0) },
      ],
      total: eur(0),
      deadline: null,
      settlement: {
        expected: eur(0),
        provisioned: null,
        gap: null,
        detectedPayments: eur(0),
      },
    }),
    vat: null,
    cumulative: {
      year: 2025,
      collectedHt: eur(0),
      ceiling: eur(7_770_000),
      shareBp: 0,
      margin: { amount: 7_770_000, currency: "EUR" },
    },
    history: [
      historyRow({
        period: "2025-03",
        urssaf: { period: "2025-03", total: zero, completion: null },
        vat: null,
      }),
    ],
  });
}
