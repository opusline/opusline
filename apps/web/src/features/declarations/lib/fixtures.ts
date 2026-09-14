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
    deadline: { dueOn: "2026-08-31", daysLeft: 18 },
    completion: null,
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
    ...overrides,
  };
}
