import type {
  ClientWithMissionsData,
  InvoicePaperData,
  UnbilledTimeData,
} from "@opusline/api-client";

import { clientWithMissions, eur, MISSION_FIXTURE } from "@/test/fixtures";
import { invoicePaperFixture } from "./invoice-paper-fixture";

export const editorClients: ClientWithMissionsData[] = [
  clientWithMissions({
    id: 1,
    name: "Nordlys",
    billingAddressLine1: "3 impasse des Potiers",
    billingPostalCode: "44100",
    billingCity: "Nantes",
    missions: [{ ...MISSION_FIXTURE, clientId: 1 }],
  }),
  clientWithMissions({ id: 2, slug: "callisto", name: "Callisto" }),
];

export const editorUnbilledTime: UnbilledTimeData = {
  missionId: MISSION_FIXTURE.id,
  missionName: MISSION_FIXTURE.name,
  timeEntryIds: [101, 102, 103],
  firstEntryOn: "2026-09-01",
  lastEntryOn: "2026-09-26",
  quantityMilli: 12_500,
  unit: 0,
  unitPrice: eur(55_000),
};

/** The preview of a draft: stamped, no number yet. */
export const editorPaper: InvoicePaperData = {
  ...invoicePaperFixture,
  title: "Facture",
  stamp: "Brouillon",
};
