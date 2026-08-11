import { expect, it } from "vitest";

import { settingsFixture } from "./settings-fixture";
import {
  countChanges,
  formatRateBp,
  isSettingsTab,
  parseRateBp,
  previewInvoiceNumber,
  toSettingsPayload,
  toSettingsValues,
  unsavedChangesLabel,
} from "./settings-form";

const values = toSettingsValues(settingsFixture);

it("turns nulls into empty strings the inputs can hold", () => {
  const blank = toSettingsValues({ ...settingsFixture, tradeName: null });

  expect(blank.tradeName).toBe("");
});

it("sends the whole object so one edited field does not blank the others", () => {
  const payload = toSettingsPayload(
    { ...values, tradeName: "Nordlys" },
    settingsFixture,
  );

  expect(payload.tradeName).toBe("Nordlys");
  expect(payload.siret).toBe(settingsFixture.siret);
  expect(payload.contributionRateBp).toBe(settingsFixture.contributionRateBp);
  expect(payload.invoiceNumberFormat).toBe(settingsFixture.invoiceNumberFormat);
});

it("leaves derived read-only fields out of the payload", () => {
  const payload = toSettingsPayload(values, settingsFixture);

  expect(payload).not.toHaveProperty("vatLiable");
  expect(payload).not.toHaveProperty("effectiveContributionRateBp");
  expect(payload).not.toHaveProperty("hasSignature");
});

it("reports an emptied field as null rather than an empty string", () => {
  const payload = toSettingsPayload(
    { ...values, tradeName: "  " },
    settingsFixture,
  );

  expect(payload.tradeName).toBeNull();
});

it("sends the treasury buffer as money, and null when left empty", () => {
  expect(
    toSettingsPayload({ ...values, treasuryBuffer: "1 500" }, settingsFixture)
      .treasuryBuffer,
  ).toEqual({ amount: 150_000, currency: "EUR" });
  expect(
    toSettingsPayload({ ...values, treasuryBuffer: "" }, settingsFixture)
      .treasuryBuffer,
  ).toBeNull();
});

it("counts only the fields that drifted from the saved row", () => {
  expect(countChanges(values, values)).toBe(0);
  expect(countChanges(values, { ...values, tradeName: "Nordlys" })).toBe(1);
  expect(
    countChanges(values, {
      ...values,
      tradeName: "Nordlys",
      liberatingPayment: true,
      vatRegime: 2,
    }),
  ).toBe(3);
});

it("agrees with itself on singular and plural", () => {
  expect(unsavedChangesLabel(1)).toBe("1 modification non enregistrée");
  expect(unsavedChangesLabel(3)).toBe("3 modifications non enregistrées");
});

it("formats basis points as a French percentage with one decimal", () => {
  expect(formatRateBp(2600)).toBe("26,0");
  expect(formatRateBp(2820)).toBe("28,2");
  expect(formatRateBp(220)).toBe("2,2");
});

it("parses a typed rate into exact basis points", () => {
  expect(parseRateBp("26")).toBe(2600);
  expect(parseRateBp("28,2")).toBe(2820);
  expect(parseRateBp("2.2")).toBe(220);
  expect(parseRateBp("0")).toBe(0);
});

it("refuses a rate that is empty, negative or beyond 100 %", () => {
  expect(parseRateBp("")).toBeNull();
  expect(parseRateBp("-1")).toBeNull();
  expect(parseRateBp("101")).toBeNull();
  expect(parseRateBp("beaucoup")).toBeNull();
});

it("expands the numbering tokens for the preview", () => {
  const on = new Date("2026-08-11T00:00:00Z");

  expect(previewInvoiceNumber("AAAA-NNN", on)).toBe("2026-001");
  expect(previewInvoiceNumber("AAAAMM-NNN", on)).toBe("202608-001");
  expect(previewInvoiceNumber("FACT/AAAA/MM/NNN", on)).toBe("FACT/2026/08/001");
});

it("accepts only the known settings tabs", () => {
  expect(isSettingsTab("fiscalite")).toBe(true);
  expect(isSettingsTab("apparence")).toBe(true);
  expect(isSettingsTab("comptabilite")).toBe(false);
  expect(isSettingsTab(undefined)).toBe(false);
});
