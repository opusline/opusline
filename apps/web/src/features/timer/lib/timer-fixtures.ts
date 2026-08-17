import type {
  ClientWithMissionsData,
  MissionData,
  TimerData,
} from "@opusline/api-client";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import { trackableMissions } from "./mission-options";

export const DEMO_WORKDAY_MINUTES = 420;

export const DEMO_ELAPSED_SECONDS = 13_338;

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
  vatTreatment: 0,
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
];

export const DEMO_MISSION_OPTIONS = trackableMissions(
  DEFAULT_MONEY_FORMAT,
  DEMO_CLIENTS,
  DEMO_MISSIONS.orvella.id,
);

export const DEMO_TIMER: TimerData = {
  elapsedSeconds: DEMO_ELAPSED_SECONDS,
  id: 1,
  missionColor: 4,
  missionId: DEMO_MISSIONS.orvella.id,
  missionName: DEMO_MISSIONS.orvella.name,
  note: null,
  startedAt: "2026-07-30T10:50:00+02:00",
  state: 0,
};

export const DEMO_PAUSED_TIMER: TimerData = {
  ...DEMO_TIMER,
  state: 1,
};
