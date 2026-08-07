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

const regionNames = new Intl.DisplayNames(["fr"], { type: "region" });

export type CountrySuggestion = { id: string; label: string };

const COUNTRIES: CountrySuggestion[] = REGION_CODES.map((code) => ({
  id: code,
  label: regionNames.of(code) ?? code,
})).sort((left, right) => left.label.localeCompare(right.label, "fr"));

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function searchCountries(query: string): CountrySuggestion[] {
  const needle = fold(query.trim());

  if (needle === "") {
    return [];
  }

  return COUNTRIES.filter((country) =>
    fold(country.label).startsWith(needle),
  ).slice(0, 8);
}
