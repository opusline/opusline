import type { UrssafPeriodicity, VatRegime } from "@opusline/api-client";

export const URSSAF_PERIODICITIES: UrssafPeriodicity[] = [0, 1];

export const URSSAF_PERIODICITY_LABELS: Record<UrssafPeriodicity, string> = {
  0: "Mensuelle",
  1: "Trimestrielle",
};

export const VAT_REGIMES: VatRegime[] = [0, 1, 2];

export const VAT_REGIME_DETAILS: Record<
  VatRegime,
  { label: string; hint: string; note: string }
> = {
  0: {
    label: "Franchise en base",
    hint: "Je ne facture pas la TVA",
    note: "Vos factures portent la mention « TVA non applicable, art. 293 B du CGI ».",
  },
  1: {
    label: "Réel simplifié",
    hint: "Assujetti · CA12 annuelle",
    note: "Vos factures portent la TVA et une déclaration CA12 est attendue chaque année, avec acomptes.",
  },
  2: {
    label: "Réel normal",
    hint: "Assujetti · CA3 mensuelle",
    note: "Vos factures portent la TVA et une déclaration CA3 est attendue chaque mois.",
  },
};
