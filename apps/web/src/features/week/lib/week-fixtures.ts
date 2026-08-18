import type {
  ClientWithMissionsData,
  MissionData,
  MonthWorkloadData,
  TimeEntryData,
} from "@opusline/api-client";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import { buildWeekGrid, type WeekRow } from "./week-grid";

export const DEMO_WEEK = "2026-W31";
export const DEMO_TODAY = "2026-07-30";
export const DEMO_WORKDAY_MINUTES = 420;

/** The month DEMO_TODAY sits in: July 2026, 22 jours ouvrés once 14 July is out. */
export const DEMO_MONTH_WORKLOAD: MonthWorkloadData = {
  month: "2026-07",
  businessDays: 22,
  workedDays: 18.5,
};

const MONDAY = "2026-07-27";
const TUESDAY = "2026-07-28";
const WEDNESDAY = "2026-07-29";
const THURSDAY = "2026-07-30";
const FRIDAY = "2026-07-31";

const baseMission = {
  craRequired: false,
  endClientName: null,
  endDate: null,
  notes: null,
  rounding: 0,
  startDate: null,
  status: 0,
} satisfies Partial<MissionData>;

const baseClient = {
  archivedAt: null,
  billingAddressLine1: null,
  billingAddressLine2: null,
  billingCity: null,
  billingContactName: null,
  billingCountry: null,
  billingEmail: null,
  billingPostalCode: null,
  createdAt: "2026-01-08T00:00:00+00:00",
  notes: null,
  paymentTermsDays: 45,
  siret: null,
  vatNumber: null,
} satisfies Partial<ClientWithMissionsData>;

export const DEMO_MISSIONS = {
  vesterhus: {
    ...baseMission,
    billingMode: 1,
    clientId: 2,
    color: null,
    id: 2,
    name: "Vesterhus maintenance",
    rate: { amount: 8_500, currency: "EUR" },
    slug: "vesterhus-maintenance",
  },
  orvella: {
    ...baseMission,
    billingMode: 0,
    clientId: 1,
    color: null,
    endClientName: "Orvella",
    id: 1,
    name: "Orvella front",
    rate: { amount: 55_000, currency: "EUR" },
    slug: "orvella-front",
  },
  opusline: {
    ...baseMission,
    billingMode: 1,
    clientId: 3,
    color: 7,
    id: 3,
    name: "Opusline",
    rate: null,
    slug: "opusline",
  },
} satisfies Record<string, MissionData>;

export const DEMO_CLIENTS: ClientWithMissionsData[] = [
  {
    ...baseClient,
    color: 4,
    id: 1,
    missions: [DEMO_MISSIONS.orvella],
    name: "Nordlys",
    slug: "nordlys",
    type: 1,
  },
  {
    ...baseClient,
    color: 1,
    id: 2,
    missions: [DEMO_MISSIONS.vesterhus],
    name: "Vesterhus",
    slug: "vesterhus",
    type: 0,
  },
  {
    ...baseClient,
    color: 7,
    id: 3,
    missions: [DEMO_MISSIONS.opusline],
    name: "Perso",
    slug: "perso",
    type: 2,
  },
];

function billedDay(
  id: number,
  date: string,
  note: string,
  dayFraction = 1,
): TimeEntryData {
  return {
    billable: true,
    invoiced: false,
    date,
    durationMinutes: dayFraction * DEMO_WORKDAY_MINUTES,
    id,
    missionId: DEMO_MISSIONS.orvella.id,
    note,
    rounding: null,
    valuedDayFraction: dayFraction,
    valuedMinutes: null,
  };
}

function billedHours(
  id: number,
  missionId: number,
  date: string,
  minutes: number,
  note: string,
  billable = true,
): TimeEntryData {
  return {
    billable,
    invoiced: false,
    date,
    durationMinutes: minutes,
    id,
    missionId,
    note,
    rounding: null,
    valuedDayFraction: null,
    valuedMinutes: minutes,
  };
}

export const DEMO_TIME_ENTRIES: TimeEntryData[] = [
  billedDay(1, MONDAY, "Sprint 24 · specs"),
  billedDay(2, TUESDAY, "Filtre agences"),
  billedDay(3, WEDNESDAY, "Revue PR"),
  billedDay(4, THURSDAY, "Cadrage V2"),
  billedDay(5, FRIDAY, "Rétro + backlog", 0.5),
  billedHours(
    6,
    DEMO_MISSIONS.vesterhus.id,
    WEDNESDAY,
    90,
    "Hotfix impression",
  ),
  billedHours(7, DEMO_MISSIONS.vesterhus.id, FRIDAY, 120, "Migration PHP 8.3"),
  billedHours(
    10,
    DEMO_MISSIONS.vesterhus.id,
    THURSDAY,
    60,
    "Analyse avant devis",
    false,
  ),
  billedHours(8, DEMO_MISSIONS.opusline.id, TUESDAY, 120, "Écran semaine"),
  billedHours(
    9,
    DEMO_MISSIONS.opusline.id,
    THURSDAY,
    90,
    "Calculateur virement",
  ),
];

/** The demo week as the grid sees it — stories and tests read rows off this. */
export const DEMO_GRID = buildWeekGrid({
  clients: DEMO_CLIENTS,
  format: DEFAULT_MONEY_FORMAT,
  timeEntries: DEMO_TIME_ENTRIES,
  today: DEMO_TODAY,
  week: DEMO_WEEK,
  weekendShown: false,
});

export function demoRowNamed(name: string): WeekRow {
  const row = DEMO_GRID.rows.find((candidate) => candidate.name === name);

  if (row === undefined) {
    throw new Error(`No demo row named ${name}`);
  }

  return row;
}
