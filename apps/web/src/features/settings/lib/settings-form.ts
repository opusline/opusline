import type {
  DateFormat,
  Locale,
  MoneyData,
  SettingsData,
  UpdateSettingsData,
  UrssafPeriodicity,
  VatRegime,
} from "@opusline/api-client";

import {
  formatAmount,
  formatPercentFromBp,
  type MoneyFormat,
  parseDecimal,
  parseRateBp,
} from "@/lib/billing";
import { isFrenchFiscalityCountry } from "@/lib/fiscality";
import { valueOrNull } from "@/lib/form";
import { m } from "@/paraglide/messages.js";

export const SETTINGS_TABS = [
  "identite",
  "signature",
  "fiscalite",
  "facturation",
  "regional",
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number];

export const SETTINGS_TAB_DETAILS: Record<
  SettingsTab,
  { label: () => string; hint: () => string }
> = {
  identite: {
    label: m.settings_tab_identity_label,
    hint: m.settings_tab_identity_hint,
  },
  signature: {
    label: m.settings_tab_signature_label,
    hint: m.settings_tab_signature_hint,
  },
  fiscalite: {
    label: m.settings_tab_fiscality_label,
    hint: m.settings_tab_fiscality_hint,
  },
  facturation: {
    label: m.common_billing_title,
    hint: m.settings_tab_billing_hint,
  },
  regional: {
    label: m.settings_tab_regional_label,
    hint: m.settings_tab_regional_hint,
  },
};

export function isSettingsTab(value: unknown): value is SettingsTab {
  return SETTINGS_TABS.includes(value as SettingsTab);
}

export type SettingsFormValues = {
  tradeName: string;
  siret: string;
  vatNumber: string;
  signatureCity: string;
  contactEmail: string;
  phone: string;
  companyAddressLine1: string;
  companyAddressLine2: string;
  companyPostalCode: string;
  companyCity: string;
  homeAddressSameAsCompany: boolean;
  homeAddressLine1: string;
  homeAddressLine2: string;
  homePostalCode: string;
  homeCity: string;
  urssafPeriodicity: UrssafPeriodicity;
  autoRates: boolean;
  acre: boolean;
  businessStartedOn: string;
  contributionRate: string;
  liberatingPayment: boolean;
  vatRegime: VatRegime;
  defaultVatRate: string;
  defaultPaymentTermsDays: number;
  invoiceNumberFormat: string;
  treasuryBuffer: string;
  cfeExpected: string;
  workdayMinutes: number;
};

export const COMPANY_ADDRESS_NAMES = {
  line1: "companyAddressLine1",
  line2: "companyAddressLine2",
  postalCode: "companyPostalCode",
  city: "companyCity",
} as const;

export const HOME_ADDRESS_NAMES = {
  line1: "homeAddressLine1",
  line2: "homeAddressLine2",
  postalCode: "homePostalCode",
  city: "homeCity",
} as const;

function text(value: string | null): string {
  return value ?? "";
}

export function toSettingsValues(
  format: MoneyFormat,
  settings: SettingsData,
): SettingsFormValues {
  return {
    tradeName: text(settings.tradeName),
    siret: text(settings.siret),
    vatNumber: text(settings.vatNumber),
    signatureCity: text(settings.signatureCity),
    contactEmail: text(settings.contactEmail),
    phone: text(settings.phone),
    companyAddressLine1: text(settings.companyAddressLine1),
    companyAddressLine2: text(settings.companyAddressLine2),
    companyPostalCode: text(settings.companyPostalCode),
    companyCity: text(settings.companyCity),
    homeAddressSameAsCompany: settings.homeAddressSameAsCompany,
    homeAddressLine1: text(settings.homeAddressLine1),
    homeAddressLine2: text(settings.homeAddressLine2),
    homePostalCode: text(settings.homePostalCode),
    homeCity: text(settings.homeCity),
    urssafPeriodicity: settings.urssafPeriodicity,
    autoRates: settings.autoRates,
    acre: settings.acre,
    businessStartedOn: settings.businessStartedOn ?? "",
    contributionRate: formatRateBp(format.locale, settings.contributionRateBp),
    liberatingPayment: settings.liberatingPayment,
    vatRegime: settings.vatRegime,
    defaultVatRate: formatRateBp(format.locale, settings.defaultVatRateBp),
    defaultPaymentTermsDays: settings.defaultPaymentTermsDays,
    invoiceNumberFormat: settings.invoiceNumberFormat,
    treasuryBuffer:
      settings.treasuryBuffer === null
        ? ""
        : formatAmount(format, settings.treasuryBuffer.amount),
    cfeExpected:
      settings.cfeExpected === null
        ? ""
        : formatAmount(format, settings.cfeExpected.amount),
    workdayMinutes: settings.workdayMinutes,
  };
}

/** The fields the Localisation tab owns; everything else rides the bulk form. */
export type RegionalOverrides = {
  businessCountry?: string;
  locale?: Locale;
  dateFormat?: DateFormat;
  timezone?: string;
};

export function toSettingsPayload(
  format: MoneyFormat,
  values: SettingsFormValues,
  settings: SettingsData,
  // Edited from the Localisation tab, not this form — the defaults pass the
  // stored values through so a bulk save never moves them.
  regional: RegionalOverrides = {},
): UpdateSettingsData {
  const businessCountry = regional.businessCountry ?? settings.businessCountry;
  // An amount only exists once the user gives one, and a zero says the same
  // thing as an empty field — the API's Min(1) agrees.
  const moneyOrNull = (draft: string, appliesHere = true): MoneyData | null => {
    const cents = parseBufferCents(format.locale, draft);

    return !appliesHere || cents === null || cents === 0
      ? null
      : // settings.currency, not format.currency: the payload must be
        // denominated in the same snapshot it is built from, while the format
        // context is a render-time copy that can lag one render behind a
        // currency change and 422 on a field the user never touched.
        { amount: cents, currency: settings.currency };
  };
  // Mirrors the API's gate: outside France the French flags are forced off and
  // the régime pinned. Sending the already-normalized values keeps the saved
  // echo identical to the draft, so the unsaved-changes bar settles at zero.
  const isFrench = isFrenchFiscalityCountry(businessCountry);

  return {
    businessCountry,
    locale: regional.locale ?? settings.locale,
    dateFormat: regional.dateFormat ?? settings.dateFormat,
    timezone: regional.timezone ?? settings.timezone,
    workdayMinutes: values.workdayMinutes,
    urssafPeriodicity: values.urssafPeriodicity,
    autoRates: isFrench && values.autoRates,
    acre: isFrench && values.acre,
    businessStartedOn: valueOrNull(values.businessStartedOn),
    contributionRateBp: values.autoRates
      ? settings.contributionRateBp
      : (parseRateBp(format.locale, values.contributionRate) ??
        settings.contributionRateBp),
    liberatingPayment: isFrench && values.liberatingPayment,
    liberatingPaymentRateBp: settings.liberatingPaymentRateBp,
    vatRegime: isFrench ? values.vatRegime : 2,
    defaultVatRateBp:
      parseRateBp(format.locale, values.defaultVatRate) ??
      settings.defaultVatRateBp,
    defaultPaymentTermsDays: values.defaultPaymentTermsDays,
    invoiceNumberFormat: values.invoiceNumberFormat.trim(),
    homeAddressSameAsCompany: values.homeAddressSameAsCompany,
    tradeName: valueOrNull(values.tradeName),
    siret: valueOrNull(values.siret),
    vatNumber: valueOrNull(values.vatNumber),
    signatureCity: valueOrNull(values.signatureCity),
    contactEmail: valueOrNull(values.contactEmail),
    phone: valueOrNull(values.phone),
    companyAddressLine1: valueOrNull(values.companyAddressLine1),
    companyAddressLine2: valueOrNull(values.companyAddressLine2),
    companyPostalCode: valueOrNull(values.companyPostalCode),
    companyCity: valueOrNull(values.companyCity),
    homeAddressLine1: valueOrNull(values.homeAddressLine1),
    homeAddressLine2: valueOrNull(values.homeAddressLine2),
    homePostalCode: valueOrNull(values.homePostalCode),
    homeCity: valueOrNull(values.homeCity),
    treasuryBuffer: moneyOrNull(values.treasuryBuffer),
    // Outside France these two French taxes do not apply at all.
    cfeExpected: moneyOrNull(values.cfeExpected, isFrench),
  };
}

export function countChanges(
  format: MoneyFormat,
  saved: SettingsFormValues,
  draft: SettingsFormValues,
  settings: SettingsData,
): number {
  const savedPayload = toSettingsPayload(format, saved, settings);
  const draftPayload = toSettingsPayload(format, draft, settings);

  return Object.keys(savedPayload).filter((key) => {
    const name = key as keyof UpdateSettingsData;

    return (
      JSON.stringify(savedPayload[name]) !== JSON.stringify(draftPayload[name])
    );
  }).length;
}

const FIELD_TAB: Record<keyof SettingsFormValues, SettingsTab> = {
  tradeName: "identite",
  siret: "identite",
  vatNumber: "identite",
  signatureCity: "identite",
  contactEmail: "identite",
  phone: "identite",
  companyAddressLine1: "identite",
  companyAddressLine2: "identite",
  companyPostalCode: "identite",
  companyCity: "identite",
  homeAddressSameAsCompany: "identite",
  homeAddressLine1: "identite",
  homeAddressLine2: "identite",
  homePostalCode: "identite",
  homeCity: "identite",
  urssafPeriodicity: "fiscalite",
  autoRates: "fiscalite",
  acre: "fiscalite",
  businessStartedOn: "fiscalite",
  contributionRate: "fiscalite",
  liberatingPayment: "fiscalite",
  vatRegime: "fiscalite",
  defaultVatRate: "fiscalite",
  defaultPaymentTermsDays: "facturation",
  invoiceNumberFormat: "facturation",
  treasuryBuffer: "facturation",
  cfeExpected: "fiscalite",
  workdayMinutes: "facturation",
};

/**
 * The onChange validator every optional money draft shares: empty means unset,
 * anything else has to parse in the account's notation.
 */
export function optionalAmountValidator(locale: Locale) {
  return ({ value }: { value: string }): { message: string } | undefined =>
    value.trim() === "" || parseBufferCents(locale, value) !== null
      ? undefined
      : { message: m.settings_buffer_invalid() };
}

/** The onChange validator every percent-rate draft field shares. */
export function ratePercentValidator(locale: Locale) {
  return ({ value }: { value: string }): { message: string } | undefined =>
    parseRateBp(locale, value) === null
      ? { message: m.common_rate_invalid() }
      : undefined;
}

export function tabOwningField(field: string): SettingsTab | undefined {
  return FIELD_TAB[field as keyof SettingsFormValues];
}

export function unsavedChangesLabel(count: number): string {
  return m.settings_unsaved_changes({ count });
}

/**
 * Mirrors InvoiceNumberFormat::TOKEN_RUN_PATTERN on the API. Tokens may sit against
 * each other ("AAAAMM-NNN" renders "202608-001"), but a token welded to literal text
 * is not a token, so the MM inside "COMMANDE" stays literal. Diverging from the API
 * here means the preview shows a reference the server would never issue.
 */
const INVOICE_NUMBER_TOKEN_RUN =
  /(?<![A-Za-z0-9])((?:AAAA|MM|NNN)+)(?![A-Za-z0-9])/g;

const INVOICE_NUMBER_TOKEN = /AAAA|MM|NNN/g;

/**
 * Exactly one, not at least one: a second counter has nowhere to go. Mirrors
 * InvoiceNumberFormat::hasSingleCounter on the API.
 */
export function hasInvoiceNumberCounter(format: string): boolean {
  const counters = Array.from(
    format.matchAll(INVOICE_NUMBER_TOKEN_RUN),
  ).flatMap(([run]) =>
    Array.from(run.matchAll(INVOICE_NUMBER_TOKEN)).filter(
      ([token]) => token === "NNN",
    ),
  );

  return counters.length === 1;
}

export function previewInvoiceNumber(format: string, on: Date): string {
  return format.replaceAll(INVOICE_NUMBER_TOKEN_RUN, (run) =>
    run.replaceAll(INVOICE_NUMBER_TOKEN, (token) => {
      if (token === "AAAA") {
        return String(on.getFullYear());
      }

      return token === "MM"
        ? String(on.getMonth() + 1).padStart(2, "0")
        : "001";
    }),
  );
}

/** The same figure pinned to one decimal, so it does not jump as a rate is typed. */
export function formatRateBp(locale: Locale, basisPoints: number): string {
  return formatPercentFromBp(locale, basisPoints, 1);
}

export function parseBufferCents(locale: Locale, draft: string): number | null {
  const amount = parseDecimal(locale, draft);

  return amount === null ? null : Math.round(amount * 100);
}
