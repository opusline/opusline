import { expect, it } from "vitest";
import {
  hasUnsavedChanges,
  legalReferenceTitle,
  parsePaymentTermKey,
  paymentTermKey,
  paymentTermLabel,
  paymentTermOptions,
  semesterStart,
  toInvoicingDraft,
  toInvoicingPayload,
} from "./invoicing-settings";
import { invoicingSettingsFixture } from "./invoicing-settings-fixture";

const LOCALE = "fr-FR";
const draft = toInvoicingDraft(LOCALE, invoicingSettingsFixture);

it("round-trips a payment term through its key", () => {
  for (const term of [
    { days: 0, endOfMonth: false },
    { days: 45, endOfMonth: true },
    { days: 0, endOfMonth: true },
  ]) {
    expect(parsePaymentTermKey(paymentTermKey(term))).toEqual(term);
  }
});

it("flags the two legal maximums", () => {
  expect(paymentTermLabel({ days: 60, endOfMonth: false })).toBe(
    "60 jours (maximum légal)",
  );
  expect(paymentTermLabel({ days: 45, endOfMonth: true })).toBe(
    "45 jours fin de mois (maximum légal)",
  );
  expect(paymentTermLabel({ days: 0, endOfMonth: false })).toBe("À réception");
});

it("keeps a stored term the presets do not hold selectable", () => {
  const custom = { days: 21, endOfMonth: false };

  expect(paymentTermOptions(custom)).toContainEqual(custom);
  expect(paymentTermOptions({ days: 30, endOfMonth: false })).toHaveLength(8);
});

it("sends an empty penalty rate as null, the statutory rate", () => {
  expect(
    toInvoicingPayload(LOCALE, draft, invoicingSettingsFixture)
      .latePenaltyRateBp,
  ).toBeNull();
  expect(
    toInvoicingPayload(
      LOCALE,
      { ...draft, latePenaltyRate: "12,4" },
      invoicingSettingsFixture,
    ).latePenaltyRateBp,
  ).toBe(1240);
});

it("splits the term key into days and end of month", () => {
  const payload = toInvoicingPayload(
    LOCALE,
    { ...draft, paymentTerm: "45fm" },
    invoicingSettingsFixture,
  );

  expect(payload.defaultPaymentTermsDays).toBe(45);
  expect(payload.defaultPaymentTermsEndOfMonth).toBe(true);
});

it("never sends the VAT-on-debits option for an account under the franchise", () => {
  expect(
    toInvoicingPayload(
      LOCALE,
      { ...draft, vatOnDebits: true },
      invoicingSettingsFixture,
    ).vatOnDebits,
  ).toBe(false);
});

it("sees no change in a draft only re-spaced", () => {
  expect(hasUnsavedChanges(LOCALE, invoicingSettingsFixture, draft)).toBe(
    false,
  );
  expect(
    hasUnsavedChanges(LOCALE, invoicingSettingsFixture, {
      ...draft,
      customMentions: "   ",
    }),
  ).toBe(false);
  expect(
    hasUnsavedChanges(LOCALE, invoicingSettingsFixture, {
      ...draft,
      quoteValidityDays: 60,
    }),
  ).toBe(true);
});

it("names the semester and the day its ECB rate is taken", () => {
  expect(semesterStart("2026-H2")).toBe("2026-07-01");
  expect(semesterStart("2027-H1")).toBe("2027-01-01");
  expect(legalReferenceTitle(invoicingSettingsFixture.legalReference)).toBe(
    "Référentiel légal · 2e semestre 2026",
  );
});
