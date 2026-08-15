import type { Locale } from "@opusline/api-client";

const REGION_CODES = [
  "FR",
  "BE",
  "CH",
  "LU",
  "DE",
  "ES",
  "IT",
  "PT",
  "NL",
  "IE",
  "AT",
  "DK",
  "SE",
  "FI",
  "NO",
  "IS",
  "PL",
  "CZ",
  "SK",
  "HU",
  "RO",
  "BG",
  "HR",
  "SI",
  "GR",
  "CY",
  "MT",
  "EE",
  "LV",
  "LT",
  "GB",
  "US",
  "CA",
  "AU",
  "NZ",
  "JP",
  "SG",
  "AE",
  "MA",
  "TN",
  "DZ",
  "SN",
  "CI",
  "BR",
  "MX",
  "IN",
];

export type CountrySuggestion = { id: string; label: string };

const countryOptionsByLocale = new Map<Locale, CountrySuggestion[]>();

export function countryOptions(locale: Locale): CountrySuggestion[] {
  let options = countryOptionsByLocale.get(locale);

  if (options === undefined) {
    const regionNames = new Intl.DisplayNames([locale], { type: "region" });
    options = REGION_CODES.map((code) => ({
      id: code,
      label: regionNames.of(code) ?? code,
    })).sort((left, right) => left.label.localeCompare(right.label, locale));
    countryOptionsByLocale.set(locale, options);
  }

  return options;
}

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function searchCountries(
  locale: Locale,
  query: string,
): CountrySuggestion[] {
  const needle = fold(query.trim());

  if (needle === "") {
    return [];
  }

  return countryOptions(locale)
    .filter((country) => fold(country.label).startsWith(needle))
    .slice(0, 8);
}

/**
 * ISO codes, not VAT prefixes — Greece is GR here even though its VAT numbers
 * start with EL. Gates the « TVA intracommunautaire » field and the TVA naming
 * for businesses established abroad.
 */
const EU_VAT_COUNTRIES = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
]);

export function hasEuVat(countryCode: string): boolean {
  return EU_VAT_COUNTRIES.has(countryCode);
}
