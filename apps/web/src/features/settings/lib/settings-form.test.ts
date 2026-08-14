import { expect, it } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import { settingsFixture } from "./settings-fixture";
import {
  countChanges,
  formatRateBp,
  hasInvoiceNumberCounter,
  isSettingsTab,
  parseBufferCents,
  parseRateBp,
  previewInvoiceNumber,
  toSettingsPayload,
  toSettingsValues,
  unsavedChangesLabel,
} from "./settings-form";

const values = toSettingsValues(DEFAULT_MONEY_FORMAT, settingsFixture);

it("turns nulls into empty strings the inputs can hold", () => {
  const blank = toSettingsValues(DEFAULT_MONEY_FORMAT, {
    ...settingsFixture,
    tradeName: null,
  });

  expect(blank.tradeName).toBe("");
});

it("sends the whole object so one edited field does not blank the others", () => {
  const payload = toSettingsPayload(
    DEFAULT_MONEY_FORMAT,
    { ...values, tradeName: "Nordlys" },
    settingsFixture,
  );

  expect(payload.tradeName).toBe("Nordlys");
  expect(payload.siret).toBe(settingsFixture.siret);
  expect(payload.contributionRateBp).toBe(settingsFixture.contributionRateBp);
  expect(payload.invoiceNumberFormat).toBe(settingsFixture.invoiceNumberFormat);
});

it("leaves derived read-only fields out of the payload", () => {
  const payload = toSettingsPayload(
    DEFAULT_MONEY_FORMAT,
    values,
    settingsFixture,
  );

  expect(payload).not.toHaveProperty("vatLiable");
  expect(payload).not.toHaveProperty("effectiveContributionRateBp");
  expect(payload).not.toHaveProperty("hasSignature");
});

it("reports an emptied field as null rather than an empty string", () => {
  const payload = toSettingsPayload(
    DEFAULT_MONEY_FORMAT,
    { ...values, tradeName: "  " },
    settingsFixture,
  );

  expect(payload.tradeName).toBeNull();
});

it("sends the treasury buffer as money, and null when left empty", () => {
  expect(
    toSettingsPayload(
      DEFAULT_MONEY_FORMAT,
      { ...values, treasuryBuffer: "1 500" },
      settingsFixture,
    ).treasuryBuffer,
  ).toEqual({ amount: 150_000, currency: "EUR" });
  expect(
    toSettingsPayload(
      DEFAULT_MONEY_FORMAT,
      { ...values, treasuryBuffer: "" },
      settingsFixture,
    ).treasuryBuffer,
  ).toBeNull();
});

it("sends a zero matelas as no matelas, which the API's Min(1) demands", () => {
  expect(
    toSettingsPayload(
      DEFAULT_MONEY_FORMAT,
      { ...values, treasuryBuffer: "0" },
      settingsFixture,
    ).treasuryBuffer,
  ).toBeNull();
});

it("counts only the fields that drifted from the saved row", () => {
  expect(
    countChanges(DEFAULT_MONEY_FORMAT, values, values, settingsFixture),
  ).toBe(0);
  expect(
    countChanges(
      DEFAULT_MONEY_FORMAT,
      values,
      { ...values, tradeName: "Nordlys" },
      settingsFixture,
    ),
  ).toBe(1);
  expect(
    countChanges(
      DEFAULT_MONEY_FORMAT,
      values,
      {
        ...values,
        tradeName: "Nordlys",
        liberatingPayment: true,
        vatRegime: 2,
      },
      settingsFixture,
    ),
  ).toBe(3);
});

it("mirrors the API's foreign-country gate so the saved echo matches the draft", () => {
  // The server forces these off outside France; sending them normalized keeps
  // the unsaved-changes bar at zero after the save lands.
  const payload = toSettingsPayload(
    DEFAULT_MONEY_FORMAT,
    {
      ...values,
      autoRates: true,
      acre: true,
      liberatingPayment: true,
      vatRegime: 0,
    },
    settingsFixture,
    { businessCountry: "DE" },
  );

  expect(payload.autoRates).toBe(false);
  expect(payload.acre).toBe(false);
  expect(payload.liberatingPayment).toBe(false);
  expect(payload.vatRegime).toBe(2);
});

it("parses the VAT default from its draft, keeping the saved rate on garbage", () => {
  expect(
    toSettingsPayload(
      DEFAULT_MONEY_FORMAT,
      { ...values, defaultVatRate: "19" },
      settingsFixture,
    ).defaultVatRateBp,
  ).toBe(1900);
  expect(
    toSettingsPayload(
      DEFAULT_MONEY_FORMAT,
      { ...values, defaultVatRate: "beaucoup" },
      settingsFixture,
    ).defaultVatRateBp,
  ).toBe(settingsFixture.defaultVatRateBp);
});

it("counts nothing when a draft only differs in formatting", () => {
  // The server echoes « 1 500,50 » back as « 1 500,5 », so a raw string compare
  // would leave the unsaved-changes bar up forever after a successful save.
  expect(
    countChanges(
      DEFAULT_MONEY_FORMAT,
      { ...values, treasuryBuffer: "1 500,5" },
      { ...values, treasuryBuffer: "1500,50" },
      settingsFixture,
    ),
  ).toBe(0);
  expect(
    countChanges(
      DEFAULT_MONEY_FORMAT,
      values,
      { ...values, tradeName: `  ${values.tradeName}  ` },
      settingsFixture,
    ),
  ).toBe(0);
});

it("ignores the read-only rate while the official source owns it", () => {
  expect(
    countChanges(
      DEFAULT_MONEY_FORMAT,
      { ...values, autoRates: true },
      { ...values, autoRates: true, contributionRate: "12,8" },
      settingsFixture,
    ),
  ).toBe(0);
});

it("agrees with itself on singular and plural", () => {
  expect(unsavedChangesLabel(1)).toBe("1 modification non enregistrée");
  expect(unsavedChangesLabel(3)).toBe("3 modifications non enregistrées");
});

it("formats basis points as a French percentage with one decimal", () => {
  expect(formatRateBp("fr-FR", 2600)).toBe("26,0");
  expect(formatRateBp("fr-FR", 2820)).toBe("28,2");
  expect(formatRateBp("fr-FR", 220)).toBe("2,2");
});

it("parses a typed rate into exact basis points", () => {
  expect(parseRateBp("fr-FR", "26")).toBe(2600);
  expect(parseRateBp("fr-FR", "28,2")).toBe(2820);
  expect(parseRateBp("fr-FR", "2.2")).toBe(220);
  expect(parseRateBp("fr-FR", "0")).toBe(0);
});

it("refuses a rate that is empty, negative or beyond 100 %", () => {
  expect(parseRateBp("fr-FR", "")).toBeNull();
  expect(parseRateBp("fr-FR", "-1")).toBeNull();
  expect(parseRateBp("fr-FR", "101")).toBeNull();
  expect(parseRateBp("fr-FR", "beaucoup")).toBeNull();
});

it("expands the numbering tokens for the preview", () => {
  const on = new Date("2026-08-11T00:00:00Z");

  expect(previewInvoiceNumber("AAAA-NNN", on)).toBe("2026-001");
  expect(previewInvoiceNumber("AAAAMM-NNN", on)).toBe("202608-001");
  expect(previewInvoiceNumber("FACT/AAAA/MM/NNN", on)).toBe("FACT/2026/08/001");
  // A token welded to literal text is not a token — mirrors the API.
  expect(previewInvoiceNumber("COMMANDE-NNN", on)).toBe("COMMANDE-001");
  expect(previewInvoiceNumber("COMMANDENNN", on)).toBe("COMMANDENNN");
});

it("requires exactly one counter token", () => {
  expect(hasInvoiceNumberCounter("AAAA-NNN")).toBe(true);
  expect(hasInvoiceNumberCounter("AAAAMM-NNN")).toBe(true);
  expect(hasInvoiceNumberCounter("AAAA-001")).toBe(false);
  // Welded to a literal, so the format has no counter at all.
  expect(hasInvoiceNumberCounter("COMMANDENNN")).toBe(false);
  // A second counter has nowhere to go.
  expect(hasInvoiceNumberCounter("NNN-NNN")).toBe(false);
  expect(hasInvoiceNumberCounter("NNNNNN")).toBe(false);
});

it("accepts only the known settings tabs", () => {
  expect(isSettingsTab("fiscalite")).toBe(true);
  expect(isSettingsTab("regional")).toBe(true);
  expect(isSettingsTab("apparence")).toBe(false);
  expect(isSettingsTab("comptabilite")).toBe(false);
  expect(isSettingsTab(undefined)).toBe(false);
});

it("refuses a rate with a stray separator instead of truncating it", () => {
  // Number.parseFloat would return 1.234 here and save 1,23 % silently.
  expect(parseRateBp("fr-FR", "1,234,5")).toBeNull();
  expect(parseRateBp("fr-FR", "1.500,50")).toBeNull();
  expect(parseRateBp("fr-FR", "abc")).toBeNull();
  expect(parseRateBp("fr-FR", "25,6")).toBe(2560);
  expect(parseRateBp("fr-FR", "1 500")).toBeNull();
});

it("treats a zero treasury buffer as a real answer", () => {
  expect(parseBufferCents("fr-FR", "0")).toBe(0);
  expect(parseBufferCents("fr-FR", "1 500,50")).toBe(150_050);
  expect(parseBufferCents("fr-FR", "abc")).toBeNull();
});
