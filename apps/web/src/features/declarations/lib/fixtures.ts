import type {
  DeclarationsData,
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

export function vatDeclaration(
  overrides: Partial<VatDeclarationData> = {},
): VatDeclarationData {
  return {
    period: "2026-07",
    regime: 2,
    salesHt: eur(1_045_000),
    collected: eur(209_000),
    rateBp: 2000,
    boxes: {
      salesHt: eur(1_045_000),
      intraCommunityPurchasesHt: eur(0),
      nonEuPurchasesHt: eur(0),
      taxableBase: eur(1_045_000),
      collected: eur(209_000),
      fixedAssets: eur(0),
      goodsAndServices: eur(0),
      otherDeductible: eur(0),
      creditCarried: eur(0),
      credit: eur(0),
      due: eur(209_000),
    },
    invoiceCount: 3,
    expenseCount: 0,
    reverseChargedVat: eur(0),
    creditIsRefundable: false,
    deadline: { dueOn: "2026-08-17", daysLeft: 4 },
    completion: null,
    settlement: {
      expected: eur(209_000),
      provisioned: eur(209_000),
      gap: { amount: 0, currency: "EUR" },
      detectedPayments: eur(0),
    },
    ...overrides,
  };
}

export function declarationsData(
  overrides: Partial<DeclarationsData> = {},
): DeclarationsData {
  return {
    period: "2026-07",
    previousPeriod: "2026-06",
    nextPeriod: null,
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
    history: [],
    ...overrides,
  };
}
