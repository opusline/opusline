import type {
  SettingsData,
  UpdateSettingsData,
  UrssafPeriodicity,
  VatRegime,
} from "@opusline/api-client";

import { formatAmount, formatPercentFromBp, parseDecimal } from "@/lib/billing";
import { valueOrNull } from "@/lib/form";

export const SETTINGS_TABS = [
  "identite",
  "signature",
  "fiscalite",
  "facturation",
  "apparence",
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number];

export const SETTINGS_TAB_DETAILS: Record<
  SettingsTab,
  { label: string; hint: string }
> = {
  identite: { label: "Identité", hint: "Coordonnées, adresse" },
  signature: { label: "Signature", hint: "Tracé apposé aux documents" },
  fiscalite: { label: "Fiscalité", hint: "URSSAF, TVA, provisions" },
  facturation: { label: "Facturation", hint: "Délais, numérotation, matelas" },
  apparence: { label: "Apparence", hint: "Thème de l'interface" },
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
  defaultPaymentTermsDays: number;
  invoiceNumberFormat: string;
  treasuryBuffer: string;
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

export function toSettingsValues(settings: SettingsData): SettingsFormValues {
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
    contributionRate: formatRateBp(settings.contributionRateBp),
    liberatingPayment: settings.liberatingPayment,
    vatRegime: settings.vatRegime,
    defaultPaymentTermsDays: settings.defaultPaymentTermsDays,
    invoiceNumberFormat: settings.invoiceNumberFormat,
    treasuryBuffer:
      settings.treasuryBuffer === null
        ? ""
        : formatAmount(settings.treasuryBuffer.amount),
  };
}

export function toSettingsPayload(
  values: SettingsFormValues,
  settings: SettingsData,
): UpdateSettingsData {
  const buffer = parseBufferCents(values.treasuryBuffer);

  return {
    urssafPeriodicity: values.urssafPeriodicity,
    autoRates: values.autoRates,
    acre: values.acre,
    businessStartedOn: valueOrNull(values.businessStartedOn),
    contributionRateBp: values.autoRates
      ? settings.contributionRateBp
      : (parseRateBp(values.contributionRate) ?? settings.contributionRateBp),
    liberatingPayment: values.liberatingPayment,
    liberatingPaymentRateBp: settings.liberatingPaymentRateBp,
    vatRegime: values.vatRegime,
    // Not editable in this form yet; passed through so a full-replace PUT keeps it.
    defaultVatRateBp: settings.defaultVatRateBp,
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
    treasuryBuffer:
      buffer === null ? null : { amount: buffer, currency: "EUR" as const },
  };
}

export function countChanges(
  saved: SettingsFormValues,
  draft: SettingsFormValues,
  settings: SettingsData,
): number {
  const savedPayload = toSettingsPayload(saved, settings);
  const draftPayload = toSettingsPayload(draft, settings);

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
  defaultPaymentTermsDays: "facturation",
  invoiceNumberFormat: "facturation",
  treasuryBuffer: "facturation",
};

export function tabOwningField(field: string): SettingsTab | undefined {
  return FIELD_TAB[field as keyof SettingsFormValues];
}

export function unsavedChangesLabel(count: number): string {
  return count === 1
    ? "1 modification non enregistrée"
    : `${count} modifications non enregistrées`;
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

export function formatRateBp(basisPoints: number): string {
  return formatPercentFromBp(basisPoints, 1);
}

export function parseRateBp(draft: string): number | null {
  const rate = parseDecimal(draft);

  if (rate === null || rate > 100) {
    return null;
  }

  return Math.round(rate * 100);
}

export function parseBufferCents(draft: string): number | null {
  const amount = parseDecimal(draft);

  return amount === null ? null : Math.round(amount * 100);
}
