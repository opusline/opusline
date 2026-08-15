import { expect, it } from "vitest";

import { hasEuVat, searchCountries } from "./countries";

it("matches a country by its French name", () => {
  expect(searchCountries("fr-FR", "Belg")).toEqual([
    { id: "BE", label: "Belgique" },
  ]);
});

it("ignores accents and case when matching", () => {
  expect(searchCountries("fr-FR", "etats")).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: "US" })]),
  );
});

it("offers nothing until something is typed", () => {
  expect(searchCountries("fr-FR", "")).toEqual([]);
  expect(searchCountries("fr-FR", "   ")).toEqual([]);
});

it("returns nothing for a country outside the list", () => {
  expect(searchCountries("fr-FR", "Wakanda")).toEqual([]);
});

it("recognizes the EU VAT area by ISO code, Greece included", () => {
  expect(hasEuVat("FR")).toBe(true);
  expect(hasEuVat("DE")).toBe(true);
  expect(hasEuVat("GR")).toBe(true);
});

it("leaves non-EU countries out of the VAT area", () => {
  expect(hasEuVat("CA")).toBe(false);
  expect(hasEuVat("CH")).toBe(false);
  expect(hasEuVat("GB")).toBe(false);
});
