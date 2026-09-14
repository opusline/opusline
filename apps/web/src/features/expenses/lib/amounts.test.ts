import { expect, it } from "vitest";

import { isAmountUnit } from "./amounts";

it.each(["ht", "ttc"])("reads %s as an amount unit", (value) => {
  expect(isAmountUnit(value)).toBe(true);
});

it.each(["HT", "tva", "", null, undefined])(
  "refuses %s as an amount unit",
  (value) => {
    expect(isAmountUnit(value)).toBe(false);
  },
);
