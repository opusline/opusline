import { expect, it } from "vitest";

import {
  bankAccountLabel,
  bankAccountName,
  connectionState,
  consentExpiresSoon,
} from "./connection";
import { bankAccountEntry, bankConnection } from "./fixtures";

it.each([
  [false, null, "unconfigured"],
  [true, null, "disconnected"],
  [true, bankConnection({ status: 1 }), "awaiting-account"],
  [true, bankConnection({ status: 0 }), "active"],
  [true, bankConnection({ status: 2 }), "expired"],
] as const)(
  "with credentials %s and connection %o the page offers %s",
  (bankSyncConfigured, connection, state) => {
    expect(connectionState(bankSyncConfigured, connection)).toBe(state);
  },
);

it("warns about a consent ending within two weeks", () => {
  const now = Date.parse("2026-08-13T12:00:00Z");

  expect(consentExpiresSoon("2026-08-20T12:00:00Z", now)).toBe(true);
  expect(consentExpiresSoon("2026-09-30T12:00:00Z", now)).toBe(false);
});

it("names an account by its label and the tail of its IBAN", () => {
  expect(
    bankAccountLabel({ uid: "u", name: "Compte pro", ibanLast4: "0185" }),
  ).toBe("Compte pro · ••0185");
  expect(bankAccountLabel({ uid: "u", name: null, ibanLast4: null })).toBe(
    "Compte sans nom",
  );
});

it.each([
  ["the name given to it", { name: "Réserve" }, [bankConnection()], "Réserve"],
  [
    "the bank that syncs it",
    { name: null },
    [bankConnection()],
    "Banque Orvella",
  ],
  ["Compte pro when nothing names it", { name: null }, [], "Compte pro"],
] as const)(
  "calls an account by %s",
  (_case, overrides, connections, expected) => {
    expect(bankAccountName(bankAccountEntry(overrides), [...connections])).toBe(
      expected,
    );
  },
);
