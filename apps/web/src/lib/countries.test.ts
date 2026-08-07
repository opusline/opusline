import { expect, it } from "vitest";

import { searchCountries } from "./countries";

it("matches a country by its French name", () => {
  expect(searchCountries("Belg")).toEqual([{ id: "BE", label: "Belgique" }]);
});

it("ignores accents and case when matching", () => {
  expect(searchCountries("etats")).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: "US" })]),
  );
});

it("offers nothing until something is typed", () => {
  expect(searchCountries("")).toEqual([]);
  expect(searchCountries("   ")).toEqual([]);
});

it("returns nothing for a country outside the list", () => {
  expect(searchCountries("Wakanda")).toEqual([]);
});
