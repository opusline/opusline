import type {
  UrssafPeriodicity,
  UserData,
  VatRegime,
} from "@opusline/api-client";
import { redirect } from "@tanstack/react-router";

import { m } from "@/paraglide/messages.js";

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
        name: m.fiscality_vat_name(),
        rateLabel: m.fiscality_vat_rate_label(),
        zeroHint: m.fiscality_vat_zero_hint(),
      }
    : {
        name: m.fiscality_sales_tax_name(),
        rateLabel: m.fiscality_sales_tax_rate_label(),
        zeroHint: m.fiscality_sales_tax_zero_hint(),
      };
}

export const URSSAF_PERIODICITIES: UrssafPeriodicity[] = [0, 1];

const URSSAF_PERIODICITY_MESSAGES: Record<UrssafPeriodicity, () => string> = {
  0: m.urssaf_periodicity_monthly,
  1: m.urssaf_periodicity_quarterly,
};

export function urssafPeriodicityLabel(periodicity: UrssafPeriodicity): string {
  return URSSAF_PERIODICITY_MESSAGES[periodicity]();
}

export const VAT_REGIMES: VatRegime[] = [0, 1, 2];

export const VAT_REGIME_MESSAGES: Record<
  VatRegime,
  { label: () => string; hint: () => string; note: () => string }
> = {
  0: {
    label: m.vat_regime_franchise_label,
    hint: m.vat_regime_franchise_hint,
    note: m.vat_regime_franchise_note,
  },
  1: {
    label: m.vat_regime_simplified_label,
    hint: m.vat_regime_simplified_hint,
    note: m.vat_regime_simplified_note,
  },
  2: {
    label: m.vat_regime_normal_label,
    hint: m.vat_regime_normal_hint,
    note: m.vat_regime_normal_note,
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
