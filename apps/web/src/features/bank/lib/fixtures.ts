import type {
  BankAccountData,
  BankMatchData,
  BankMovementData,
  BankStatementData,
} from "@opusline/api-client";

import { eur } from "@/test/fixtures";

export function bankStatement(
  overrides: Partial<BankStatementData> = {},
): BankStatementData {
  return {
    id: 1,
    fileName: "releve-compte-pro-aout-2026.csv",
    periodStart: "2026-08-01",
    periodEnd: "2026-08-10",
    lineCount: 12,
    importedAt: "2026-08-10",
    matchCount: 3,
    validatedMatchCount: 1,
    ...overrides,
  };
}

export function pendingMatch(
  overrides: Partial<BankMatchData> = {},
): BankMatchData {
  return {
    id: 11,
    reason: 0,
    movementId: 108,
    bookedOn: "2026-08-08",
    label: "VIR SEPA CALLISTO SA · REF 2026-041",
    amount: eur(1_254_000),
    invoice: { id: 41, number: "2026-041", clientName: "Callisto" },
    ...overrides,
  };
}

export function bankMovement(
  overrides: Partial<BankMovementData> = {},
): BankMovementData {
  return {
    id: 101,
    bookedOn: "2026-07-31",
    label: "ENCAISSEMENT 2026-040 · NORDLYS",
    amount: eur(61_200),
    runningBalance: eur(1_482_000),
    invoice: { id: 40, number: "2026-040" },
    pendingMatchId: null,
    ...overrides,
  };
}

/** The busy account: a fresh statement, pending suggestions, mixed movements. */
export function bankData(
  overrides: Partial<BankAccountData> = {},
): BankAccountData {
  return {
    balance: {
      amount: eur(1_482_000),
      source: 1,
      asOf: "2026-08-10",
    },
    provisions: {
      vat: { amount: eur(199_400), rateBp: null },
      urssaf: { amount: eur(271_700), rateBp: 2560 },
      buffer: eur(150_000),
      total: eur(621_100),
    },
    pendingMatches: [
      pendingMatch(),
      pendingMatch({
        id: 12,
        reason: 1,
        movementId: 109,
        bookedOn: "2026-08-07",
        label: "VIR VESTERHUS",
        amount: eur(115_200),
        invoice: { id: 42, number: "2026-042", clientName: "Vesterhus" },
      }),
      pendingMatch({
        id: 13,
        reason: 2,
        movementId: 110,
        bookedOn: "2026-08-04",
        label: "VIR SEPA 8375113",
        amount: eur(122_400),
        invoice: { id: 36, number: "2026-036", clientName: "Lunaprint" },
      }),
    ],
    movements: [
      bankMovement({
        id: 108,
        bookedOn: "2026-08-08",
        label: "VIR SEPA CALLISTO SA · REF 2026-041",
        amount: eur(1_254_000),
        runningBalance: eur(1_482_000),
        invoice: null,
        pendingMatchId: 11,
      }),
      bankMovement({
        id: 107,
        bookedOn: "2026-08-05",
        label: "PRLV URSSAF · JUIN",
        amount: eur(-243_100),
        runningBalance: eur(228_000),
        invoice: null,
      }),
      bankMovement({
        id: 106,
        bookedOn: "2026-07-31",
        label: "ENCAISSEMENT 2026-040 · NORDLYS",
        amount: eur(61_200),
        runningBalance: eur(471_100),
        invoice: { id: 40, number: "2026-040" },
      }),
      bankMovement({
        id: 105,
        bookedOn: "2026-07-15",
        label: "TELEREGLEMENT TVA · CA3 JUIN",
        amount: eur(-184_800),
        runningBalance: eur(409_900),
        invoice: null,
      }),
      bankMovement({
        id: 104,
        bookedOn: "2026-06-28",
        label: "VIREMENT COMPTE PERSO · SALAIRE JUIN",
        amount: eur(-680_000),
        runningBalance: eur(594_700),
        invoice: null,
      }),
    ],
    statements: [
      bankStatement(),
      bankStatement({
        id: 2,
        fileName: "releve-compte-pro-juillet-2026.csv",
        periodStart: "2026-07-01",
        periodEnd: "2026-07-31",
        lineCount: 9,
        importedAt: "2026-08-01",
        matchCount: 2,
        validatedMatchCount: 2,
      }),
    ],
    ...overrides,
  };
}

/** Statements without balance data: the balance is Σ of the movements. */
export function derivedBankData(): BankAccountData {
  const data = bankData({ pendingMatches: [] });
  const rolledFromZero = new Map<number, number>();
  let running = 0;

  for (const movement of [...data.movements].reverse()) {
    running += movement.amount.amount;
    rolledFromZero.set(movement.id, running);
  }

  return {
    ...data,
    balance: { amount: eur(running), source: 2, asOf: null },
    movements: data.movements.map((movement) => ({
      ...movement,
      runningBalance: eur(rolledFromZero.get(movement.id) ?? 0),
    })),
  };
}

/** Balance typed by hand, nothing imported yet. */
export function manualBankData(): BankAccountData {
  return bankData({
    balance: { amount: eur(742_000), source: 0, asOf: "2026-08-11" },
    pendingMatches: [],
    movements: [],
    statements: [],
  });
}

/** A statement imported and every credit linked to its invoice. */
export function reconciledBankData(): BankAccountData {
  const data = bankData({ pendingMatches: [] });

  return {
    ...data,
    movements: data.movements.map((movement) => ({
      ...movement,
      pendingMatchId: null,
      invoice:
        movement.amount.amount > 0 && movement.invoice === null
          ? { id: 41, number: "2026-041" }
          : movement.invoice,
    })),
    statements: [
      bankStatement({ matchCount: 3, validatedMatchCount: 3 }),
      ...data.statements.slice(1),
    ],
  };
}

/** No suggestions pending, but credits the matcher found nothing for. */
export function unlinkedCreditsBankData(): BankAccountData {
  const data = bankData({ pendingMatches: [] });

  return {
    ...data,
    movements: data.movements.map((movement) => ({
      ...movement,
      pendingMatchId: null,
    })),
  };
}

/** Franchise en base: no VAT provision to keep. */
export function noVatBankData(): BankAccountData {
  const data = bankData();

  return {
    ...data,
    provisions: {
      ...data.provisions,
      vat: null,
      total: eur(421_700),
    },
  };
}

/** Untouched account: no balance, no imports, nothing to reconcile. */
export function emptyBankData(): BankAccountData {
  return {
    balance: null,
    provisions: {
      vat: null,
      urssaf: { amount: eur(0), rateBp: 2560 },
      buffer: null,
      total: eur(0),
    },
    pendingMatches: [],
    movements: [],
    statements: [],
  };
}
