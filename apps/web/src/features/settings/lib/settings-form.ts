import type {
  SettingsData,
  UpdateSettingsData,
  UrssafPeriodicity,
  VatRegime,
} from "@opusline/api-client";

import { formatAmount, parseRateToCents } from "@/lib/billing";

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

export const FORM_TABS: SettingsTab[] = [
  "identite",
  "fiscalite",
  "facturation",
];

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

function valueOrNull(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
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
  const buffer = parseRateToCents(values.treasuryBuffer);

  return {
    urssafPeriodicity: values.urssafPeriodicity,
    contributionRateBp:
      parseRateBp(values.contributionRate) ?? settings.contributionRateBp,
    liberatingPayment: values.liberatingPayment,
    liberatingPaymentRateBp: settings.liberatingPaymentRateBp,
    vatRegime: values.vatRegime,
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
): number {
  return Object.keys(saved).filter((key) => {
    const name = key as keyof SettingsFormValues;

    return saved[name] !== draft[name];
  }).length;
}

export function unsavedChangesLabel(count: number): string {
  return count === 1
    ? "1 modification non enregistrée"
    : `${count} modifications non enregistrées`;
}

export function previewInvoiceNumber(format: string, on: Date): string {
  return format
    .replaceAll("AAAA", String(on.getFullYear()))
    .replaceAll("MM", String(on.getMonth() + 1).padStart(2, "0"))
    .replaceAll("NNN", "001");
}

const percent = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export function formatRateBp(basisPoints: number): string {
  return percent.format(basisPoints / 100);
}

export function parseRateBp(draft: string): number | null {
  const normalized = draft.replace(/[\s ]/g, "").replace(",", ".");

  if (normalized === "") {
    return null;
  }

  const rate = Number.parseFloat(normalized);

  if (Number.isNaN(rate) || rate < 0 || rate > 100) {
    return null;
  }

  return Math.round(rate * 100);
}
