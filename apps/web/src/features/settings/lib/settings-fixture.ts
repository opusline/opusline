import type { SettingsData } from "@opusline/api-client";

export const settingsFixture: SettingsData = {
  tradeName: "Théo Marchand",
  siret: "443 061 841 00047",
  vatNumber: null,
  signatureCity: "Nantes",
  contactEmail: "theo@marchand.dev",
  phone: "06 12 34 56 78",
  companyAddressLine1: "12 rue de Strasbourg",
  companyAddressLine2: null,
  companyPostalCode: "44000",
  companyCity: "Nantes",
  homeAddressSameAsCompany: true,
  homeAddressLine1: null,
  homeAddressLine2: null,
  homePostalCode: null,
  homeCity: null,
  urssafPeriodicity: 0,
  autoRates: true,
  acre: false,
  businessStartedOn: null,
  ratesCheckedAt: "2026-08-11T03:00:00+00:00",
  ratesYear: 2026,
  contributionRateBp: 2600,
  liberatingPayment: false,
  liberatingPaymentRateBp: 220,
  vatRegime: 0,
  vatLiable: false,
  defaultVatRateBp: 2000,
  effectiveVatRateBp: 0,
  effectiveContributionRateBp: 2600,
  defaultPaymentTermsDays: 45,
  invoiceNumberFormat: "AAAA-NNN",
  treasuryBuffer: null,
  businessCountry: "FR",
  hasFrenchFiscality: true,
  currency: "EUR",
  currencyLocked: false,
  locale: "fr-FR",
  dateFormat: 0,
  timezone: "Europe/Paris",
  workdayMinutes: 420,
  hasSignature: false,
};

/** The same account established abroad — the two flags always move together. */
export const abroadSettingsFixture: SettingsData = {
  ...settingsFixture,
  businessCountry: "DE",
  hasFrenchFiscality: false,
  vatRegime: 2,
  vatLiable: true,
};

/** Established outside the EU: no intra-community VAT, taxes lose the TVA name. */
export const nonEuSettingsFixture: SettingsData = {
  ...abroadSettingsFixture,
  businessCountry: "CA",
};
