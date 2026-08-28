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
    base: eur(1_045_000),
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
    ...overrides,
  };
}

export function declarationsData(
  overrides: Partial<DeclarationsData> = {},
): DeclarationsData {
  return {
    urssaf: urssafDeclaration(),
    vat: vatDeclaration(),
    ...overrides,
  };
}
