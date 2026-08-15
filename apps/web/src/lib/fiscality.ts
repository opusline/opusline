import type {
  UrssafPeriodicity,
  UserData,
  VatRegime,
} from "@opusline/api-client";
import { redirect } from "@tanstack/react-router";

/**
 * Mirrors the API's UserSettings::FRENCH_FISCALITY_COUNTRY — the one country
 * whose fiscal rules are implemented. The server remains the authority; this
 * names the client-side echoes so they cannot drift apart silently.
 */
export const FRENCH_FISCALITY_COUNTRY = "FR";

export function isFrenchFiscalityCountry(countryCode: string): boolean {
  return countryCode === FRENCH_FISCALITY_COUNTRY;
}

/**
 * What the default rate is called for a business abroad: the exact « TVA »
 * inside the EU, a neutral term outside it. One derivation so the tab hint,
 * the section title and the field never drift apart.
 */
export function abroadTaxTerms(isEuVat: boolean): {
  name: string;
  rateLabel: string;
  zeroHint: string;
} {
  return isEuVat
    ? {
        name: "TVA",
        rateLabel: "TVA par défaut",
        zeroHint: "Mettez 0 si vous ne facturez pas de TVA.",
      }
    : {
        name: "Taxe sur les ventes",
        rateLabel: "Taux de taxe par défaut",
        zeroHint: "Mettez 0 si vous ne facturez pas de taxe.",
      };
}

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

/**
 * Route guard for the screens that only make sense for a business established
 * in France (URSSAF, TVA, plafond, virement). One named guard, four explicit
 * call sites — grep `requireFrenchFiscality` to find every gated screen.
 */
export function requireFrenchFiscality(user: UserData): void {
  if (!user.hasFrenchFiscality) {
    throw redirect({ to: "/week" });
  }
}
