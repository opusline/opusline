import type {
  ClientData,
  CraDayData,
  CraDetailData,
  CraListItemData,
  MissionData,
  SettingsData,
} from "@opusline/api-client";

import { monthDates } from "@/lib/months";

import { buildCraGrid, type CraGridModel } from "./cra-grid";

const client = {
  id: 1,
  slug: "nordlys",
  name: "Nordlys",
  type: 1,
  notes: null,
  siret: "443 061 841 00047",
  vatNumber: null,
  defaultVatRateBp: null,
  billingAddressLine1: null,
  billingAddressLine2: null,
  billingPostalCode: null,
  billingCity: null,
  billingCountry: null,
  billingContactName: "Camille Dupont",
  billingEmail: "factures@nordlys.example",
  color: 0,
  paymentTermsDays: 45,
  archivedAt: null,
  createdAt: "2025-03-01T09:00:00+00:00",
} satisfies ClientData;

const mission = {
  id: 10,
  slug: "callisto-front",
  clientId: 1,
  name: "Callisto front",
  endClientName: "Callisto",
  billingMode: 0,
  rate: { amount: 55_000, currency: "EUR" },
  targetRate: null,
  rounding: 0,
  status: 0,
  craRequired: true,
  color: null,
  notes: null,
  startDate: "2025-03-03",
  endDate: null,
} satisfies MissionData;

/**
 * July 2026: opens on a Wednesday, and 14 July is a holiday — enough shape for the
 * grid to be worth looking at.
 */
export const DEMO_MONTH = "2026-07";

const HOLIDAYS: Record<string, string> = { "2026-07-14": "Fête nationale" };

/**
 * A month of days, worked Monday to Friday with half-day Fridays, which is what the
 * seeded demo account looks like.
 */
export function craDays(
  overrides: Record<string, number> = {},
  month = DEMO_MONTH,
): CraDayData[] {
  return monthDates(month).map((date) => {
    const weekday = new Date(`${date}T00:00:00`).getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const isHoliday = date in HOLIDAYS;

    const worked = isWeekend || isHoliday ? 0 : weekday === 5 ? 5_000 : 10_000;
    const dayFractionBp = overrides[date] ?? worked;

    return {
      date,
      dayFractionBp,
      trackedDayFractionBp: worked,
      isWeekend,
      isHoliday,
      holidayName: HOLIDAYS[date] ?? null,
    };
  });
}

function totalDays(days: CraDayData[]): number {
  return days.reduce((total, day) => total + day.dayFractionBp, 0) / 10_000;
}

function trackedDays(days: CraDayData[]): number {
  return (
    days.reduce((total, day) => total + day.trackedDayFractionBp, 0) / 10_000
  );
}

export function craDetail(
  overrides: Partial<CraDetailData["cra"]> = {},
  days: CraDayData[] = craDays(),
): CraDetailData {
  const reported = overrides.days ?? days;

  return {
    cra: {
      id: 1,
      missionId: mission.id,
      month: DEMO_MONTH,
      status: 0,
      sentOn: null,
      signedOn: null,
      totalDays: totalDays(reported),
      trackedDays: trackedDays(reported),
      differenceDays: totalDays(reported) - trackedDays(reported),
      estimatedAmount: {
        amount: Math.round(totalDays(reported) * 55_000),
        currency: "EUR",
      },
      dirty: false,
      editable: true,
      notes: null,
      ...overrides,
      days: reported,
    },
    client,
    mission,
    recipientName: "Callisto",
  };
}

/** The grid model a detail fixture produces, for components that take it as a prop. */
export function craGrid(detail: CraDetailData = craDetail()): CraGridModel {
  return buildCraGrid({
    locale: "fr-FR",
    month: detail.cra.month,
    days: detail.cra.days,
  });
}

export function craItem(
  overrides: Partial<CraListItemData> = {},
): CraListItemData {
  return {
    id: 1,
    missionId: mission.id,
    missionSlug: mission.slug,
    missionName: mission.name,
    clientSlug: client.slug,
    clientName: client.name,
    color: 0,
    month: DEMO_MONTH,
    status: 0,
    totalDays: 21,
    trackedDays: 21,
    ...overrides,
  };
}

/**
 * Standalone rather than spread from features/settings' fixture: a feature may not
 * import another feature (biome noRestrictedImports), only a route may compose them.
 */
export const DEMO_SETTINGS = {
  tradeName: "Théo Marchand",
  siret: "443 061 841 00047",
  vatNumber: "FR40443061841",
  signatureCity: "Nantes",
  contactEmail: "theo@marchand.dev",
  phone: "06 12 34 56 78",
  companyAddressLine1: "12 rue des Olivettes",
  companyAddressLine2: null,
  companyPostalCode: "44000",
  companyCity: "Nantes",
  homeAddressSameAsCompany: true,
  homeAddressLine1: null,
  homeAddressLine2: null,
  homePostalCode: null,
  homeCity: null,
  urssafPeriodicity: 0,
  autoRates: false,
  businessStartedOn: null,
  acre: false,
  ratesCheckedAt: null,
  ratesYear: null,
  contributionRateBp: 2_600,
  liberatingPayment: false,
  liberatingPaymentRateBp: 220,
  vatRegime: 0,
  vatLiable: false,
  defaultVatRateBp: 2_000,
  effectiveVatRateBp: 0,
  effectiveContributionRateBp: 2_600,
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
  hasSignature: true,
} satisfies SettingsData;
