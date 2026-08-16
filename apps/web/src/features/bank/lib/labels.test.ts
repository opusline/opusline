import { describe, expect, it } from "vitest";

import type { MoneyFormat } from "@/lib/billing";

import { bankData, bankStatement, emptyBankData } from "./fixtures";
import {
  movementsSourceNote,
  reconciliationNote,
  signedAmountLabel,
} from "./labels";

const NARROW_NBSP = "\u202f";
const NBSP = "\u00a0";

const EUR: MoneyFormat = { locale: "fr-FR", currency: "EUR" };

describe("signedAmountLabel", () => {
  it("prefixes credits with an explicit plus", () => {
    expect(signedAmountLabel(EUR, 61_200)).toBe(`+ 612,00${NBSP}€`);
  });

  it("shows debits with a minus and the magnitude", () => {
    expect(signedAmountLabel(EUR, -243_100)).toBe(
      `− 2${NARROW_NBSP}431,00${NBSP}€`,
    );
  });

  it("treats zero as a credit", () => {
    expect(signedAmountLabel(EUR, 0)).toBe(`+ 0,00${NBSP}€`);
  });
});

describe("reconciliation note", () => {
  it("counts the validated suggestions of the newest statement", () => {
    expect(reconciliationNote(0, bankData())).toBe(
      "Relevé du 01/08/2026 au 10/08/2026 · 1 sur 3 validées",
    );
  });

  it("says everything is handled once nothing is pending", () => {
    const data = bankData({
      pendingMatches: [],
      statements: [bankStatement({ matchCount: 3, validatedMatchCount: 3 })],
    });

    expect(reconciliationNote(0, data)).toBe(
      "Relevé du 01/08/2026 au 10/08/2026 · tout est traité",
    );
  });

  it("skips a re-imported statement that raised nothing", () => {
    const data = bankData({
      statements: [
        bankStatement({
          id: 3,
          periodStart: "2026-08-05",
          periodEnd: "2026-08-12",
          matchCount: 0,
          validatedMatchCount: 0,
        }),
        bankStatement(),
      ],
    });

    expect(reconciliationNote(0, data)).toBe(
      "Relevé du 01/08/2026 au 10/08/2026 · 1 sur 3 validées",
    );
  });

  it("falls back when nothing was imported", () => {
    expect(reconciliationNote(0, emptyBankData())).toBe("Aucun relevé importé");
  });
});

describe("movements source note", () => {
  it("cites the newest statement", () => {
    expect(movementsSourceNote(0, bankData())).toBe(
      "Relevé du 01/08/2026 au 10/08/2026, importé le 10/08/2026",
    );
  });

  it("falls back to the manual wording", () => {
    expect(movementsSourceNote(0, emptyBankData())).toBe(
      "Saisis à la main · aucun relevé importé",
    );
  });
});
